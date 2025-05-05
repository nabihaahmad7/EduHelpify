import os
import base64
import requests
from datetime import datetime
from .logger import Logger
from .database_service import DatabaseService
import dotenv
dotenv.load_dotenv(override=True)    
class EmailService:
    def __init__(self, logger, db_service):
        """Initialize the EmailService with logger and database connection"""
        self.logger = logger
        self.db_service = db_service
        
        # Resend API configuration from environment variables
        self.resend_api_key = os.environ.get("RESEND_API_KEY")
        self.sender_email = os.environ.get("SENDER_EMAIL", "noreply@resend.dev")
        self.sender_name = os.environ.get("SENDER_NAME", "EduHelpify Team")
        
        if not self.resend_api_key:
            self.logger.warning("Email service not fully configured - missing Resend API key")
        else:
            self.logger.info("EmailService initialized successfully with Resend API")

    def send_task_output(self, task_id):
        """Send the output file of a completed task to the user
        
        Args:
            task_id: The UUID of the task
            
        Returns:
            bool: True if the email was sent successfully, False otherwise
        """
        self.logger.info(f"Preparing to send output for task ID: {task_id}")
        
        # Get user details from database
        user_details = self.db_service.get_user_details(task_id)
        if not user_details or not user_details.get("email"):
            self.logger.error(f"No user email found for task ID: {task_id}")
            return False
        
        # Get output files for the task
        output_files = self.db_service.get_files_by_task_and_type(task_id, "output")
        if not output_files:
            self.logger.error(f"No output files found for task ID: {task_id}")
            return False
        
        # Create email message
        username = user_details.get("username", "User")
        email_body = f"""
        <p>Hello {username},</p>
        
        <p>Your document processing task has been completed successfully.</p>
        
        <p>The processed file(s) are attached to this email.</p>
        
        <p>Thank you for using our service!</p>
        
        <p>Regards,<br>
        EduHelpify Team</p>
        """
        
        # Prepare attachments
        files_attached = 0
        attachments = []
        
        for file_data in output_files:
            file_path = file_data.get("stored_location")
            if file_path and os.path.exists(file_path):
                with open(file_path, 'rb') as file:
                    file_content = file.read()
                    filename = os.path.basename(file_path)
                    
                    # Create attachment for Resend
                    attachment = {
                        "filename": filename,
                        "content": base64.b64encode(file_content).decode('utf-8')
                    }
                    
                    attachments.append(attachment)
                    files_attached += 1
            else:
                self.logger.warning(f"File {file_path} not found or doesn't exist")
        
        if files_attached == 0:
            self.logger.error(f"No attachable files found for task ID: {task_id}")
            return False
        
        # Prepare Resend API request
        headers = {
            "Authorization": f"Bearer {self.resend_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "from": f"{self.sender_name} <{self.sender_email}>",
            "to": user_details["email"],
            "subject": "Your document processing task is complete",
            "html": email_body,
            "attachments": attachments
        }
            
        try:
            # Send email via Resend API
            response = requests.post("https://api.resend.com/emails", headers=headers, json=data)
            
            # Check response status
            if response.status_code >= 200 and response.status_code < 300:
                self.logger.info(f"Email sent successfully to {user_details['email']} for task ID: {task_id}")
                return True
            else:
                self.logger.error(f"Resend API failed for task ID: {task_id}. Status: {response.status_code}, Response: {response.text}")
                return False
            
        except Exception as e:
            self.logger.error(f"Failed to send email for task ID {task_id}: {str(e)}")
            return False