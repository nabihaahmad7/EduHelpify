-- Create task status enum type
create type task_status_enum as enum (
  'QUEUED',
  'INPROGRESS',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

-- Add status field to Task table with default value 'QUEUED'
alter table Task add column status task_status_enum not null default 'QUEUED';