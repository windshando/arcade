1. CRM & Pipeline System
1.1 Core Concept

Transform scattered inquiries into a structured revenue pipeline:

Visitor → Inquiry → Lead → Quote → Negotiation → Order → Customer
1.2 Leads → Deals Pipeline
Stages
Inquiry (New)
Qualified Lead
Quote Sent
Negotiation
Closed (Won / Lost)
Features
Drag-and-drop pipeline (Kanban style)
Lead scoring (optional)
Tagging (VIP, bulk buyer, event client)
Timeline (all interactions logged)
1.3 Convert Quote → Order
One-click conversion
Auto-fill:
Customer info
Selected machines
Pricing
Lock pricing after conversion (prevent accidental edits)
Generate invoice / contract
1.4 Automation Flow
Triggers
New inquiry submitted
Quote sent
Status changed
No activity for X days
Actions
Auto email replies
Assign to agent
Create follow-up tasks
Notify internal team
Example Flow
New Inquiry → Auto-reply email → Assign sales → 3 days no reply → Reminder → Quote sent → Follow-up in 2 days
1.5 CRM Expansion (Leads → Deals → Customers)
Unified customer profile:
Contact info
History (orders, chats, tickets)
Convert lead → customer automatically after first order
Repeat customer tracking

2. Support Agent Status System
2.1 Online / Offline Detection
Real-time agent presence
Status:
🟢 Online → clickable, instant chat
⚪ Offline → disabled interaction
2.2 UI Behavior
When Online
Highlight chat icon
Show “Available now”
Instant connection
When Offline
Greyed-out icon

Prompt:

“All agents are offline. Leave a message.”

2.3 Offline Message Handling
Store as ticket / lead
Auto email confirmation
Queue for next available agent

3. Product Enhancements
3.1 Side-by-Side Comparison
Features
Select multiple machines (2–4)
Compare:
Price (sale / rental)
Size / dimensions
Power requirements
Game type
Features
UX
Sticky comparison bar
Table layout
3.2 Favorites / Wishlist
Features
Save machines
Persistent (logged-in users)
Optional guest mode (local storage)
Use Cases
Planning events
Shortlisting for quotes

4. FAQ System (Interactive)
4.1 Core Features
FAQ categories
Searchable content
4.2 Voting Mechanism
👍 Useful
👎 Not useful
4.3 Auto Ranking Logic
Sort by:
Helpfulness score
Engagement
Promote high-value answers automatically
4.4 Optional Enhancements
Suggest related FAQs
Admin insights:
“Low-rated FAQs” → needs improvement

5. Subscription System
5.1 Subscription Types

Users can opt into:

News
Promotions
New products
5.2 Features
Email capture (with consent)
Preference selection
Double opt-in (recommended)
5.3 Automation
Trigger campaigns:
New product launch → notify subscribers
Seasonal promotions
Segmentation:
By interest
By past behavior

6. Promotions System
6.1 Discount Codes
Types:
Percentage (%)
Fixed amount
Constraints:
Expiry date
Usage limit
Minimum order value
6.2 Campaign Tracking
Campaign ID tracking
Metrics:
Usage count
Revenue generated
Link to:
Leads
Orders

7. Export System (Backend Enhancement)
7.1 Supported Formats
CSV
PDF
7.2 Exportable Data
Conversations (by day / agent)
Leads
Orders
Revenue reports
7.3 Filters
Date range
Status
Agent / user
7.4 Use Cases
Business reporting
Accounting
Performance tracking

8. RBAC (Role-Based Access Control) — Reserved
8.1 Future Roles
Admin
Sales
Support
Operations
8.2 Permissions
Module-level access
Action-level control (view / edit / delete)
8.3 API & Extensibility (Reserved)
REST / GraphQL API
Webhooks
Third-party integrations

9. Auto-Translation Integration
9.1 Feasibility

Yes—relatively easy with modern APIs.

9.2 Scope
Frontend content
Chat messages (optional)
FAQ & product descriptions
9.3 Approaches
Option A — Static Translation
Pre-translate content
Store per language
Option B — Real-time Translation
API-based (on demand)
Faster to implement
Slight cost per request
9.4 Considerations
Accuracy (technical terms)
Cost scaling
SEO impact (prefer static for SEO pages)