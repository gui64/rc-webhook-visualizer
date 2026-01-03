import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '';

const realSupabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabase = useMock ? mockSupabase : realSupabase!;
