# CLAUDE.md - RevenueCat Webhook Visualizer

## Project Overview

A real-time dashboard for visualizing RevenueCat webhook events. Transforms raw subscription data into a human-readable, chronological timeline for debugging and auditing.

**Status:** Core implementation complete - Timeline feed, real-time updates, and webhook ingestion working.

## Tech Stack

- **Frontend:** React 18 (Vite) + TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui (New York style, Slate color)
- **State Management:** TanStack React Query
- **Backend:** Supabase (PostgreSQL + Edge Functions + Realtime)
- **Icons:** Lucide React
- **Date Handling:** date-fns

## File Structure

```
src/
├── components/
│   ├── layout/             # Global layout (Header.tsx)
│   └── ui/                 # Shadcn components (auto-generated)
├── features/
│   └── timeline/
│       ├── api/            # timelineService.ts
│       ├── components/     # TimelineFeed, TimelineItem, EventDetailSheet
│       ├── hooks/          # useWebhookEvents.ts
│       └── types/          # index.ts (WebhookEvent interface)
├── lib/
│   ├── supabase.ts         # Supabase client (supports mock mode)
│   ├── mockSupabase.ts     # Mock client for development
│   ├── mockData.ts         # Fake RevenueCat events
│   └── utils.ts            # Shadcn cn() helper
├── App.tsx
└── main.tsx

supabase/
└── functions/
    └── rc-webhook/
        └── index.ts        # Edge function for webhook ingestion
```

## Key Commands

```bash
npm run dev          # Start with real Supabase
npm run dev:mock     # Start with mock data (no Supabase needed)
npm run build        # Production build
npm run lint         # Run ESLint
npx shadcn@latest add <component>  # Add Shadcn component
npx supabase functions deploy rc-webhook  # Deploy edge function
```

## Architecture Guidelines

### Component Organization
- **`components/ui/`**: Only Shadcn auto-generated components
- **`components/layout/`**: App-wide layout components (Header)
- **`features/*/components/`**: Feature-specific UI components

### Data Flow
1. RevenueCat → Supabase Edge Function (validates `Authorization: Bearer <secret>`)
2. Edge Function → PostgreSQL `webhook_events` table
3. Supabase Realtime → React frontend via websocket
4. `useWebhookEvents` hook injects new events directly into React Query cache
5. Timeline re-renders with new event at top

### Environment Variables
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
VITE_USE_MOCK=true|false  # Enable mock mode for development

# Edge Function secrets (set via Supabase dashboard)
WEBHOOK_SECRET=your-webhook-secret
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## RevenueCat Event Types

| Raw Event | Human Label | Icon | Badge Color |
|-----------|-------------|------|-------------|
| `INITIAL_PURCHASE` | Initial Purchase | CreditCard | Green |
| `RENEWAL` | Renewal | RefreshCw | Blue |
| `CANCELLATION` | Cancellation | XCircle | Red |
| `BILLING_ISSUE` | Billing Issue | AlertCircle | Yellow |
| `PRODUCT_CHANGE` | Product Change | DollarSign | Orange |
| `SUBSCRIBER_ALIAS` | Subscriber Alias | UserPlus | Purple |

## Database Schema

```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  app_user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  original_payload JSONB NOT NULL
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE webhook_events;
```

## Core Features

- [x] **Timeline Feed** - Chronological list with loading skeletons
- [x] **Event Detail Sheet** - Side drawer showing full JSON payload
- [x] **Real-time Updates** - New events appear instantly via Supabase Realtime
- [x] **Empty State** - "Waiting for events..." message
- [x] **Mock Mode** - Development without Supabase connection
- [ ] **User History Filter** - Filter timeline by `app_user_id`

## Coding Conventions

- Use TypeScript strict mode
- Prefer named exports
- Use `cn()` from `lib/utils` for conditional classes
- Keep components small and focused ("dumb" components)
- Colocate feature logic in `features/` directory
- Derive filtered state in render, not via `useEffect`
- No authentication required (internal tool)

## Testing Webhook Locally

```bash
curl -X POST https://your-project.supabase.co/functions/v1/rc-webhook \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "type": "INITIAL_PURCHASE",
      "app_user_id": "test_user_123"
    }
  }'
```
