-- Add Gemini 2.0 Flash AI model
INSERT INTO "aimodel" (model_name, model_key)
VALUES ('gemini-2.0-flash', 'your key');

-- Add user_prompt column to Task
ALTER TABLE "task"
ADD COLUMN user_prompt text;

-- Sample queries to create a complete task with related records
-- 1. Create TaskConfig

WITH task_config AS (
  INSERT INTO "taskconfig" (
    content_length,
    focus_area,
    difficulty_level,
    aimodels_id
  )
  VALUES (
    'medium', -- One of: 'short', 'medium', 'detailed'
    'business law promisory estoppel',
    'intermediate', -- One of: 'beginner', 'intermediate', 'expert'
    (SELECT id FROM "aimodel" WHERE model_name = 'gemini-2.0-flash') -- Use the Gemini model we just added
  )
  RETURNING id
),


-- 2. Create a task
 new_task AS (
  INSERT INTO "task" (
    user_id, 
    task_config_id,
    input_content_type_id,
    output_content_type_id,
    user_prompt,
    status
  )
  VALUES (
    (SELECT id FROM "User" LIMIT 1), -- Get an actual user ID from the database
    (SELECT id FROM "taskconfig" ORDER BY created_at DESC LIMIT 1), -- Get the latest TaskConfig ID
    'c0a80101-0000-0000-0000-000000000001', -- PDF content type
    'c0a80101-0000-0000-0000-000000000003', -- TXT content type
    'Create a quiz from the given text. At least make 10 MCQ questions',
    'QUEUED' -- Set initial status
  )
  RETURNING id
)

-- 3. Create input file record in FileStore
INSERT INTO "filestore" (
  task_id,
  file_name,
  file_type_id,
  need_ocr,
  stored_location,
  file_size,
  file_category,
  data_value
)
VALUES (
  (SELECT id FROM new_task), -- Use the task ID from the previous insert
  'N7 Capacity .pdf',
  'c0a80101-0000-0000-0000-000000000001', -- PDF file type
  false, -- Set to true if OCR is needed
  'uploads/N7 Capacity .pdf',
  141376, -- File size in bytes
  'input',
  '{"text": "Sample textbook content about photosynthesis"}'::jsonb
);