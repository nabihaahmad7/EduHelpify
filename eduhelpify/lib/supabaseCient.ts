import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '../types/supabase';

export const createClient = () => {
  const client = createClientComponentClient<Database>();
  return client;
};

// Create a singleton instance
export const supabaseClient = createClient(); 