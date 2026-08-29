Revenue Leakage Guard
Plain English: SaaS companies accidentally under-bill customers because contracts,
product access, and actual usage drift out of sync over time. This tool compares what a
customer agreed to pay, what they were given, and what they used, then flags billing gaps
for finance to fix.

# Agents.md — Revenue Leakage Guard (Scout)

***

## Problem Statement

### The Core Problem

B2B SaaS companies accidentally **underbill their customers** because contracts, billing configurations, product entitlements, and actual usage data live in separate systems that never talk to each other. Over time, these systems drift apart, resulting in **1–5% of annual recurring revenue (ARR) lost** to billing gaps that nobody catches until months or years later.

### Real-World Example

**Scenario:** Double (Indian SaaS company) signs a deal with Yojit (Dubai-based company).

**Contract Terms:**
- Annual fee: $50,000
- 20% discount for first 6 months (expires 2026-01-15)
- 100 user seats included
- Premium analytics module: $10,000/year
- Overage seats: $50/seat/month

**What Actually Happens (6 Months Later):**
- The 20% discount is **still applied** in the billing system (should have expired 2026-01-15)
- Yojit is using **150 seats** (50 overage), but only being billed for 100
- The analytics module was **delivered but never billed**
- **Total loss: $15,000+ per year** — and nobody noticed

### Why This Happens

1. **Sales/Legal** move on after signing the contract — they never check billing again.
2. **Finance/RevOps** set up billing but rarely cross-reference it against live usage.
3. **Product/Engineering** provision features but don't audit invoices.
4. **Nobody's job** is to continuously reconcile all four systems against each other for every customer.

Manual audits happen once a year at best, catching only a fraction of what's already leaked — and by then, it's too late to recover most of the money.

***

## Solution: Revenue Leakage Guard (Scout)

### What It Is

An **always-on agentic system** that continuously reconciles four data sources — **contracts, billing configuration, product entitlements, and actual usage** — and surfaces every place where a B2B SaaS company is quietly under-billing its customers.

### How It Works (High-Level)

1. **Upload Data Sources:**
   - Contracts (Markdown or PDF)
   - Billing configuration (CSV or API)
   - Entitlement records (CSV)
   - Usage data (CSV)

2. **AI Parses Contracts:**
   - Extracts key terms: price, discount %, discount expiry, seats, modules, overage rates.
   - Stores as structured JSON for comparison.

3. **Nightly Reconciliation:**
   - Compares all four sources against each other.
   - Applies deterministic rules to detect mismatches.
   - Creates flags with dollar-impact scoring.

4. **Evidence-Backed Flags:**
   - Each flag shows exactly which contract clause, billing record, and usage data triggered it.
   - No black-box "AI says this is wrong" — finance can see the evidence.

5. **AI-Drafted Resolutions:**
   - For each flag, AI drafts a customer-facing email or internal note.
   - Cites contract clauses, dates, and amounts owed.
   - Finance reviews, edits if needed, and approves before sending.

6. **Human-in-the-Loop Approval:**
   - **Every customer-facing adjustment requires finance approval.**
   - Audit trail logs every action (who approved, when, what changed).

7. **Continuous Learning:**
   - Finance can mark flags as "known exceptions" (e.g., "VP-approved override").
   - System stops re-flagging known exceptions.
   - Gets smarter over time.

***

## Pages & Features

### Page 1: Landing Page

**Purpose:** Marketing page explaining the tool to new visitors.

**Sections:**
- **Hero Section:**
  - Headline: "Stop losing 1–5% of revenue to billing errors"
  - Subheadline: "Continuous reconciliation of contracts, billing, entitlements, and usage — catch leaks before they compound."
  - CTA: "Sign Up Free"

- **How It Works:**
  - Step 1: Upload contracts + billing + entitlements + usage
  - Step 2: AI reconciles all four sources nightly
  - Step 3: Get evidence-backed flags with dollar impact
  - Step 4: Approve AI-drafted emails → recover lost revenue

- **Features:**
  - Multi-contract parsing (Markdown/PDF)
  - Automated reconciliation (4 rules)
  - Evidence-backed flags (contract clauses + data)
  - AI-drafted customer emails
  - Human approval workflow
  - Audit trail for compliance

- **Social Proof:**
  - "Trusted by 50+ SaaS companies"
  - "Recovered $2.3M in leaked revenue in 2025"

- **Footer:**
  - Links: Pricing, Docs, Contact, Privacy Policy

***

### Page 2: Sign-Up / Onboarding

**Purpose:** User creates account and sets up company profile.

