import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '../task/service';
import { fileStoreService } from '../files/service';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Extract task data from form
    const userId = formData.get('user_id') as string;
    const taskConfigId = formData.get('task_config_id') as string;
    const inputContentTypeId = formData.get('input_content_type_id') as string || 'c0a80101-0000-0000-0000-000000000021';
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
          
          // Get file extension
          const fileExtension = file.name.split('.').pop() || '';
          
          // Save file metadata to the database
          const { file: fileRecord, error: fileError } = await fileStoreService.saveFileMetadata({
            task_id: taskId,
            file_name: file.name,
            file_size: file.size,
            stored_location: fileUrl,
            need_ocr: fileExtension.toLowerCase() === 'pdf' || fileExtension.toLowerCase() === 'docx',
            file_category: 'input',
            file_type_id: inputContentTypeId,
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