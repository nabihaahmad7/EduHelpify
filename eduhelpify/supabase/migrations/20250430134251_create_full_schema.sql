-- ENUM types
create type role_enum as enum ('admin', 'user');
create type content_length_enum as enum ('short', 'medium', 'detailed');
create type difficulty_level_enum as enum ('beginner', 'intermediate', 'expert');
create type file_category_enum as enum ('input', 'output');

-- Table: UserType
create table UserType (
  id uuid primary key default uuid_generate_v4(),
  name varchar not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: User
create table "User" (
  id uuid primary key default uuid_generate_v4(),
  username varchar,
  email varchar unique not null,
  password varchar not null,
  role role_enum not null default 'user',
  user_type_id uuid references UserType(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: ContentType
create table ContentType (
  id uuid primary key default uuid_generate_v4(),
  name varchar not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: AiModel
create table AiModel (
  id uuid primary key default uuid_generate_v4(),
  model_name varchar not null,
  model_key varchar not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: TaskConfig
create table TaskConfig (
  id uuid primary key default uuid_generate_v4(),
  content_length content_length_enum not null,
  focus_area text,
  difficulty_level difficulty_level_enum not null,
  AiModels_id uuid references AiModel(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
); 

-- Table: Task
create table Task (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references "User"(id),
  task_config_id uuid references TaskConfig(id),
  input_content_type_id uuid references ContentType(id),
  output_content_type_id uuid references ContentType(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: FileStore
create table FileStore (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references Task(id),
  file_name varchar not null,
  file_type_id uuid references ContentType(id),
  need_ocr boolean not null default false,
  stored_location varchar,
  file_size bigint,
  file_category file_category_enum,
  data_value jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: SystemPrompts
create table SystemPrompts (
  id uuid primary key default uuid_generate_v4(),
  prompt text,
  input_content_type_id uuid references ContentType(id),
  output_content_type_id uuid references ContentType(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
