import os
import json
from supabase import create_client
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

# Initialize Google Gemini AI
api_key = os.environ.get("GOOGLE_API_KEY")
model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)

def get_pending_task():
    """Get a task with 'Pending' status from Supabase"""
    response = supabase.table("Task").select("*").eq("status", "Pending").limit(1).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def update_task_status(task_id, status):
    """Update the status of a task"""
    supabase.table("Task").update({"status": status}).eq("id", task_id).execute()

def get_task_config(task_config_id):
    """Get the task configuration"""
    response = supabase.table("TaskConfig").select("*").eq("id", task_config_id).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def get_input_file(task_id):
    """Get the input file details for the task"""
    response = supabase.table("FileStore").select("*").eq("task_id", task_id).eq("file_category", "input").execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def get_system_prompt(input_type_id, output_type_id):
    """Get the appropriate system prompt"""
    response = supabase.table("SystemPrompts").select("*")\
        .eq("input_content_type_id", input_type_id)\
        .eq("output_content_type_id", output_type_id)\
        .execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def read_file_content(file_path):
    """Read content from a file"""
    with open(file_path, 'r') as file:
        return file.read()

def get_content_type_info(type_id):
    """Get content type information"""
    response = supabase.table("ContentType").select("*").eq("id", type_id).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None
def load_document(file_path):
    """Load a document based on its file extension"""
    file_extension = file_path.split('.')[-1].lower()
    
    if file_extension == 'pdf':
        loader = PyPDFLoader(file_path)
        return loader.load()
    elif file_extension == 'txt':
        loader = TextLoader(file_path)
        return loader.load()
    elif file_extension in ['csv', 'xlsx', 'xls']:
        loader = CSVLoader(file_path)
        return loader.load()
    else:
        # Default to text loader for unknown types
        loader = TextLoader(file_path)
        return loader.load()
def create_ai_chain(prompt_text):
    """Create an AI chain with the given prompt"""
    prompt = ChatPromptTemplate.from_template(prompt_text)
    return prompt | model

def save_output_file(output_data, content):
    """Save output to a file and record it in FileStore"""
    # Save output file
    with open(output_data["stored_location"], 'w') as file:
        file.write(content)
    
    # Store output file record
    supabase.table("FileStore").insert(output_data).execute()