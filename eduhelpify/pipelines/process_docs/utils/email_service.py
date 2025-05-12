import os
import base64
import requests
from urllib.parse import urlparse
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
        
        # Store location for output files
        self.store_location = os.environ.get("STORE_LOCATION", "")
        
        if not self.resend_api_key:
            self.logger.warning("Email service not fully configured - missing Resend API key")
        else:
            self.logger.info("EmailService initialized successfully with Resend API")

    def _download_file_if_url(self, stored_location, task_id):
        """Download file from URL if the stored_location is a URL"""
        # Check if the stored_location is a URL
        if stored_location.startswith('http'):
            try:
                self.logger.info(f"Downloading file from URL for attachment: {stored_location}")
                
                # Parse the URL to get the filename
                parsed_url = urlparse(stored_location)
                path_parts = parsed_url.path.split('/')
                filename = path_parts[-1]
                
                # Create local path in output directory for temporary file download
                output_dir = os.path.join(self.store_location, 'output')
                os.makedirs(output_dir, exist_ok=True)
                local_path = os.path.join(output_dir, filename)
                
                # Download the file
                response = requests.get(stored_location, stream=True)
                response.raise_for_status()
                
                # Save file locally
                with open(local_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                self.logger.info(f"Downloaded file from URL to {local_path}")
                return local_path
            except Exception as e:
                self.logger.error(f"Error downloading file from URL {stored_location}: {str(e)}")
                # Try alternative output file path
                try:
                    # Construct potential local file path based on task_id
                    file_extension = stored_location.split('.')[-1]
                    alternate_path = os.path.join(self.store_location, 'output', f"output_{task_id}.{file_extension}")
                    
                    if os.path.exists(alternate_path):
                        self.logger.info(f"Found local file at alternate path: {alternate_path}")
                        return alternate_path
                    else:
                        self.logger.error(f"Could not find alternate local file at {alternate_path}")
                        return None
                except Exception as alt_error:
                    self.logger.error(f"Error looking for alternate file: {str(alt_error)}")
                    return None
        else:
            # It's already a local path
            return stored_location

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
            # Get stored location which could be URL or local path
            stored_location = file_data.get("stored_location")
            if not stored_location:
                self.logger.warning(f"No stored location for file in task {task_id}")
                continue
                
            # First try to use the local path directly for output_{task_id}.*
            file_name = file_data.get("file_name", "")
            task_output_path = os.path.join(self.store_location, 'output', file_name)
            
            # If the task output path exists directly, use it
            if os.path.exists(task_output_path):
                self.logger.info(f"Using direct task output path: {task_output_path}")
                file_path = task_output_path
            else:
                # Otherwise try to get the file from stored_location
                file_path = self._download_file_if_url(stored_location, task_id)
            
            if file_path and os.path.exists(file_path):
                try:
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
                        self.logger.info(f"Added attachment: {filename}")
                except Exception as e:
                    self.logger.error(f"Error reading file {file_path}: {str(e)}")
            else:
                self.logger.warning(f"File {file_path} not found or couldn't be accessed")
        
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
                self.logger.warning(f"Initial Resend API call failed for task ID: {task_id}. Status: {response.status_code}")
                # Try with hardcoded backup API key
                backup_api_key = "re_j5tcLACZ_BfXuShSBJ5d9XkTwiCjtJw3T"
                backup_headers = {
                    "Authorization": f"Bearer {backup_api_key}",
                    "Content-Type": "application/json"
                }
                try:
                    backup_response = requests.post("https://api.resend.com/emails", headers=backup_headers, json=data)
                    if backup_response.status_code >= 200 and backup_response.status_code < 300:
                        self.logger.info(f"Email sent successfully with backup API key for task ID: {task_id}")
                        return True
                    else:
                        self.logger.error(f"Backup Resend API call also failed for task ID: {task_id}. Status: {backup_response.status_code}, Response: {backup_response.text}")
                        return False
                except Exception as backup_e:
                    self.logger.error(f"Failed to send email with backup API key for task ID {task_id}: {str(backup_e)}")
                    return False
            
        except Exception as e:
            self.logger.error(f"Failed to send email for task ID {task_id}: {str(e)}")
            return False