**Flow:**
1. **Sign-Up Form:**
   - Company name (e.g., "Double")
   - Work email (e.g., finance@double.com)
   - Password (or fake auth for hackathon)
   - "Create Account" button

2. **Onboarding Checklist:**
   - "Upload your first contract"
   - "Connect billing system (Stripe/CSV)"
   - "Upload entitlement data"
   - "Upload usage data"
   - Progress bar: 0/4 complete

3. **Redirect to Dashboard:**
   - After sign-up, user lands on main dashboard (empty state if no clients yet).

***

### Page 3: Main Dashboard (Portfolio View)

**Purpose:** Overview of ALL clients and total revenue at risk.

**Sections:**

#### 3.1: Top KPI Cards
- **Total Revenue at Risk:** Big number (e.g., "$47,250 across 12 clients")
- **Flags Open:** Number of unresolved flags (e.g., "23")
- **Recovery Progress:** Total recovered this month (e.g., "$18,500")
- **Leakage Rate:** Percentage of ARR lost to leakage (e.g., "1.2%")

#### 3.2: Charts

**Chart 1: Revenue at Risk by Client (Bar Chart)**
- X-axis: Client names (Yojit, Client2, Client3, etc.)
- Y-axis: $ at risk
- Sorted highest to lowest
- Click bar → go to client dashboard

**Chart 2: Leakage by Type (Pie Chart)**
- Expired discounts still applied: 40%
- Unbilled usage overages: 35%
- Unbilled features/modules: 25%
- Legend shows $ amounts for each slice

**Chart 3: Recovery Progress (Line Chart)**
- X-axis: Weeks 1–8
- Y-axis: Cumulative $ recovered
- Shows ROI of using the tool over time

**Chart 4: Flags Trend (Line Chart)**
- X-axis: Last 30 days
- Y-axis: Number of flags created vs. resolved
- Goal: Flags resolved > flags created (closing the gap)

#### 3.3: Recent Flags Table
- Columns: Client | Flag Type | $ Impact | Age | Status | Actions
- Sorted by $ impact (highest first)
- Click row → go to flag detail page
- Filters: By status (Open/Approved/Rejected), by flag type, by client

#### 3.4: Quick Actions
- "Create New Client" button
- "Upload Contract" button
- "Run Reconciliation Now" button (manual trigger)
- "View All Flags" button

***

### Page 4: Create New Client

**Purpose:** Add a new client to the system.

**Form Fields:**
- **Client Name:** (e.g., "Yojit FZE")
- **Description:** (optional, e.g., "Dubai-based logistics SaaS")
- **Industry:** Dropdown (SaaS, E-commerce, Fintech, Healthcare, etc.)
- **Contact Email:** (e.g., billing@yojit.com)
- **Contact Name:** (e.g., "Ahmed Al-Mansoori")
- **Timezone:** (e.g., "Asia/Dubai")
- **Currency:** (e.g., "USD")

**Buttons:**
- "Create Client" → saves and redirects to client dashboard
- "Cancel" → goes back to main dashboard

***

### Page 5: Client Dashboard (Individual Client View)

**Purpose:** Deep dive into ONE client's data, flags, and recovery progress.

**Left Sidebar: Data Sources Status**
- **Contracts:** ✅ 3 PDFs uploaded (last updated 2026-08-28)
- **Billing:** ✅ Stripe connected (last synced 2026-08-28)
- **Entitlements:** ✅ CSV uploaded (last updated 2026-08-20)
- **Usage:** ✅ CSV uploaded (last updated 2026-08-25)
- "Upload New Data" button (opens modal for each type)

#### 5.1: Client Summary (KPI Cards)
- **Contract Value:** $50,000/year
- **Currently Billed:** $42,000/year
- **Revenue at Risk:** $8,000/year (highlighted in red)
- **Flags Open:** 3
- **Recovery YTD:** $12,500

#### 5.2: 4-Panel Comparison (Side-by-Side View)

**Panel 1: Contract Terms**
- Price: $50,000/year
- Discount: 20% (expires 2026-01-15)
- Seats: 100 included
- Modules: Basic + Analytics ($10K/year)
- Overage: $50/seat/month

**Panel 2: Billing Configuration**
- Charged: $42,000/year
- Active discount: 20% (still active!)
- Billed seats: 100
- Billed modules: Basic only

**Panel 3: Entitlement Records**
- Granted seats: 100
- Granted modules: Basic + Analytics ✅

**Panel 4: Actual Usage**
- Active seats: 150 (50 overage!)
- Features used: Basic + Analytics ✅

