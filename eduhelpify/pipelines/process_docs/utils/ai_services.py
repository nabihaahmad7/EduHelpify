from typing import Any
import google.generativeai as genai
import os
import mimetypes
from .logger import Logger



class AiServices:
    def __init__(self, api_key=None, model_name="gemini-2.0-flash", logger=None,):
        """Initialize AiServices with API key and default model"""
        self.api_key = api_key 
        self.model_name = "gemini-2.0-flash"
      
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize logger
        self.logger = logger
        
        # Default generation config
        self.generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
        
        self.logger.info(f"AiServices initialized with model: {self.model_name}")

    def upload_to_gemini(self, path: str, mime_type: str = None):
        """Uploads the given file to Gemini with automatic mime type detection if not provided."""
        self.logger.info(f"Started uploading: {path}")
        if not os.path.exists(path):
            error_msg = f"File not found at path: {path}"
            self.logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        # Normalize the path to handle spaces and special characters
        path = os.path.normpath(path)
        
        # Auto-detect mime type if not provided
        if mime_type is None:
            mime_type = mimetypes.guess_type(path)[0]
            if mime_type is None:
                self.logger.warning(f"Could not detect mime type for {path}. Gemini will attempt to determine the type.")

        try:
            file = genai.upload_file(str(path), mime_type=mime_type)
            self.logger.info(f"Uploaded file '{file.display_name}' as: {file.uri} (type: {mime_type or 'auto-detected'})")
            return file
        except Exception as e:
            error_msg = f"Upload failed: {str(e)}"
            self.logger.error(error_msg)
            raise

    def process_mixed_files(self, file_paths: list, system_prompt: str, user_prompt: str, 
                           output_path: str = "response.txt", model_name: str = None ):
        """Process multiple files of mixed types with Gemini using chat mode"""
        
        # Use provided model name or default to instance model name
        model_name = model_name or self.model_name
        
        # Initialize model with system prompt
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=self.generation_config,
            system_instruction=system_prompt
        )
        
        try:
            # Upload all files to Gemini
            uploaded_files = []
            for file_path in file_paths:
                self.logger.info(f"UPLOADING: {file_path}")
                uploaded_file = self.upload_to_gemini(file_path)
                uploaded_files.append(uploaded_file)
            
            # Start chat session
            chat = model.start_chat()
            
            # Create message content with all files and the prompt
            message_content = uploaded_files + [user_prompt]
            
            # Send message with files and prompt
            self.logger.info("Sending message to Gemini with files and prompt")
            response = chat.send_message(
                message_content,
                request_options={"timeout": 1000},
            )
            
            self.logger.info("Received response from Gemini")
            self.logger.info(response.text)
            # Save response
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(response.text)
            self.logger.info(f"Response saved to {output_path}")
            
            return response.text
            
        except Exception as e:
            error_msg = f"Error processing files: {str(e)}"
            self.logger.error(error_msg)
            raise
    
    def set_generation_config(self, temperature=None, top_p=None, top_k=None, 
                             max_output_tokens=None, response_mime_type=None):
        """Update generation configuration parameters"""
        if temperature is not None:
            self.generation_config["temperature"] = temperature
        if top_p is not None:
            self.generation_config["top_p"] = top_p
        if top_k is not None:
            self.generation_config["top_k"] = top_k
        if max_output_tokens is not None:
            self.generation_config["max_output_tokens"] = max_output_tokens
        if response_mime_type is not None:
            self.generation_config["response_mime_type"] = response_mime_type
        
        self.logger.info(f"Updated generation config: {self.generation_config}")
        return self.generation_config


