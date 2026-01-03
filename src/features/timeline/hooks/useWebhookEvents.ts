import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getEvents } from '../api/timelineService';
import type { WebhookEvent } from '../types';

const QUERY_KEY = ['webhook-events'];

export function useWebhookEvents() {
  const queryClient = useQueryClient();

  // Step A: Fetch initial history
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getEvents,
  });

  // Step B: Subscribe to Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('webhook-events-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webhook_events',
        },
        (payload) => {
          // Step C: Inject new row directly into cache
          const newEvent = payload.new as WebhookEvent;
          queryClient.setQueryData<WebhookEvent[]>(QUERY_KEY, (oldData) => {
            if (!oldData) return [newEvent];
            return [newEvent, ...oldData];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}
