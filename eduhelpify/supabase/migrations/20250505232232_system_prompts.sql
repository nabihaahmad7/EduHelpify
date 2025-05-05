-- First, delete all existing system prompts for input_content_type_id ending with 21 (MULTIMEDIA)
DELETE FROM SystemPrompts;

-- Insert system prompts for input_content_type_id ending with 21 (MULTIMEDIA)
-- with different output content type IDs (1, 2, 3, 11)

-- For PDF output (content type ID 1)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached file and convert it to the requested format. Follow these instructions:

"structure": Return the content in the appropriate format based on the output type.
"output_ready": true,

Do not include any asterisks in your response.
"difficulty_level": "{difficulty_level}",
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000001'  -- PDF output
);

-- For DOCX output (content type ID 2)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached file and convert it to the requested format. Follow these instructions:

"structure": Return the content in the appropriate format based on the output type.
"output_ready": true,

Do not include any asterisks in your response.
"difficulty_level": "{difficulty_level}",
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000002'  -- DOCX output
);

-- For TXT output (content type ID 3)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached file and convert it to the requested format. Follow these instructions:

"structure": Return the content in the appropriate format based on the output type.
"output_ready": true,

Do not include any asterisks in your response.
"difficulty_level": "{difficulty_level}",
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000003'  -- TXT output
);

-- For PPTX output (content type ID 11)
INSERT INTO SystemPrompts (prompt, input_content_type_id, output_content_type_id)
VALUES (
  'You are a good educational helper. Please analyze the attached file and convert it to the requested format. Follow these instructions:

"structure": Return the content in the appropriate format based on the output type.
"output_ready": true,

Do not include any asterisks in your response.
"difficulty_level": "{difficulty_level}",
"content_length": "{content_length}"',
  'c0a80101-0000-0000-0000-000000000021', -- MULTIMEDIA input
  'c0a80101-0000-0000-0000-000000000011'  -- PPTX output
);