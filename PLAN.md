This is your **Execution Plan**. 

### 📂 The Target File Structure
We are using a **Feature-Based Architecture**. This impresses interviewers because it shows you know how to structure apps that scale beyond "Hello World."

```text
src/
├── components/
│   ├── layout/             # Global layout (Header, PageShell)
│   │   └── Header.tsx
│   └── ui/                 # 🔴 Shadcn components live here (auto-generated)
│       ├── badge.tsx
│       ├── sheet.tsx
│       └── ...
├── features/               # 🟢 DOMAIN LOGIC
│   └── timeline/
│       ├── api/            # API calls specific to Timeline
│       │   └── timelineService.ts
│       ├── components/     # UI components specific to Timeline
│       │   ├── TimelineFeed.tsx
│       │   ├── TimelineItem.tsx
│       │   └── EventDetailSheet.tsx
│       ├── hooks/          # React Query & Realtime logic
│       │   └── useWebhookEvents.ts
│       └── types/          # Types specific to this feature
│           └── index.ts
├── lib/
│   ├── supabase.ts         # Singleton Client
│   └── utils.ts            # Shadcn helper (cn)
├── App.tsx                 # Providers & Routing
└── main.tsx
```

---

### Phase 1: Environment & Tooling (The Foundation) ✅
*Objective: Set up a robust, strictly typed environment with efficient tooling.*

1.  ~~**Initialize Vite Project**~~
    *   `npm create vite@latest rc-visualizer -- --template react-ts`
    *   `cd rc-visualizer`
2.  ~~**Configure Absolute Imports (`@/`)**~~
    *   *Angular Equivalent:* `tsconfig` paths.
    *   `npm install -D @types/node`
    *   **Edit `vite.config.ts`**:
        ```ts
        resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
        ```
    *   **Edit `tsconfig.app.json`** (inside `compilerOptions`):
        ```json
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"] }
        ```
3.  ~~**Initialize Shadcn/ui**~~
    *   `npx shadcn-ui@latest init`
    *   *Selection:* Style: **New York**, Base Color: **Slate**, CSS Variables: **Yes**.
    *   *Note:* This will auto-configure Tailwind, `components.json`, and `lib/utils.ts`.
4.  ~~**Install "Senior" Dependencies**~~
    *   `npm install @tanstack/react-query` (Server State Management).
    *   `npm install @supabase/supabase-js` (Backend SDK).
    *   `npm install lucide-react` (Icons).
    *   `npm install date-fns` (Date formatting).

---

### Phase 2: Domain Modeling & Database ✅
*Objective: Define the data contract before writing UI code.*

5.  ~~**Create the Feature Directory**~~
    *   `mkdir -p src/features/timeline/{api,components,hooks,types}`
6.  ~~**Define TypeScript Interface**~~
    *   Create `src/features/timeline/types/index.ts`.
    *   Export `interface WebhookEvent` matching your PRD (id, type, app_user_id, created_at, original_payload).
7.  ~~**Supabase Table Setup**~~
    *   Go to Supabase Dashboard > SQL Editor.
    *   Run the schema:
        ```sql
        create table webhook_events (
          id uuid default gen_random_uuid() primary key,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          app_user_id text not null,
          type text not null,
          original_payload jsonb not null
        );
        alter publication supabase_realtime add table webhook_events;
        ```
    *   *Note:* The `alter publication` line is vital. Without it, the Realtime websocket won't fire.

---

### Phase 3: Infrastructure Layer ✅
*Objective: Setup Global Providers and Singletons.*

8.  ~~**Setup Supabase Client**~~
    *   Create `src/lib/supabase.ts`.
    *   Initialize `createClient` using `import.meta.env.VITE_SUPABASE_URL`.
9.  ~~**Configure React Query Provider**~~
    *   In `src/main.tsx` (or `App.tsx`):
    *   Wrap your app with `<QueryClientProvider client={queryClient}>`.
    *   *Angular Equivalent:* Importing `HttpClientModule` in `AppModule`.

