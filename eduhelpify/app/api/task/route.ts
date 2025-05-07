import { NextRequest, NextResponse } from 'next/server';
import { taskService } from './service';
import { fileStoreService } from '../files/service';

const TASK_PROCESSOR_URL=process.env.TASK_PROCESSOR_URL;
export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Extract task data from form
    const userId = formData.get('user_id') as string;
    const taskConfigId = formData.get('task_config_id') as string;
    const inputContentTypeId = formData.get('input_content_type_id') as string;
    const outputContentTypeId = formData.get('output_content_type_id') as string;
    const userPrompt = formData.get('user_prompt') as string;
    
    // Create the task
    const { task, error } = await taskService.createTask({
      user_id: userId || undefined,
      task_config_id: taskConfigId || undefined,
      input_content_type_id: inputContentTypeId || undefined,
      output_content_type_id: outputContentTypeId || undefined,
      user_prompt: userPrompt || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create task', details: error },
        { status: 400 }
      );
    }
    
    const taskId = task.id;
    const files = formData.getAll('files') as File[];
    const fileResponses = [];
    
    // Process and store files if any
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          // Upload file to Supabase storage
          const { path: fileUrl, error: uploadError } = await fileStoreService.uploadFile(file, taskId);
          
          if (uploadError) {
            return NextResponse.json(
              { error: 'Failed to upload file', details: uploadError },
              { status: 400 }
            );
          }
          
          // Save file metadata to the database
          const { file: fileRecord, error: fileError } = await fileStoreService.saveFileMetadata({
            task_id: taskId,
            file_name: file.name,
            file_type_id: 'c0a80101-0000-0000-0000-000000000021',
            file_size: file.size,
            stored_location: fileUrl,
            need_ocr: formData.get('need_ocr') === 'False',
            file_category: 'input',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
          if (fileError) {
            return NextResponse.json(
              { error: 'Failed to save file metadata', details: fileError },
              { status: 400 }
            );
          }
          
          fileResponses.push(fileRecord);
        }
      }
    }
  
    // Call the task processor service without waiting for a response
    if (TASK_PROCESSOR_URL) {
      // Fire and forget - non-blocking call
      fetch(TASK_PROCESSOR_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          files: fileResponses
        })
      }).catch(error => {
        console.error('Error calling task processor:', error);
      });
    }
    
    return NextResponse.json({
      success: true,
      task,
      files: fileResponses,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating task:', error);
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
    
    // Here you would get all tasks for a user
    // This is a placeholder for the actual implementation
    
    return NextResponse.json({
      success: true,
      tasks: [], // Replace with actual data
    });
    
  } catch (error) {
    console.error('Error getting tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}