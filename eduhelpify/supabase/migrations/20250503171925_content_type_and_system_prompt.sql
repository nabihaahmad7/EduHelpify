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
  ('c0a80101-0000-0000-0000-000000000014', 'ODT', ARRAY['.odt'])

ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  extensions = EXCLUDED.extensions;

-- Add system prompts for different output types

-- PDF output prompt
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached {input_file_type}. And follow these instructions:

"structure": Return the content in PDF-ready format.

"pdf_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000001', -- PDF input
  'c0a80101-0000-0000-0000-000000000001'  -- PDF output
);

-- JSON output prompt (for PPTX)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached {input_file_type}. And follow these instructions:

"structure": Return content in JSON format. Create a structured representation with slides, sections, and content elements.
Example format:
{
  "Slide 1": {
    "title": "Introduction",
    "content": ["Purpose of presentation", "Agenda items", "Key points"]
  },
  "Slide 2": {
    "title": "Main Content",
    "content": ["Point 1", "Point 2", "Supporting details"]
  }
}

"json_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000011', -- PPTX input
  'c0a80101-0000-0000-0000-000000000006'  -- JSON output
);

-- Markdown output prompt (for TXT)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached text document. And follow these instructions:

"structure": Return content in Markdown format

"markdown_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000003', -- TXT input
  'c0a80101-0000-0000-0000-000000000005'  -- MARKDOWN output
);

-- Markdown output prompt (for DOCX)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached Word document. And follow these instructions:

"structure": Return content in Markdown format.

"markdown_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000002', -- DOCX input
  'c0a80101-0000-0000-0000-000000000005'  -- MARKDOWN output
);

-- Generic prompt for image input with markdown output
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached image. And follow these instructions:

"structure": Return content in Markdown format

"markdown_ready": true,  
"difficulty_level": "{difficulty_level}",  
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000004', -- IMAGE input
  'c0a80101-0000-0000-0000-000000000005'  -- MARKDOWN output
);