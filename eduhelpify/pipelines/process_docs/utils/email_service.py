import os
import sendgrid
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition, ContentId
import base64
from datetime import datetime
from .logger import Logger
from .database_service import DatabaseService

class EmailService:
    def __init__(self, logger, db_service):
        """Initialize the EmailService with logger and database connection"""
        self.logger = logger
        self.db_service = db_service
        
        # SendGrid configuration from environment variables
        self.sendgrid_api_key = os.environ.get("SENDGRID_API_KEY")
        self.sender_email = os.environ.get("SENDER_EMAIL")
        
        if not all([self.sendgrid_api_key, self.sender_email]):
            self.logger.warning("Email service not fully configured - missing credentials")
        else:
            self.sg_client = sendgrid.SendGridAPIClient(api_key=self.sendgrid_api_key)
            self.logger.info("EmailService initialized successfully with SendGrid")

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
        body = f"""
        Hello {username},
        
        Your document processing task has been completed successfully.
        
        The processed file(s) are attached to this email.
        
        Thank you for using our service!
        
        Regards,
        EduHelpify Team
        """
        
        message = Mail(
            from_email=self.sender_email,
            to_emails=user_details["email"],
            subject="Your document processing task is complete",
            plain_text_content=body
        )
        
        # Attach output files
        files_attached = 0
        for file_data in output_files:
            file_path = file_data.get("stored_location")
            if file_path and os.path.exists(file_path):
                with open(file_path, 'rb') as file:
                    file_content = file.read()
                    filename = os.path.basename(file_path)
                    
                    # Detect file type
                    file_type = 'application/octet-stream'  # Default
                    if filename.endswith('.pdf'):
                        file_type = 'application/pdf'
                    elif filename.endswith('.json'):
                        file_type = 'application/json'
                    elif filename.endswith('.html'):
                        file_type = 'text/html'
                    elif filename.endswith('.txt'):
                        file_type = 'text/plain'
                    
                    # Create attachment
                    encoded_file = base64.b64encode(file_content).decode()
                    attachment = Attachment()
                    attachment.file_content = FileContent(encoded_file)
                    attachment.file_name = FileName(filename)
                    attachment.file_type = FileType(file_type)
                    attachment.disposition = Disposition('attachment')
                    attachment.content_id = ContentId(filename)
                    
                    message.add_attachment(attachment)
                    files_attached += 1
            else:
                self.logger.warning(f"File {file_path} not found or doesn't exist")
        
        if files_attached == 0:
            self.logger.error(f"No attachable files found for task ID: {task_id}")
            return False
            
        try:
            # Send email via SendGrid
            response = self.sg_client.send(message)
            
            # Check response status
            if 200 <= response.status_code < 300:
                self.logger.info(f"Email sent successfully to {user_details['email']} for task ID: {task_id}")
                return True
            else:
                self.logger.error(f"SendGrid API returned status code {response.status_code} for task ID: {task_id}")
                return False
            
        except Exception as e:
            self.logger.error(f"Failed to send email for task ID {task_id}: {str(e)}")
            return False