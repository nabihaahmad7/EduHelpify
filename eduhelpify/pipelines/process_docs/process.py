import os
import json
from utils.helper import (
    get_pending_task, 
    update_task_status, 
    get_task_config, 
    get_input_file, 
    get_system_prompt, 
    read_file_content,
    get_content_type_info,
    create_ai_chain,
    save_output_file
)

def process_task():
    # Get a pending task
    task = get_pending_task()
    if not task:
        print("No pending tasks found.")
        return
    
    # Update task status to Processing
    update_task_status(task["id"], "Processing")
    print(f"Processing task: {task['id']}")
    
    # Get task configuration
    task_config = get_task_config(task["task_config_id"])
    if not task_config:
        print(f"Task config not found for task: {task['id']}")
        update_task_status(task["id"], "Failed")
        return
    
    # Get input file
    input_file = get_input_file(task["id"])
    if not input_file:
        print(f"Input file not found for task: {task['id']}")
        update_task_status(task["id"], "Failed")
        return
    
    # Get the file content
    file_content = read_file_content(input_file["stored_location"])
    
    # Get output content type info
    output_type = get_content_type_info(task["output_content_type_id"])
    if not output_type:
        print(f"Output content type not found for task: {task['id']}")
        update_task_status(task["id"], "Failed")
        return
    
    # Get system prompt
    system_prompt = get_system_prompt(task["input_content_type_id"], task["output_content_type_id"])
    if not system_prompt:
        print(f"System prompt not found for task: {task['id']}")
        update_task_status(task["id"], "Failed")
        return
    
    # Add focus area from task config if available
    focus_area = task_config.get("focus_area", "")
    prompt_text = system_prompt["prompt"]
    if focus_area:
        prompt_text = f"{prompt_text}\nFocus area: {focus_area}"
    
    # Create chain and run it
    chain = create_ai_chain(prompt_text)
    
    try:
        # Process with AI
        result = chain.invoke({"input": file_content})
        
        # Determine file extension based on output type
        file_extension = "txt"  # Default
        if output_type["name"]:
            if output_type["name"].lower() == "json":
                file_extension = "json"
            elif output_type["name"].lower() == "html":
                file_extension = "html"
            # Add more output types as needed
        
        # Save output to a new file in FileStore
        output_data = {
            "task_id": task["id"],
            "file_name": f"output_{task['id']}.{file_extension}",
            "file_type_id": task["output_content_type_id"],
            "need_ocr": False,
            "stored_location": f"./outputs/output_{task['id']}.{file_extension}",
            "file_category": "output",
            "data_value": json.dumps({"content": str(result.content)})
        }
        
        # Save output file and record in database
        save_output_file(output_data, str(result.content))
        
        # Update task status to Completed
        update_task_status(task["id"], "Completed")
        print(f"Task {task['id']} completed successfully.")
        
    except Exception as e:
        print(f"Error processing task {task['id']}: {str(e)}")
        update_task_status(task["id"], "Failed")

if __name__ == "__main__":
    process_task()