**Red Highlights:** Show mismatches (e.g., discount still active, analytics not billed, 50 seats unbilled).

#### 5.3: Active Flags Table
- Columns: Flag Type | $ Impact (Monthly) | $ Impact (Cumulative) | Evidence | Status | Actions
- Rows:
  - Stale Discount | $1,500 | $4,500 | [View] | Open | [Draft Email]
  - Unbilled Module | $833 | $8,330 | [View] | Open | [Draft Invoice]
  - Usage Overage | $2,500 | $7,500 | [View] | Open | [Draft Email]
- Sort by cumulative impact (highest first)
- Click "View" → go to flag detail page
- Click "Draft Email" → opens AI drafting modal

#### 5.4: Timeline View (Horizontal Timeline)
- Shows key events over time:
  - 2025-08-01: Contract signed
  - 2026-01-15: Discount expired ← **Leak starts here**
  - 2025-10-01: Analytics module delivered ← **Leak starts here**
  - 2026-08-28: Today (3 leaks active)
- Visualizes when each leak started and how long it's been compounding.

#### 5.5: Recovery History Table
- Columns: Date | Issue | Amount Recovered | Status
- Rows:
  - 2026-07-15 | Q1 overage seats | $3,000 | ✅ Paid
  - 2026-06-01 | Expired discount Q4 | $2,250 | ✅ Paid
- Shows cumulative value of the tool for this client.

#### 5.6: Quick Actions
- "Upload New Contract" button
- "Upload Billing Data" button
- "Run Reconciliation Now" button
- "View All Flags" button
- "Export Report" button (PDF/CSV)

***

### Page 6: Flag Detail Page (Evidence View)

**Purpose:** Show full evidence for a specific flag and allow finance to approve/reject.

**Sections:**

#### 6.1: Flag Summary
- **Type:** Stale Discount
- **Client:** Yojit FZE (Dubai)
- **$ Impact:** $4,500 (3 months × $1,500/month)
- **Status:** Open
- **Created:** 2026-08-28 19:00

#### 6.2: Evidence Section

**Contract Clause:**
- Screenshot or text excerpt from contract:
  > "Section 3.2: Customer receives 20% discount for first 6 months, expiring 2026-01-15."

**Billing Configuration:**
- Data from billing system:
  - Active discount: 20% (as of 2026-08-28)
  - Last synced: 2026-08-28

**Usage Data:**
- Not applicable for this flag type (stale discount).

**Delta Calculation:**
- Discount applied 3 months past expiry
- Monthly loss: $1,500 (20% × $50,000 / 12)
- Cumulative loss: $4,500 (3 months × $1,500)

#### 6.3: AI-Drafted Resolution

**Draft Type:** Customer-facing email

**Draft Content:**
```
Subject: True-Up Invoice: Expired Discount (Section 3.2)

Hi Yojit Team,

Per Section 3.2 of our contract, the 20% intro discount expired on 2026-01-15. 
Our records show the discount remained active through 2026-05-15, resulting in 
$4,500 in under-billing.

Attached is a true-up invoice for the difference. Let us know if you have questions.

Best,
Double Finance Team
```

**Editable Textarea:** Finance can edit the draft before approving.

**Attachments:** Option to attach true-up invoice (PDF).

#### 6.4: Actions
- **Edit:** Modify draft email/invoice
- **Approve & Send:** Marks flag as "Approved" → sends email to client
- **Reject:** Marks flag as "Rejected" → adds note (optional)
- **Mark as Exception:** Marks flag as "Known Exception" → stops re-triggering
- **Add Note:** Internal note for audit trail (e.g., "VP-approved override")

#### 6.5: Audit Trail (Log)
- 2026-08-28 19:00 — Flag created by system
- 2026-08-28 19:05 — Draft generated by AI
- 2026-08-28 19:30 — Edited by finance_lead (changed tone to "friendly")
- (Pending: Finance approval)

***

### Page 7: Approval Queue (Draft Review)

**Purpose:** Review and approve multiple drafts at once.

**Sections:**

#### 7.1: Draft Queue Table
- Columns: Client | Issue | $ Impact | Draft Status | Actions
- Rows:
  - Yojit | Stale discount | $4,500 | Ready for Review | [Approve] [Edit] [Reject]
  - Yojit | Unbilled module | $10,000 | Ready for Review | [Approve] [Edit] [Reject]
  - Client 2 | Usage overage | $7,500 | Ready for Review | [Approve] [Edit] [Reject]

