import os
import base64
from datetime import datetime
from mailersend import emails
from .logger import Logger
from .database_service import DatabaseService
import dotenv
dotenv.load_dotenv(override=True)    
class EmailService:
    def __init__(self, logger, db_service):
        """Initialize the EmailService with logger and database connection"""
        self.logger = logger
        self.db_service = db_service
        
        # MailerSend configuration from environment variables
        self.mailersend_api_key = os.environ.get("MAILERSEND_API_KEY")
        self.sender_email = os.environ.get("SENDER_EMAIL")
        self.sender_name = os.environ.get("SENDER_NAME", "EduHelpify Team")
        self.sender_domain = os.environ.get("test-eqvygm00x2zl0p7w.mlsender.net")
        
        if not all([self.mailersend_api_key, self.sender_email]):
            self.logger.warning("Email service not fully configured - missing credentials")
        else:
            self.mailer = emails.NewEmail(self.mailersend_api_key)
            self.logger.info("EmailService initialized successfully with MailerSend")

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
        Hello {username},
        
        Your document processing task has been completed successfully.
        
        The processed file(s) are attached to this email.
        
        Thank you for using our service!
        
        Regards,
        EduHelpify Team
        """
        
        # Initialize MailerSend mail body
        mail_body = {}
        
        # Set sender info
        mail_from = {
            "name": self.sender_name,
            "email": self.sender_email,
            "domain": self.sender_domain if hasattr(self, 'sender_domain') else self.sender_email.split('@')[1]
        }
        # Set recipient info
        recipients = [
            {
                "name": username,
                "email": user_details["email"],
            }
        ]
        
        # Configure email
        self.mailer.set_mail_from(mail_from, mail_body)
        self.mailer.set_mail_to(recipients, mail_body)
        self.mailer.set_subject("Your document processing task is complete", mail_body)
        self.mailer.set_html_content(email_body, mail_body)
        self.mailer.set_plaintext_content(email_body, mail_body)
        
        # Attach output files
        files_attached = 0
        attachments = []
        
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
                    
                    # Create attachment for MailerSend
                    attachment = {
                        "filename": filename,
                        "content": base64.b64encode(file_content).decode('utf-8'),
                        "disposition": "attachment"
                    }
                    
                    attachments.append(attachment)
                    files_attached += 1
            else:
                self.logger.warning(f"File {file_path} not found or doesn't exist")
        
        if files_attached == 0:
            self.logger.error(f"No attachable files found for task ID: {task_id}")
            return False
            
        # Add attachments to the email
        mail_body["attachments"] = attachments
            
        try:
            # Send email via MailerSend
            response = self.mailer.send(mail_body)
            
            # Check response status
            if response and hasattr(response, 'status_code') and 200 <= response.status_code < 300:
                self.logger.info(f"Email sent successfully to {user_details['email']} for task ID: {task_id}")
                return True
            else:
                self.logger.error(f"MailerSend API failed for task ID: {task_id}")
                return False
            
        except Exception as e:
            self.logger.error(f"Failed to send email for task ID {task_id}: {str(e)}")
            return False