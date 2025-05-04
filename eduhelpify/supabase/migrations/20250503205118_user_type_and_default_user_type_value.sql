-- Add default user types (teacher and student)
INSERT INTO "usertype" (name) VALUES ('teacher');
INSERT INTO "usertype" (name) VALUES ('student');
INSERT INTO "usertype" (name) VALUES ('default');

-- Create a function to get the student user type ID
CREATE OR REPLACE FUNCTION get_student_type_id() 
RETURNS uuid AS $$
  DECLARE
    student_id uuid;
  BEGIN
    SELECT id INTO student_id FROM "usertype" WHERE name = 'default' LIMIT 1;
    RETURN student_id;
  END;
$$ LANGUAGE plpgsql;

-- Modify the User table to set a default value for user_type_id
ALTER TABLE "User" 
ALTER COLUMN user_type_id SET DEFAULT get_student_type_id();