#### 7.2: Bulk Actions (Optional)
- **Approve All:** Approves all drafts in queue
- **Reject All:** Rejects all drafts in queue
- **Export All:** Exports all drafts as PDF/CSV

#### 7.3: Filter & Sort
- Filter by: Client, $ impact range, flag type
- Sort by: $ impact (highest first), date created (newest first)

***

### Page 8: Settings

**Purpose:** Configure reconciliation schedule, notifications, and team access.

**Sections:**

#### 8.1: Reconciliation Schedule
- **Dropdown:** Daily at 2 AM / Weekly on Monday at 2 AM / Monthly on 1st at 2 AM
- **Timezone:** User's local timezone (e.g., Asia/Dubai)
- **Last Run:** 2026-08-28 02:00 (successful)
- **Next Run:** 2026-08-29 02:00

#### 8.2: Email Notifications
- **Checkbox:** Send alerts for flags over $10,000
- **Checkbox:** Send weekly summary of all flags
- **Recipients:** finance@double.com, revops@double.com (comma-separated)

#### 8.3: Approval Thresholds (Optional)
- **Checkbox:** Require approval for all adjustments (recommended)
- **Alternative:** Auto-approve adjustments under $500 (not recommended)

#### 8.4: Team Members
- **List:**
  - finance@double.com (Approver)
  - revops@double.com (Viewer)
  - cfo@double.com (Approver)
- **Add Member:** Button to add new team member with role (Approver/Viewer)

#### 8.5: Data Retention
- **Dropdown:** Keep flags for 1 year / 2 years / Indefinitely
- **Dropdown:** Keep audit logs for 3 years / 7 years / Indefinitely

***

### Page 9: Audit Log (Compliance)

**Purpose:** Show all actions taken in the system for compliance and accountability.

**Sections:**

#### 9.1: Audit Log Table
- Columns: Date/Time | User | Action | Target | Details
- Rows:
  - 2026-08-28 19:00 | system | Flag created | Flag #123 | Stale discount, Yojit
  - 2026-08-28 19:05 | ai_agent | Draft generated | Draft #456 | Customer email
  - 2026-08-28 19:30 | finance_lead | Approved | Draft #456 | $4,500, sent to yojit@dubai.com
  - 2026-08-28 20:00 | system | Flag created | Flag #124 | Usage overage, Client 2

#### 9.2: Filter & Export
- **Filter by:** Date range, user, action type, client
- **Export:** Download as CSV/PDF for compliance audits

***

## Features (Detailed)

### Feature 1: Contract Upload + AI Parsing

**What:** Upload contracts (Markdown or PDF) → AI extracts key terms → stores as structured JSON.

**How:**
- User uploads Markdown file or pastes contract text.
- AI parses and extracts:
  - Client name
  - Effective date
  - Annual fee
  - Discount % and expiry
  - Seats included
  - Modules and prices
  - Overage rates
- Stores as JSON in database.

**Example Input (Markdown):**
```markdown
# Service Agreement

## Client: Yojit FZE
## Effective Date: 2025-08-01

## Pricing
- Annual Fee: $50,000
- Discount: 20% for first 6 months
- Discount Expiry: 2026-01-15

## Entitlements
- Seats: 100
- Modules: Basic, Analytics ($10,000/year)

## Overages
- Additional Seats: $50/seat/month
```

**Example Output (JSON):**
```json
{
  "client_name": "Yojit FZE",
  "effective_date": "2025-08-01",
  "annual_fee": 50000,
  "discount_pct": 20,
  "discount_expiry": "2026-01-15",
  "seats_included": 100,
  "modules": ["Basic", "Analytics"],
  "module_prices": {"Basic": 0, "Analytics": 10000},
  "overage_seat_price": 50
}
```

***

### Feature 2: Billing + Entitlement + Usage Data Upload

**What:** Upload CSV files for billing, entitlements, and usage → stored as structured data.

**How:**
- User uploads CSV files (or connects API like Stripe).
- System parses CSV and stores as JSON.
- Validates data format (required columns, data types).

**Example CSV Templates:**

**Billing Data:**
```csv
customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at
yojit_dubai,42000,20,100,"Basic",2026-08-28
```

**Entitlement Data:**
```csv
customer_id,granted_seats,granted_modules,granted_at
yojit_dubai,100,"Basic,Analytics",2025-10-01
```

**Usage Data:**
```csv
customer_id,period,active_seats,features_used
yojit_dubai,2026-08,150,"Basic,Analytics"
```

***

### Feature 3: Reconciliation Engine (4 Rules)

