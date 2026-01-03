# CLAUDE.md - RevenueCat Webhook Visualizer

## Project Overview

A real-time dashboard for visualizing RevenueCat webhook events. Transforms raw subscription data into a human-readable, chronological timeline for debugging and auditing.

**Status:** Project just started - base Vite React app with libraries installed.

## Tech Stack

- **Frontend:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions + Realtime)
- **Icons:** Lucide React
- **Date Handling:** date-fns

## File Structure

```
src/
├── components/
│   ├── layout/             # Global layout (Header, PageShell)
│   └── ui/                 # Shadcn components (auto-generated)
├── features/
│   └── timeline/
│       ├── api/            # timelineService.ts
│       ├── components/     # TimelineFeed, TimelineItem, EventDetailSheet
│       ├── hooks/          # useWebhookEvents.ts
│       └── types/          # Feature-specific types
├── lib/
│   ├── supabase.ts         # Singleton Supabase client
│   └── utils.ts            # Shadcn cn() helper
├── App.tsx
└── main.tsx
```

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npx shadcn@latest add <component>  # Add Shadcn component
```

## Architecture Guidelines

### Component Organization
- **`components/ui/`**: Only Shadcn auto-generated components
- **`components/layout/`**: App-wide layout components
- **`features/*/components/`**: Feature-specific UI components

### Data Flow
1. RevenueCat → Supabase Edge Function (validates webhook secret)
2. Edge Function → PostgreSQL `webhook_events` table
3. Supabase Realtime → React frontend via websocket
4. React state update → Timeline re-render

### Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
WEBHOOK_SECRET=  # Used in Edge Function only
```

## RevenueCat Event Types to Humanize

| Raw Event | Human Label |
|-----------|-------------|
| `INITIAL_PURCHASE` | New Subscription Started |
| `RENEWAL` | Subscription Renewed |
| `CANCELLATION` | Subscription Cancelled |
| `UNCANCELLATION` | Cancellation Reversed |
| `EXPIRATION` | Subscription Expired |
| `BILLING_ISSUE` | Payment Failed |
| `PRODUCT_CHANGE` | Plan Changed |
| `REFUND` | Refund Issued |

## Database Schema (To Implement)

```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_timestamp TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_webhook_events_user ON webhook_events(app_user_id);
CREATE INDEX idx_webhook_events_timestamp ON webhook_events(event_timestamp DESC);
```

## Core Features to Build

1. **Timeline Feed** - Chronological list of events with humanized labels
2. **Event Detail Sheet** - Side drawer showing full JSON payload
3. **User History Filter** - Filter timeline by `app_user_id`
4. **Empty State** - "Waiting for Webhooks..." with setup instructions
5. **Real-time Updates** - New events slide into top of timeline

## Coding Conventions

- Use TypeScript strict mode
- Prefer named exports
- Use `cn()` from `lib/utils` for conditional classes
- Keep components small and focused
- Colocate feature logic in `features/` directory
- No authentication required (internal tool)

## UI Notes

- Timeline uses left-border line to connect events
- Lucide icons distinguish event types (CreditCard, XCircle, etc.)
- Status badges for event states (Success, Refunded, Cancelled)
- Desktop-first but tablet-readable
