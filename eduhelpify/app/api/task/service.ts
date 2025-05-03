import { supabase } from "../../../lib/supabase";
import { Database } from '../../../types/supabase';

export type TaskData = Database['public']['Tables']['Task']['Insert'];
export type FileStoreData = Database['public']['Tables']['FileStore']['Insert'];

export class TaskService {
  /**
   * Create a new task in the database
   */
  async createTask(taskData: TaskData): Promise<{ task: any; error: any }> {
    const { data: task, error } = await supabase
      .from('Task')
      .insert(taskData)
      .select('*')
      .single();

    return { task, error };
  }

  /**
   * Get a task by ID
   */
  async getTaskById(taskId: string): Promise<{ task: any; error: any }> {
    const { data: task, error } = await supabase
      .from('Task')
      .select('*')
      .eq('id', taskId)
      .single();

    return { task, error };
  }

  /**
   * Update a task by ID
   */
  async updateTaskById(
    taskId: string,
    updateData: Partial<TaskData>
  ): Promise<{ task: any; error: any }> {
    const { data: task, error } = await supabase
      .from('Task')
      .update(updateData)
      .eq('id', taskId)
      .select('*')
      .single();

    return { task, error };
  }

  /**
   * Delete a task by ID
   */
  async deleteTaskById(taskId: string): Promise<{ success: boolean; error: any }> {
    const { error } = await supabase
      .from('Task')
      .delete()
      .eq('id', taskId);

    return { success: !error, error };
  }
}

export const taskService = new TaskService();