---

### Phase 4: The Logic Layer (Hooks & Services) ✅
*Objective: Abstract API complexity. This is the most critical part for code review.*

10. ~~**Create the Service**~~
    *   File: `src/features/timeline/api/timelineService.ts`
    *   Function `getEvents()`: Returns `supabase.from(...).select('*')`.
    *   *Angular Equivalent:* A standard `TimelineService`.
11. ~~**Create the "Smart" Hook**~~
    *   File: `src/features/timeline/hooks/useWebhookEvents.ts`
    *   **Step A:** Use `useQuery` to fetch the initial history.
    *   **Step B:** Use `useEffect` to subscribe to Supabase Realtime.
    *   **Step C (The Pro Move):** On a new event, use `queryClient.setQueryData` to inject the new row directly into the cache.
    *   *Why:* This demonstrates you understand Optimistic UI and Cache manipulation, not just simple fetching.

---

### Phase 5: The UI Layer (Components)
*Objective: Build the visual layer using Shadcn primitives.*

12. **Install Shadcn Primitives**
    *   `npx shadcn-ui@latest add button badge sheet scroll-area skeleton card`
13. **Create `EventDetailSheet`** (The JSON Inspector)
    *   File: `src/features/timeline/components/EventDetailSheet.tsx`
    *   Use the Shadcn `<Sheet>` component.
    *   Accept `open`, `onOpenChange`, and `payload` as props.
    *   Render the JSON inside a `<pre>` tag or syntax highlighter.
14. **Create `TimelineItem`**
    *   File: `src/features/timeline/components/TimelineItem.tsx`
    *   Props: `{ event: WebhookEvent }`.
    *   Use `date-fns` to format `created_at`.
    *   Map `event.type` to specific Icons (Lucide) and Badge colors.
15. **Create `TimelineFeed`**
    *   File: `src/features/timeline/components/TimelineFeed.tsx`
    *   Call `const { data, isLoading } = useWebhookEvents()`.
    *   If `isLoading`, render 5x `<Skeleton className="h-24" />`.
    *   If `data`, map to `<TimelineItem />`.

---

### Phase 6: The Backend (Edge Function) ✅
*Objective: The actual ingestion point.*

16. ~~**Initialize Supabase Function**~~
    *   `npx supabase functions new rc-webhook`
    *   (You may need to log in via CLI `npx supabase login`).
17. ~~**Implement Webhook Logic**~~
    *   File: `supabase/functions/rc-webhook/index.ts`
    *   **Validation:** Check if `req.headers.get('Authorization')` matches your secret.
    *   **Parsing:** `const body = await req.json()`.
    *   **Insertion:**
        ```typescript
        await supabase.from('webhook_events').insert({
          type: body.event.type,
          app_user_id: body.event.app_user_id,
          original_payload: body
        })
        ```
18. ~~**Deploy Function**~~
    *   `npx supabase functions deploy rc-webhook`

---

### Phase 7: Final Polish
*Objective: UX and functionality check.*

19. **Assemble `App.tsx`**
    *   Add a nice `<Header />`.
    *   Place `<TimelineFeed />` in the main container.
20. **Empty State**
    *   In `TimelineFeed`, if `data.length === 0`, render a "Waiting for events..." illustration.
21. **Run & Test**
    *   Start UI: `npm run dev`.
    *   Test Webhook: Send a CURL request to your local or deployed Edge Function URL to see it appear instantly in the UI.

### 💡 "Senior" Tips for your code:
*   **Separation of Concerns:** Keep your `TimelineItem` "dumb". It shouldn't know about Supabase. It only knows what is passed via props.
*   **derived State:** If you add the User Filter, calculate the filtered list inside the render function (`const filtered = events.filter(...)`) rather than creating a separate `useEffect` to sync two state variables.
*   **Strict Mode:** Ensure your console has no warnings. React Strict Mode is unforgiving but helpful.