-- Migration to add system prompts for different content types
-- First, add extensions column to ContentType table if it doesn't exist
ALTER TABLE ContentType ADD COLUMN IF NOT EXISTS extensions TEXT[];

-- Insert or update content types with specific UUIDs and their extensions
INSERT INTO ContentType (id, name, extensions) VALUES 
  ('c0a80101-0000-0000-0000-000000000001', 'PDF', ARRAY['.pdf']),
  ('c0a80101-0000-0000-0000-000000000002', 'DOCX', ARRAY['.docx', '.doc']),
  ('c0a80101-0000-0000-0000-000000000003', 'TXT', ARRAY['.txt']),
  ('c0a80101-0000-0000-0000-000000000004', 'IMAGE', ARRAY['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']),
  ('c0a80101-0000-0000-0000-000000000005', 'MARKDOWN', ARRAY['.md', '.markdown']),
  ('c0a80101-0000-0000-0000-000000000006', 'JSON', ARRAY['.json']),
  ('c0a80101-0000-0000-0000-000000000007', 'HTML', ARRAY['.html', '.htm']),
  ('c0a80101-0000-0000-0000-000000000008', 'CSV', ARRAY['.csv']),
  ('c0a80101-0000-0000-0000-000000000009', 'XLSX', ARRAY['.xlsx']),
  ('c0a80101-0000-0000-0000-000000000010', 'XLS', ARRAY['.xls']),
  ('c0a80101-0000-0000-0000-000000000011', 'PPTX', ARRAY['.pptx']),
  ('c0a80101-0000-0000-0000-000000000012', 'PPT', ARRAY['.ppt']),
  ('c0a80101-0000-0000-0000-000000000013', 'RTF', ARRAY['.rtf']),
  ('c0a80101-0000-0000-0000-000000000014', 'ODT', ARRAY['.odt']),
  ('c0a80101-0000-0000-0000-000000000015', 'MP3', ARRAY['.mp3']),
  ('c0a80101-0000-0000-0000-000000000016', 'MP4', ARRAY['.mp4']),
  ('c0a80101-0000-0000-0000-000000000018', 'WAV', ARRAY['.wav']),
  ('c0a80101-0000-0000-0000-000000000021', 'MULTIMEDIA',ARRAY['.ppt','pdf','doc','docx','txt','md','json','html','csv','xlsx','xls','pptx','mp3','mp4','wav'])

ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  extensions = EXCLUDED.extensions;

-- Add system prompts for different output types

  INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
  VALUES (
    'You are a good educational helper. Please analyze the attached documents and media files.If required any ocr or text extraction or audio transcription, do it. And follow these instructions:

  "structure": Return content in Markdown format

  "markdown_ready": true,  
  "difficulty_level": "{difficulty_level}",  
  "content_length": "{content_length}"',
    'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
    'c0a80101-0000-0000-0000-000000000005'  -- MARKDOWN output
  );
  
  

-- DOCX/DOC output prompt
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached {input_file_type}. And follow these instructions:

"structure": Return the content in DOCX-ready format.

"docx_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000002'  -- DOCX output
);

-- PDF output prompt from MULTIMEDIA
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached {input_file_type}. And follow these instructions:

"structure": Return the content in PDF-ready format.

"pdf_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000001'  -- PDF output
);

-- PPTX output prompt
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached {input_file_type}. And follow these instructions:

"structure": Return the content in presentation format. Structure with slides, bullet points, and clear sections.

"pptx_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000011'  -- PPTX output
);

-- TXT output prompt
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached {input_file_type}. And follow these instructions:

"structure": Return the content in plain text format.

"txt_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000003'  -- TXT output
);