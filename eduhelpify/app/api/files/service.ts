import { supabase } from '../../../lib/supabase';
import { Database } from '../../../types/supabase';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
export type FileStoreData = Database['public']['Tables']['FileStore']['Insert'];

// Create a service role client for bypassing RLS
const getServiceClient = () => {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return null;
};

export class FileStoreService {
  /**
   * Save file metadata to FileStore table
   */
  async saveFileMetadata(fileData: FileStoreData): Promise<{ file: any; error: any }> {
    // Try to use service role client if available
    const serviceClient = getServiceClient();
    const client = serviceClient || supabase;
    
    const { data: file, error } = await client
      .from('filestore')
      .insert(fileData)
      .select('*')
      .single();

    return { file, error };
  }

  /**
   * Get files by task ID
   */
  async getFilesByTaskId(taskId: string): Promise<{ files: any[]; error: any }> {
    const { data: files, error } = await supabase
      .from('filestore')
      .select('*')
      .eq('task_id', taskId);

    return { files: files || [], error };
  }

  /**
   * Upload file using local file system as a fallback
   */
  async uploadFile(file: File, taskId: string): Promise<{ path: string | null; error: any }> {
    try {
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `${taskId}.${fileExtension}`;
      
      // Try upload to Supabase first
      try {
        const serviceClient = getServiceClient();
        const client = serviceClient || supabase;
        
        const storagePath = `task/${fileName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        
        const { data, error } = await client.storage
          .from('eduhelpify')
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: true
          });
        
        if (!error) {
          // Get the public URL for the file
          const { data: urlData } = client.storage
            .from('eduhelpify')
            .getPublicUrl(storagePath);
          
          return { path: urlData.publicUrl, error: null };
        }
        
        // If Supabase upload fails, log the error but continue to local fallback
        console.warn('Supabase storage upload failed, using local fallback:', error);
      } catch (supabaseError) {
        console.warn('Supabase storage error, using local fallback:', supabaseError);
      }

      // Fallback to local file storage
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'task');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      
      // Public URL for locally stored file
      const publicPath = `/uploads/task/${fileName}`;
      
      return { path: publicPath, error: null };
    } catch (error) {
      console.error('File upload error:', error);
      return { path: null, error };
    }
  }

  /**
   * Delete file from storage and metadata from database
   */
  async deleteFile(fileId: string, storedLocation: string): Promise<{ success: boolean; error: any }> {
    try {
      // First try to determine if this is a local file or Supabase file
      const isLocalFile = storedLocation.startsWith('/uploads/') || storedLocation.startsWith('\\uploads\\');
      
      if (isLocalFile) {
        // Delete local file
        const filePath = path.join(process.cwd(), 'public', storedLocation);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else {
        try {
          // Try to parse URL and delete from Supabase
          let storagePath;
          try {
            const url = new URL(storedLocation);
            const fullPath = url.pathname;
            storagePath = fullPath.split('/eduhelpify/')[1];
          } catch (e) {
            // If not a URL, assume it's already a relative path
            storagePath = storedLocation;
          }
          
          // Try with service client first
          const serviceClient = getServiceClient();
          const client = serviceClient || supabase;
          
          await client.storage
            .from('eduhelpify')
            .remove([storagePath]);
        } catch (storageError) {
          console.warn('Error deleting from storage:', storageError);
          // Continue even if storage delete fails
        }
      }

      // Use service client for database operations if available
      const serviceClient = getServiceClient();
      const client = serviceClient || supabase;
      
      // Delete file metadata from database
      const { error: dbError } = await client
        .from('filestore')
        .delete()
        .eq('id', fileId);

      return { success: !dbError, error: dbError };
    } catch (error) {
      console.error('File deletion error:', error);
      return { success: false, error };
    }
  }
}

export const fileStoreService = new FileStoreService();