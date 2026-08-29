# Scout Live Data Sender Specification

This document is the contract for the companion SaaS demo application that sends synthetic billing, contract, entitlement, and usage data to Scout.

## 1. Scout URL

Do not hardcode the host in application logic. Configure one environment variable:

```text
SCOUT_API_BASE_URL=http://localhost:3000
```

Send events to:

```text
POST ${SCOUT_API_BASE_URL}/api/demo/events
```

For the local demo, the expected full URL is:

```text
http://localhost:3000/api/demo/events
```

The current Scout visual UI runs separately on port `3713`; port `3713` is not the API endpoint.

If Scout is deployed publicly, replace the value with the public API origin, for example `https://scout-demo.example.com`.

## 2. Authentication and headers

Every request must include:

```http
Content-Type: application/json
X-Demo-Secret: <secret supplied by Scout>
```

The secret is for the demo only. Store it in an environment variable; never commit it to source control or display it in the UI.

## 3. Event envelope

Every request must have this shape:

```json
{
  "eventId": "evt_usage_002",
  "clientId": "yojit_dubai",
  "occurredAt": "2026-08-29T12:00:00.000Z",
  "source": "usage",
  "type": "usage.snapshot",
  "data": {}
}
```

Rules:

- `eventId` is stable across retries and unique per event.
- `clientId` must be identical across all four source types.
- `occurredAt` must be an ISO-8601 UTC timestamp.
- `source` must be exactly `contract`, `billing`, `entitlements`, or `usage`.
- `type` must match the source: `<source>.snapshot`.
- Send complete snapshots, not individual low-level telemetry records.
- Use numbers for money, seats, percentages, and counts; do not send formatted strings such as `"$42,000"`.

## 4. Source payloads

### Contract

```json
{
  "eventId": "evt_contract_001",
  "clientId": "yojit_dubai",
  "occurredAt": "2026-08-29T12:00:00.000Z",
  "source": "contract",
  "type": "contract.snapshot",
  "data": {
    "annualFee": 50000,
    "discountPct": 20,
    "discountExpiry": "2026-01-15",
    "seatsIncluded": 100,
    "modules": [
      { "name": "Basic", "annualPrice": 0 },
      { "name": "Analytics", "annualPrice": 10000 }
    ],
    "overageSeatPrice": 50,
    "currency": "USD",
    "contractReference": "agreement-2025-08-01"
  }
}
```

### Billing

```json
{
  "eventId": "evt_billing_001",
  "clientId": "yojit_dubai",
  "occurredAt": "2026-08-29T12:00:00.000Z",
  "source": "billing",
  "type": "billing.snapshot",
  "data": {
    "chargedAnnual": 42000,
    "activeDiscountPct": 20,
    "billedSeats": 100,
    "billedModules": ["Basic"],
    "lastSyncedAt": "2026-08-29T12:00:00.000Z",
    "currency": "USD"
  }
}
```

### Entitlements

```json
{
  "eventId": "evt_entitlements_001",
  "clientId": "yojit_dubai",
  "occurredAt": "2026-08-29T12:00:00.000Z",
  "source": "entitlements",
  "type": "entitlements.snapshot",
  "data": {
    "grantedSeats": 100,
    "grantedModules": ["Basic", "Analytics"],
    "grantedAt": "2025-10-01T00:00:00.000Z"
  }
}
```

### Usage / telemetry

The external name is `usage`. Scout may display this as “Telemetry”.

```json
{
  "eventId": "evt_usage_002",
  "clientId": "yojit_dubai",
  "occurredAt": "2026-08-29T12:05:00.000Z",
  "source": "usage",
  "type": "usage.snapshot",
  "data": {
    "activeSeats": 150,
    "featuresUsed": ["Basic", "Analytics"],
    "period": "2026-08"
  }
}
```

## 5. Correct demo sequence

Send the four initial snapshots in any order. Then send a changed usage snapshot:

1. Contract: 100 seats, Analytics costs $10,000/year.
2. Entitlements: 100 seats and Analytics enabled.
3. Billing: 100 seats, Basic billed, 20% discount still active.
4. Usage: 100 active seats.
5. Usage update: 150 active seats.

Scout should then show usage overage, the stale discount, and the unbilled Analytics module.

## 6. Response handling

Expected responses:

- `202`: event accepted.
- `200`: duplicate event safely ignored; do not generate a new event ID and retry forever.
- `400`: invalid JSON or invalid schema; fix the payload.
- `401`: incorrect or missing `X-Demo-Secret`.
- `404`: incorrect Scout base URL or API route is not running.
- `500`: Scout error; retry with the same `eventId` using exponential backoff.

Example sender request:

```ts
await fetch(`${process.env.SCOUT_API_BASE_URL}/api/demo/events`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Demo-Secret': process.env.SCOUT_DEMO_SECRET!,
  },
  body: JSON.stringify(event),
});
```

## 7. Sender success criteria

The companion app is correct when it can send the four snapshots and the later usage update, receives successful responses, reuses the same `eventId` on retries, and never sends `telemetry` or `stripe` as a `source`.
