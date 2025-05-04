export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      UserType: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      User: {
        Row: {
          id: string
          username: string | null
          email: string
          password: string
          role: "admin" | "user"
          user_type_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username?: string | null
          email: string
          password: string
          role?: "admin" | "user"
          user_type_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string
          password?: string
          role?: "admin" | "user"
          user_type_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ContentType: {
        Row: {
          id: string
          name: string
          extensions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          extensions: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          extensions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      AiModel: {
        Row: {
          id: string
          model_name: string
          model_key: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          model_name: string
          model_key: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          model_name?: string
          model_key?: string
          created_at?: string
          updated_at?: string
        }
      }
      TaskConfig: {
        Row: {
          id: string
          content_length: "short" | "medium" | "detailed"
          focus_area: string | null
          difficulty_level: "beginner" | "intermediate" | "expert"
          AiModels_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_length: "short" | "medium" | "detailed"
          focus_area?: string | null
          difficulty_level: "beginner" | "intermediate" | "expert"
          AiModels_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_length?: "short" | "medium" | "detailed"
          focus_area?: string | null
          difficulty_level?: "beginner" | "intermediate" | "expert"
          AiModels_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      Task: {
        Row: {
          id: string
          user_id: string | null
          task_config_id: string | null
          input_content_type_id: string | null
          output_content_type_id: string | null
          user_prompt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          task_config_id?: string | null
          input_content_type_id?: string | null
          output_content_type_id?: string | null
          user_prompt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          task_config_id?: string | null
          input_content_type_id?: string | null
          output_content_type_id?: string | null
          user_prompt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      FileStore: {
        Row: {
          id: string
          task_id: string | null
          file_name: string
          file_type_id: string | null
          need_ocr: boolean
          stored_location: string | null
          file_size: number | null
          file_category: "input" | "output" | null
          data_value: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id?: string | null
          file_name: string
          file_type_id?: string | null
          need_ocr?: boolean
          stored_location?: string | null
          file_size?: number | null
          file_category?: "input" | "output" | null
          data_value?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string | null
          file_name?: string
          file_type_id?: string | null
          need_ocr?: boolean
          stored_location?: string | null
          file_size?: number | null
          file_category?: "input" | "output" | null
          data_value?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      SystemPrompts: {
        Row: {
          id: string
          prompt: string | null
          input_content_type_id: string | null
          output_content_type_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prompt?: string | null
          input_content_type_id?: string | null
          output_content_type_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prompt?: string | null
          input_content_type_id?: string | null
          output_content_type_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role_enum: "admin" | "user"
      content_length_enum: "short" | "medium" | "detailed"
      difficulty_level_enum: "beginner" | "intermediate" | "expert"
      file_category_enum: "input" | "output"
    }
  }
}