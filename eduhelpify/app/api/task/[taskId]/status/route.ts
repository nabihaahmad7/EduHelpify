export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '../../service';

type RouteParams = {
  params: {
    taskId: string;
  };
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const taskId = (await params).taskId;
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Update the task status
    // Note: Since there's no explicit status field in your Task table schema,
    // you might need to add it or use a different approach based on your requirements
    const { task, error } = await taskService.updateTaskById(taskId, {
      // Update with appropriate status field
      // For now, we'll just update the updated_at timestamp
      updated_at: new Date().toISOString(),
    });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update task status', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      task,
    });
    
  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}