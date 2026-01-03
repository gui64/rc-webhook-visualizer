import { supabase } from '@/lib/supabase';
import type { WebhookEvent } from '../types';

export async function getEvents(): Promise<WebhookEvent[]> {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
