import os
from supabase import create_client
from .logger import Logger
import dotenv

dotenv.load_dotenv(override=True)

class DatabaseService:
    def __init__(self,logger):
        # Initialize Supabase client
        self.logger = logger
        self.url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        self.key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        self.supabase = create_client(self.url, self.key)
        self.logger.info("DatabaseService initialized with Supabase client")
    def get_queued_tasks(self):
        """Get tasks with 'Queued' status from Supabase"""
        self.logger.info("Fetching queued tasks")
        response = self.supabase.table("task").select("*").eq("status", "QUEUED").execute()
        
        if response.data and len(response.data) > 0:
            self.logger.info(f"Found {len(response.data)} queued tasks")
            return response.data
        self.logger.info("No queued tasks found")
        return []

    def get_task_config(self, task_id):
        """Get the task configuration for a given task_id"""
        response = self.supabase.table("task").select("task_config_id").eq("id", task_id).execute()
        
        if response.data and len(response.data) > 0:
            task_config_id = response.data[0]["task_config_id"]
            config_response = self.supabase.table("taskconfig").select("*").eq("id", task_config_id).execute()
            if config_response.data and len(config_response.data) > 0:
                return config_response.data[0]
        return None


    def get_system_prompt(self, output_file_type):
        """Get the appropriate system prompt based on output file type"""
        response = self.supabase.table("systemprompts").select("*")\
            .eq("output_content_type_id", output_file_type)\
            .execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None

    def get_files_by_task_and_type(self, task_id, file_type):
        """Get all FileStore rows for a given task_id and file_type"""
        response = self.supabase.table("filestore").select("*")\
            .eq("task_id", task_id)\
            .eq("file_category", file_type)\
            .execute()
        if response.data and len(response.data) > 0:
            return response.data
        return []

    def update_task_status(self, task_id, status):
        """Update the status of a task"""
        status = status.upper()
        self.supabase.table("task").update({"status": status}).eq("id", task_id).execute()
        return True

    def store_file(self, task_id, file_type, file_path, content):
        """Store a file in FileStore for a given task_id and file_type"""
        # Ensure directories exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Save file content
        with open(file_path, 'w',encoding='utf-8') as file:
            file.write(content)
        
        # Create file store record
        file_data = {
            "task_id": task_id,
            "file_category": file_type,
            "stored_location": file_path,
            "file_name": os.path.basename(file_path)
        }
        
        # Store file record in database
        response = self.supabase.table("filestore").insert(file_data).execute()
        return response.data[0] if response.data else None
        
    def get_user_details(self, task_id):
        """Get the email and username for the user associated with a task
        
        Args:
            task_id: The UUID of the task
            
        Returns:
            dict: A dictionary containing the user's email and username, or None if not found
        """
        self.logger.info(f"Fetching user details for task ID: {task_id}")
        
        # First, get the user_id from the task table
        task_response = self.supabase.table("task").select("user_id").eq("id", task_id).execute()
        
        if not task_response.data or len(task_response.data) == 0:
            self.logger.warning(f"No task found with ID: {task_id}")
            return None
        
        user_id = task_response.data[0]["user_id"]
        
        if not user_id:
            self.logger.warning(f"task {task_id} has no associated user_id")
            return None
        
        # Then, get the user details from the User table
        user_response = self.supabase.table("User").select("email, username").eq("id", user_id).execute()
        
        if not user_response.data or len(user_response.data) == 0:
            self.logger.warning(f"No user found with ID: {user_id}")
            return None
        
        user_data = user_response.data[0]
        self.logger.info(f"Found user details for task ID: {task_id}")
        
        return {
            "email": user_data["email"],
            "username": user_data.get("username", None)  # Username could be null
        }