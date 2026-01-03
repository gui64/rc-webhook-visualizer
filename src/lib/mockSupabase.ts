import { mockWebhookEvents } from './mockData';
import type { WebhookEvent } from '@/features/timeline/types';

type RealtimeCallback = (payload: { new: WebhookEvent }) => void;

let realtimeCallbacks: RealtimeCallback[] = [];

// Simulate new events arriving every 10 seconds
if (import.meta.env.VITE_USE_MOCK === 'true') {
  setInterval(() => {
    const eventTypes = ['INITIAL_PURCHASE', 'RENEWAL', 'CANCELLATION', 'BILLING_ISSUE', 'PRODUCT_CHANGE'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const newEvent: WebhookEvent = {
      id: crypto.randomUUID(),
      type: randomType,
      app_user_id: `user_${Math.random().toString(36).substring(7)}`,
      created_at: new Date().toISOString(),
      original_payload: {
        api_version: '1.0',
        event: {
          type: randomType,
          app_user_id: `user_${Math.random().toString(36).substring(7)}`,
          product_id: 'rc_pro_monthly',
        },
      },
    };

    realtimeCallbacks.forEach((cb) => cb({ new: newEvent }));
  }, 10000);
}

export const mockSupabase = {
  from: (table: string) => ({
    select: (_columns: string) => ({
      order: (_column: string, _options: { ascending: boolean }) => {
        // Sort by created_at descending (newest first)
        const sortedEvents = [...mockWebhookEvents].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return Promise.resolve({
          data: sortedEvents,
          error: null,
        });
      },
    }),
  }),
  channel: (_name: string) => ({
    on: (
      _event: string,
      _filter: object,
      callback: RealtimeCallback
    ) => {
      realtimeCallbacks.push(callback);
      return {
        subscribe: () => ({
          unsubscribe: () => {
            realtimeCallbacks = realtimeCallbacks.filter((cb) => cb !== callback);
          },
        }),
      };
    },
  }),
  removeChannel: (_channel: unknown) => {
    realtimeCallbacks = [];
  },
};
