This Product Requirements Document (PRD) outlines the development of the **RevenueCat Webhook Visualizer**, a specialized tool designed to transform raw subscription data into a human-readable, actionable timeline.

### **Product Overview**

The **RevenueCat Webhook Visualizer** is a high-performance, internal-only dashboard that monitors real-time subscription events. It solves the "arcane data" problem by translating complex JSON payloads into clear, chronological narratives of a user's lifecycle.

* **Goal:** To provide a developer-friendly interface for debugging and auditing RevenueCat webhook events.
* **Target User:** Support engineers, product managers, or developers (Internal Tool).
* **Core Value:** Speed to insight. Instead of parsing JSON manually, users see exactly what happened to a customer at a glance.

---

### **Tech Stack & Integration**

To demonstrate your **Senior Product Engineer** capabilities, the tool will leverage a modern, scalable architecture:

* 
**Frontend:** React (Vite) with **TypeScript** for strict data modeling.


* **Styling:** **Tailwind CSS** + **Shadcn/ui** for an accessible, professional design consistent with RevenueCat’s "RCDA" standards.
* 
**Backend & Data:** **Supabase** (PostgreSQL) for event storage and **Edge Functions** to receive incoming webhooks.


* **Real-time:** Supabase Realtime to push new events to the UI without page refreshes.

---

### **Functional Requirements**

#### **1. Real-time Event Feed**

* The primary view must be a vertical **chronological timeline** of all incoming webhooks.
* Each timeline entry must "humanize" the event type (e.g., `INITIAL_PURCHASE` becomes *"New Subscription Started"*).
* **Data Points per Line:** Event type, User ID, Timestamp (humanized via `date-fns`), and a status badge (e.g., Success, Refunded, Cancelled).

#### **2. Event Detail Inspector**

* **Requirement:** A button on each timeline line to "View JSON."
* **Implementation:** Clicking this triggers a **Side Drawer** or **Modal** displaying the full, syntax-highlighted JSON payload.
* **Why:** Essential for deep debugging of specific transaction IDs or metadata.

#### **3. User-Centric Filtering**

* **Requirement:** A button to "View User History."
* **Implementation:** Clicking this filters the entire timeline to show **only events associated with that specific `app_user_id**`.
* **Benefit:** Allows developers to trace a single user's journey from trial start to churn.

#### **4. "Zero-Auth" Configuration**

* **Requirement:** No login or user management system.
* **Implementation:** The application will rely on a `.env` file for:
* `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
* A custom `WEBHOOK_SECRET` used in the Edge Function to verify requests are actually coming from RevenueCat.



---

### **User Interface (UI) Expectations**

* **Timeline Component:** Uses a "left-border" line to connect events. Icons (via Lucide React) distinguish event types (e.g., a "Credit Card" icon for payments, "X-Circle" for cancellations).
* **Empty State:** If no events are in the database, display a "Waiting for Webhooks..." animation with instructions on how to set up the URL in the RevenueCat dashboard.
* **Responsiveness:** While primarily a desktop tool, the layout must remain readable on tablets for "on-the-go" support checks.

---

### **Technical Architecture (Data Flow)**

1. **Ingestion:** RevenueCat sends a POST request to a **Supabase Edge Function**.
2. **Validation:** The function checks for a secret header to ensure the request is valid.
3. 
**Storage:** The function extracts the `app_user_id`, `type`, and `timestamp`, then saves the entire payload into the `webhook_events` PostgreSQL table.


4. **Broadcast:** Supabase notifies the React frontend via a websocket.
5. **Render:** The React app receives the new record and updates the state, sliding the new event into the top of the timeline.

---

### **Future Enhancements (Roadmap)**

* **Metric Summaries:** A top bar showing "Total Revenue Processed Today" or "Active Trials."
* **Export to CSV:** For sharing specific user histories with non-technical stakeholders.
* **Slack Integration:** A toggle within the dashboard to send "High Value" event notifications to a Slack channel.

### **Next Step for You**

I can provide the **SQL Schema** and the **TypeScript Interfaces** for the `webhook_events` table to ensure you start with a data structure that handles all RevenueCat event types out of the box. Would you like to see the schema first?
