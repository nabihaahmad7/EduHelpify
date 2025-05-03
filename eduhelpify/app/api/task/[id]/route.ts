import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '../service';
import { fileStoreService } from '../../files/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    
    // Get the task
    const { task, error } = await taskService.getTaskById(taskId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to retrieve task', details: error },
        { status: 404 }
      );
    }
    
    // Get associated files
    const { files, error: filesError } = await fileStoreService.getFilesByTaskId(taskId);
    
    if (filesError) {
      return NextResponse.json(
        { error: 'Failed to retrieve files', details: filesError },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      task,
      files,
    });
    
  } catch (error) {
    console.error('Error retrieving task:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    const updateData = await request.json();
    
    // Update the task
    const { task, error } = await taskService.updateTaskById(taskId, {
      ...updateData,
      updated_at: new Date().toISOString(),
    });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update task', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      task,
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    
    // Get all files associated with this task
    const { files, error: filesError } = await fileStoreService.getFilesByTaskId(taskId);
    
    if (filesError) {
      return NextResponse.json(
        { error: 'Failed to retrieve associated files', details: filesError },
        { status: 400 }
      );
    }
    
    // Delete each file
    for (const file of files) {
      if (file.stored_location) {
        await fileStoreService.deleteFile(file.id, file.stored_location);
      }
    }
    
    // Delete the task
    const { success, error } = await taskService.deleteTaskById(taskId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete task', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}