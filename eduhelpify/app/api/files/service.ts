import { supabase } from '../../../lib/supabase';
import { Database } from '../../../types/supabase';
import * as fs from 'fs/promises';
import * as path from 'path';
export type FileStoreData = Database['public']['Tables']['FileStore']['Insert'];

export class FileStoreService {
  /**
   * Save file metadata to FileStore table
   */
  async saveFileMetadata(fileData: FileStoreData): Promise<{ file: any; error: any }> {
    const { data: file, error } = await supabase
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
   * Upload file to Supabase storage
   */
  /**
   * Save file to local directory
   */
  /**
   * Save file to local directory
   */
  async uploadFile(file: File, storagePath: string): Promise<{ path: string | null; error: any }> {
    try {
      const filePath = path.join(process.cwd(), 'docs/input', storagePath);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      return { path: filePath, error: null };
    } catch (error) {
      return { path: null, error };
    }
  }
  /**
   * Delete file from Supabase storage and metadata from database
   */
  async deleteFile(fileId: string, storedLocation: string): Promise<{ success: boolean; error: any }> {
    // First, delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([storedLocation]);

    if (storageError) {
      return { success: false, error: storageError };
    }

    // Then, delete the file metadata from the database
    const { error: dbError } = await supabase
      .from('filestore')
      .delete()
      .eq('id', fileId);

    return { success: !dbError, error: dbError };
  }
}

export const fileStoreService = new FileStoreService();