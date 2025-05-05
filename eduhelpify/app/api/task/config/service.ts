import { supabase } from "../../../../lib/supabase";
import { Database } from '../../../../types/supabase';

export type TaskConfigData = Database['public']['Tables']['TaskConfig']['Insert'];

export class TaskConfigService {
  /**
   * Create a new task config in the database
   */
  async createTaskConfig(configData: TaskConfigData): Promise<{ taskConfig: any; error: any }> {
    const { data: taskConfig, error } = await supabase
      .from('taskconfig')
      .insert(configData)
      .select('*')
      .single();

    return { taskConfig, error };
  }

  /**
   * Get the last used task config for a user
   */
  async getLastUsedTaskConfig(userId: string): Promise<{ taskConfig: any; error: any }> {
    // First get the most recent task for the user
    const { data: tasks, error: tasksError } = await supabase
      .from('task')
      .select('task_config_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (tasksError || !tasks || tasks.length === 0) {
      // If no tasks found or error, return a default task config
      const { data: defaultConfig, error: defaultError } = await supabase
        .from('taskconfig')
        .select('*')
        .limit(1)
        .single();

      return { taskConfig: defaultConfig, error: defaultError };
    }

    // Get the task config
    const taskConfigId = tasks[0].task_config_id;
    const { data: taskConfig, error } = await supabase
      .from('taskconfig')
      .select('*')
      .eq('id', taskConfigId)
      .single();

    return { taskConfig, error };
  }

  /**
   * Get all task configs for a user
   */
  async getUserTaskConfigs(userId: string): Promise<{ taskConfigs: any[]; error: any }> {
    // First get all tasks for the user to extract task_config_ids
    const { data: tasks, error: tasksError } = await supabase
      .from('task')
      .select('task_config_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (tasksError || !tasks || tasks.length === 0) {
      return { taskConfigs: [], error: tasksError };
    }

    // Extract unique task_config_ids
    const taskConfigIds = [...new Set(tasks.map(task => task.task_config_id).filter(Boolean))];

    if (taskConfigIds.length === 0) {
      return { taskConfigs: [], error: null };
    }

    // Get the task configs
    const { data: taskConfigs, error } = await supabase
      .from('taskconfig')
      .select('*')
      .in('id', taskConfigIds);

    return { taskConfigs: taskConfigs || [], error };
  }

  /**
   * Update an existing task config
   */
  async updateTaskConfig(id: string, configData: Partial<TaskConfigData>): Promise<{ taskConfig: any; error: any }> {
    const { data: taskConfig, error } = await supabase
      .from('taskconfig')
      .update({
        ...configData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    return { taskConfig, error };
  }
}

export const taskConfigService = new TaskConfigService();