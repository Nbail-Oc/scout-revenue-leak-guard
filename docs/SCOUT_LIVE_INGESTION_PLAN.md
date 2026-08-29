# Scout Live Ingestion Implementation Plan

This is the implementation plan for Scout to receive the companion SaaS application's live demo data.

## 1. Runtime and URLs

Keep the existing React/Rsbuild UI on port `3713`. Add a small long-lived Next.js API service on port `3000`.

Local URLs:

```text
Scout UI:  http://localhost:3713
Scout API: http://localhost:3000
POST:      http://localhost:3000/api/demo/events
SSE:       http://localhost:3000/api/demo/events/stream
State:     http://localhost:3000/api/demo/state
```

The API base URL is the origin only:

```text
SCOUT_API_BASE_URL=http://localhost:3000
```

If the API and UI are later served from one public origin, the sender URL becomes `https://<scout-host>/api/demo/events` without changing the route path.

## 2. API routes

### `POST /api/demo/events`

The Route Handler must:

1. Check `X-Demo-Secret` using a server-side environment variable.
2. Parse the JSON body.
3. Validate the event envelope and source-specific data.
4. Reject unknown sources and mismatched event types.
5. Ignore an already-seen `eventId` without applying it twice.
6. Normalize the payload into Scout's existing domain types.
7. Replace the latest snapshot for that `clientId` and source.
8. Run deterministic reconciliation when all four snapshots exist.
9. Broadcast the accepted event and updated client result to SSE subscribers.
10. Return `202` with the event ID and reconciliation readiness.

The handler must not call an external billing provider and must not trust client-supplied dollar-impact calculations. Scout calculates impacts from contract terms and normalized records.

### `GET /api/demo/events/stream`

Return an SSE stream using `ReadableStream` with these headers:

```http
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Content-Type-Options: nosniff
```

On connection, send the current in-memory state. Then send one event whenever a POST is accepted. Send a periodic heartbeat so the connection remains open.

### `GET /api/demo/state`

Return the current normalized client snapshots and flags. This is a simple recovery path if the browser connects after events have already been sent.

## 3. In-memory state

Use one process-local store:

```text
clients: Map<clientId, ClientState>
seenEventIds: bounded Set<string>
recentEvents: bounded array
sseSubscribers: Set<subscriber>
```

`ClientState` contains the latest contract, billing, entitlement, usage, and reconciliation result for one client.

Keep at most 100 recent events. No JSON file, Postgres database, Redis instance, or RocketRide pipeline is required for this hackathon demo.

Known limitation: restarting or scaling the API process clears state and disconnects SSE clients. Run one long-lived Node process for the demo.

## 4. Normalization rules

Map incoming fields as follows:

| Incoming source | Scout normalized data |
|---|---|
| `contract.snapshot` | `annualFee`, discount terms, included seats, modules, overage price |
| `billing.snapshot` | `chargedAnnual`, active discount, billed seats, billed modules |
| `entitlements.snapshot` | granted seats, granted modules, granted timestamp |
| `usage.snapshot` | active seats, features used, usage period |

Use `usage` as the canonical API source name. The UI can label it “Telemetry”. Do not mix `telemetry`, `usage`, `stripe`, or `salesforce` in the normalized contract.

All four snapshots must use the same `clientId`. A client is reconciliation-ready only when contract, billing, entitlements, and usage are present.

## 5. Reconciliation behavior

Reuse the existing deterministic reconciliation rules:

- Stale discount: billing still has a discount after the contract expiry date.
- Usage overage: active usage seats exceed contract-included seats.
- Unbilled module: a paid contract module is entitled or used but absent from billing.

Recalculate the complete result after every accepted snapshot. Do not trust a flag or amount sent by the companion application.

For the demo data, the expected result after the final usage update is:

- 50-seat monthly overage at $50 per seat.
- Analytics enabled but absent from billed modules.
- 20% discount still active after its expiry date.

## 6. UI changes

Replace the current local-only webhook simulator callback with an HTTP sender or a call to the real companion application.

The Scout UI must:

- Open `GET /api/demo/events/stream` on startup.
- Apply the initial state event.
- Apply each subsequent normalized state update.
- Show API/SSE connection status.
- Show the last received event timestamp.
- Keep the existing reconciliation and flag views as the presentation layer.

If the UI and API use different origins, enable CORS only for the Scout UI origin and allow the required `Content-Type` header. The demo secret must never be placed in browser code.

## 7. Testing and acceptance

Add tests for:

- Valid contract, billing, entitlement, and usage events.
- Missing required fields.
- Wrong secret.
- Unknown source or mismatched event type.
- Duplicate event IDs.
- Reconciliation after the fourth source arrives.
- Updated flags after the usage snapshot changes from 100 to 150 seats.
- SSE initial state and subsequent event delivery.
- Multiple connected dashboards receiving the same event.

The integration is complete when the companion app can post to the configured URL, Scout returns `202`, the dashboard receives the event over SSE, and the revenue-leak flags change visibly without a page refresh.

## 8. Explicitly out of scope

- Real Stripe, NetSuite, Salesforce, or product telemetry connectors.
- File export/import between the two applications.
- Durable storage.
- Background queues.
- WebSockets.
- Multi-tenant production authentication.
- RocketRide pipelines.