**What:** Compares all four data sources → creates flags for mismatches.

**How:**

**Rule 1: Stale Discount**
- **Logic:** If billing shows active discount AND today > contract discount expiry → flag.
- **Example:** Discount expired 2026-01-15, but billing still shows 20% active → flag $4,500 loss.

**Rule 2: Usage Overage**
- **Logic:** If usage shows more seats than contract includes → flag.
- **Example:** Contract says 100 seats, usage shows 150 seats → flag 50 seats × $50 = $2,500/month.

**Rule 3: Unbilled Module**
- **Logic:** If contract includes module with price AND billing doesn't charge for it → flag.
- **Example:** Analytics module in contract ($10K/year), but billing only charges for Basic → flag $10,000/year.

**Rule 4: Stale Contract Version** (optional, advanced)
- **Logic:** If contract was renewed/updated AND billing still on old version → flag.
- **Example:** Renewal signed with 15% price increase, billing still on old price → flag difference.

***

### Feature 4: Dollar-Impact Scoring

**What:** Every flag gets a monthly and cumulative $ impact.

**How:**

**Stale Discount:**
- Monthly: `(discount_pct × annual_fee) / 12`
- Cumulative: `monthly × months_since_expiry`

**Usage Overage:**
- Monthly: `excess_seats × overage_seat_price`
- Cumulative: `monthly × months_over`

**Unbilled Module:**
- Monthly: `module_price / 12`
- Cumulative: `monthly × months_unbilled`

***

### Feature 5: AI-Drafted Messages

**What:** LLM drafts customer-facing emails or invoices for each flag.

**How:**
- Sends flag data to LLM with prompt:
  > "Draft a customer-facing email for this billing issue. Include contract clause reference, dates, and amount owed. Tone: professional but friendly."
- LLM returns draft email.
- Finance reviews, edits if needed, and approves before sending.

**Example Output:**
```
Subject: True-Up Invoice: Expired Discount (Section 3.2)

Hi Yojit Team,

Per Section 3.2 of our contract, the 20% intro discount expired on 2026-01-15. 
Our records show the discount remained active through 2026-05-15, resulting in 
$4,500 in under-billing.

Attached is a true-up invoice for the difference. Let us know if you have questions.

Best,
Double Finance Team
```

***

### Feature 6: Human Approval Workflow

**What:** Every customer-facing adjustment requires finance approval.

**How:**
- Finance reviews AI-drafted email/invoice.
- Can edit, approve, reject, or mark as exception.
- Audit trail logs every action (who approved, when, what changed).

***

### Feature 7: Scheduled Reconciliation

**What:** Runs reconciliation automatically on a schedule (daily, weekly, monthly).

**How:**
- User sets schedule in settings.
- System runs reconciliation at scheduled time.
- Creates new flags, updates existing flags.
- Sends email/Slack alert if high-value flag found ($10K+).

***

### Feature 8: Exception Management

**What:** Mark flags as "known exceptions" so they don't re-trigger.

**How:**
- Finance marks flag as "Intentional override" or "Contract amendment pending".
- System stops re-flagging this issue for this client.
- Exception can have expiry date (e.g., "Data sync delay" → re-flag after 7 days).

***

### Feature 9: Audit Trail

**What:** Every action logged immutably for compliance.

**How:**
- Logs: timestamp, user, action, target, details.
- Append-only (cannot be edited or deleted).
- Exportable as CSV/PDF for audits.

***

### Feature 10: Charts & Data Visualization

**What:** Professional charts showing revenue at risk, leakage trends, recovery progress.

**How:**
- Main dashboard: Revenue at risk by client, leakage by type, recovery progress.
- Client dashboard: 4-panel comparison, timeline view, flag trend.
- All charts interactive (click to drill down).

***

## Success Metrics

- **Revenue Recovered:** Total $ recovered from flags (e.g., "$382K in 6 months").
- **Leakage Rate Reduction:** % decrease in revenue leakage over time (e.g., "from 3.2% to 0.8%").
- **Time to Resolution:** Average time from flag created → approved/rejected (e.g., "< 72 hours").
- **False Positive Rate:** % of flags rejected by finance (target: < 10%).

***

## Why This Matters

- **For SaaS Companies:** Recovers 1–5% of ARR that was already owed contractually — pure margin improvement.
- **For Finance Teams:** Automates manual, error-prone reconciliation work — saves hours per week.
- **For Customers:** Transparent, evidence-backed billing adjustments — no surprises, no disputes.

This isn't just a tool — it's **continuous revenue assurance** that compounds in value the longer it runs.