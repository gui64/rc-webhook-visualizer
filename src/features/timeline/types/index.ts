export interface WebhookEvent {
  id: string;
  type: string;
  app_user_id: string;
  created_at: string;
  original_payload: Record<string, unknown>;
}
