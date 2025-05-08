export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabase";


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Create the task config
    const { data: taskConfig, error } = await supabase
      .from('taskconfig')
      .insert({
        content_length: data.content_length || 'medium',
        focus_area: data.focus_area || "",
        difficulty_level: data.difficulty_level || 'intermediate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating task config:', error);
      return NextResponse.json(
        { error: 'Failed to create task config', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      taskConfig,
    });
    
  } catch (error) {
    console.error('Error creating task config:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // First get the most recent task for the user
    console.log("Fetching tasks for user:", userId);
    const { data: tasks, error: tasksError } = await supabase
      .from('task')
      .select('task_config_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (tasksError) {
      console.error('Error getting tasks:', tasksError);
      return NextResponse.json(
        { error: 'Failed to get tasks', details: tasksError },
        { status: 400 }
      );
    }

    if (!tasks || tasks.length === 0) {
      // If no tasks found, create a default task config
      const { data: defaultConfig, error: insertError } = await supabase
        .from('taskconfig')
        .insert({
          content_length: 'medium',
          focus_area: null,
          difficulty_level: 'intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();
        
      if (insertError) {
        console.error('Error creating default task config:', insertError);
        return NextResponse.json(
          { error: 'Failed to create default task config', details: insertError },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        taskConfig: defaultConfig,
      });
    }

    // Get the task config
    const taskConfigId = tasks[0].task_config_id;
    
    if (!taskConfigId) {
      // Create a default config if task has no config
      const { data: defaultConfig, error: insertError } = await supabase
        .from('taskconfig')
        .insert({
          content_length: 'medium',
          focus_area: null,
          difficulty_level: 'intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();
        
      if (insertError) {
        console.error('Error creating default task config:', insertError);
        return NextResponse.json(
          { error: 'Failed to create default task config', details: insertError },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        taskConfig: defaultConfig,
      });
    }
    
    const { data: taskConfig, error } = await supabase
      .from('taskconfig')
      .select('*')
      .eq('id', taskConfigId)
      .single();

    if (error) {
      console.error('Error getting task config:', error);
      return NextResponse.json(
        { error: 'Failed to get task config', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      taskConfig,
    });
    
  } catch (error) {
    console.error('Error getting task config:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}