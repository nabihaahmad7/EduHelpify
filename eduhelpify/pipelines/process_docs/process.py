import os
import json
from flask import Flask, request, jsonify
from utils.logger import Logger
from utils.database_service import DatabaseService
from utils.ai_services import AiServices
from utils.email_service import EmailService
import dotenv

dotenv.load_dotenv(override=True)
STORE_LOCATION = os.getenv("STORE_LOCATION")
app = Flask(__name__)

# Initialize services
logger = Logger(log_file="eduhelpify.log")
db_service = DatabaseService(logger)
ai_service = AiServices(logger=logger)
email_service = EmailService(logger, db_service)

@app.route('/')
def home():
    return jsonify({"status": "running", "service": "EduHelpify Document Processing API"})

@app.route('/process/<task_id>', methods=['POST'])
def process_task_by_id(task_id):
    """Process a specific task by ID"""
    try:
        # Update task status to Processing
        db_service.update_task_status(task_id, "INPROGRESS")
        logger.info(f"Processing task: {task_id}")
        
        # Get task details
        task_response = db_service.supabase.table("task").select("*").eq("id", task_id).execute()
        if not task_response.data or len(task_response.data) == 0:
            logger.error(f"Task not found: {task_id}")
            return jsonify({"status": "error", "message": "Task not found"}), 404
        
        task = task_response.data[0]
        output_content_type_id = task.get("output_content_type_id")
        output_content_type_response = db_service.supabase.table("contenttype").select("*").eq("id", output_content_type_id).execute()
        logger.info(f"Output content type response: {output_content_type_response}")
        if not output_content_type_response.data or len(output_content_type_response.data) == 0:
            logger.error(f"Output content type not found: {output_content_type_id}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": "Output content type not found"}), 400
        
        output_content_type = output_content_type_response.data[0]
        output_content_type_extension = output_content_type.get("extensions")[0].replace(".", "")
        logger.info(f"Output content type: {output_content_type_extension}")
        
        # 1. Get the task_config_id from the task
        task_config_id = task.get("task_config_id")
        if not task_config_id:
            logger.error(f"Task config ID not found for task: {task_id}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": "Task config ID not found"}), 400
        
        # 2. Get the task_config
        task_config = db_service.get_task_config(task_id)
        if not task_config:
            logger.error(f"Task config not found for task: {task_id}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": "Task config not found"}), 400
        
        # 3. Get the system_prompt based on input and output content types
        system_prompt = db_service.get_system_prompt(task["output_content_type_id"])
        if not system_prompt:
            logger.error(f"System prompt not found for task: {task_id}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": "System prompt not found"}), 400
        
        # Add focus area from task config if available
        focus_area = task_config.get("focus_area", "")
        content_length = task_config.get("content_length", "")
        difficulty_level = task_config.get("difficulty_level", "")

        prompt_text = system_prompt["prompt"]
        # Replace placeholders in the prompt
        prompt_text = prompt_text.replace("{difficulty_level}", difficulty_level)
        prompt_text = prompt_text.replace("{content_length}", content_length)

        if focus_area:
            prompt_text = f"{prompt_text}\nFocus on: {focus_area}"
        
        # 4. Get the task input files
        input_files = db_service.get_files_by_task_and_type(task_id, "input")
        logger.info(f"Input files: {input_files}")
        if not input_files:
            logger.error(f"No input files found for task: {task_id}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": "No input files found"}), 400
        input_dir = os.path.join(STORE_LOCATION, 'input')
        logger.info(f"Input directory: {input_dir}")
        # Extract file paths
        file_paths = [os.path.join(input_dir, file['file_name']) for file in input_files if os.path.exists(os.path.join(input_dir, file['file_name']))]
        if not file_paths:
            logger.error(f"No valid input file paths found for task: {task_id}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": "No valid input files found"}), 400
        logger.info(f"File paths: {file_paths}")
        # User prompt - can be customized based on your needs
        user_prompt = task.get("user_prompt", "")
        
        # Create output directory
        output_dir = os.path.join(STORE_LOCATION, 'output')
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"output_{task_id}.{output_content_type_extension}")
        
        try:
            # Process files with the AI service
            result = ai_service.process_mixed_files(
                file_paths=file_paths,
                system_prompt=prompt_text,
                user_prompt=user_prompt,
                output_path=output_path
            )
            
        # Determine file extension based on output type
            file_extension = "txt"  # Default
            output_type_response = db_service.supabase.table("contenttype").select("*").eq("id", task["output_content_type_id"]).execute()
            if output_type_response.data and len(output_type_response.data) > 0:
                output_type = output_type_response.data[0]
                if output_type["name"]:
                    if output_type["name"].lower() == "json":
                        file_extension = "json"
                    elif output_type["name"].lower() == "html":
                        file_extension = "html"
                    elif output_type["name"].lower() == "pdf":
                        file_extension = "pdf"
                    elif output_type["name"].lower() == "pptx":
                        file_extension = "pptx"

            # Save output file in database
            final_output_path = f"{output_dir}/output_{task_id}.{file_extension}"
            if output_path != final_output_path:
                os.rename(output_path, final_output_path)
                
            output_data = {
                "task_id": task_id,
                "file_name": f"output_{task_id}.{file_extension}",
                "file_type_id": task["output_content_type_id"],
                "stored_location": final_output_path,
                "file_category": "output",
                "need_ocr": False
            }
            
            # Store file record in database
            db_service.supabase.table("filestore").insert(output_data).execute()
            
            # 5. Send email with the results
            email_sent = email_service.send_task_output(task_id)
            if not email_sent:
                logger.warning(f"Email could not be sent for task: {task_id}")
            
            # Update task status to Completed
            db_service.update_task_status(task_id, "Completed")
            logger.info(f"Task {task_id} completed successfully")
            
            return jsonify({
                "status": "success", 
                "message": "Task processed successfully",
                "email_sent": email_sent
            })
            
        except Exception as e:
            logger.error(f"Error processing task {task_id}: {str(e)}")
            db_service.update_task_status(task_id, "Failed")
            return jsonify({"status": "error", "message": str(e)}), 500
            
    except Exception as e:
        logger.error(f"Error in process_task_by_id: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/process_queue', methods=['POST'])
def process_queue():
    """Process all queued tasks"""
    try:
        # Get all queued tasks
        queued_tasks = db_service.get_queued_tasks()
        if not queued_tasks:
            return jsonify({"status": "success", "message": "No queued tasks found"}), 200
        
        results = []
        for task in queued_tasks:
            task_id = task["id"]
            # Process each task
            response = process_task_by_id(task_id)
            results.append({
                "task_id": task_id,
                "status": "processed"
            })
        
        return jsonify({
            "status": "success", 
            "message": f"Processed {len(results)} tasks",
            "tasks": results
        })
        
    except Exception as e:
        logger.error(f"Error in process_queue: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Set Flask environment variables
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=port, debug=True)