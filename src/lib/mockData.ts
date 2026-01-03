import type { WebhookEvent } from '@/features/timeline/types';

// Sort by created_at descending (newest first)
export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    type: 'INITIAL_PURCHASE',
    app_user_id: '$RCAnonymousID:8a7b6c5d4e3f2a1b',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    original_payload: {
      api_version: '1.0',
      event: {
        type: 'INITIAL_PURCHASE',
        app_user_id: '$RCAnonymousID:8a7b6c5d4e3f2a1b',
        product_id: 'rc_pro_monthly',
        price: 9.99,
        currency: 'USD',
        store: 'APP_STORE',
        environment: 'PRODUCTION',
      },
    },
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    type: 'RENEWAL',
    app_user_id: 'user_12345',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    original_payload: {
      api_version: '1.0',
      event: {
        type: 'RENEWAL',
        app_user_id: 'user_12345',
        product_id: 'rc_pro_yearly',
        price: 79.99,
        currency: 'USD',
        store: 'PLAY_STORE',
        environment: 'PRODUCTION',
      },
    },
  },
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    type: 'CANCELLATION',
    app_user_id: 'user_67890',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    original_payload: {
      api_version: '1.0',
      event: {
        type: 'CANCELLATION',
        app_user_id: 'user_67890',
        product_id: 'rc_basic_monthly',
        cancel_reason: 'CUSTOMER_SUPPORT',
        store: 'APP_STORE',
        environment: 'PRODUCTION',
      },
    },
  },
  {
    id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    type: 'BILLING_ISSUE',
    app_user_id: 'user_premium_001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    original_payload: {
      api_version: '1.0',
      event: {
        type: 'BILLING_ISSUE',
        app_user_id: 'user_premium_001',
        product_id: 'rc_pro_monthly',
        store: 'PLAY_STORE',
        environment: 'PRODUCTION',
        grace_period_expiration_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
    },
  },
  {
    id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    type: 'PRODUCT_CHANGE',
    app_user_id: 'user_upgrade_test',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    original_payload: {
      api_version: '1.0',
      event: {
        type: 'PRODUCT_CHANGE',
        app_user_id: 'user_upgrade_test',
        old_product_id: 'rc_basic_monthly',
        new_product_id: 'rc_pro_monthly',
        store: 'APP_STORE',
        environment: 'PRODUCTION',
      },
    },
  },
  {
    id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    type: 'SUBSCRIBER_ALIAS',
    app_user_id: 'user_migrated_123',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    original_payload: {
      api_version: '1.0',
      event: {
        type: 'SUBSCRIBER_ALIAS',
        app_user_id: 'user_migrated_123',
        aliases: ['$RCAnonymousID:old_anon_id', 'user_migrated_123'],
      },
    },
  },
];
