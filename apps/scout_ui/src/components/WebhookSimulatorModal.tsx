// =============================================================================
// WebhookSimulatorModal.tsx — Real-Time Webhook Event Dispatch Simulator
// Simulates live Stripe, Entitlements, Telemetry, and CRM webhook payloads
// =============================================================================

import React, { useState } from 'react';
import {
  FlashIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  CodeIcon,
  Invoice01Icon,
  UserGroupIcon,
  SecurityCheckIcon,
  File01Icon,
} from 'hugeicons-react';

export interface WebhookEventPayload {
  id: string;
  source: 'stripe' | 'entitlements' | 'telemetry' | 'salesforce';
  eventType: string;
  timestamp: string;
  clientName: string;
  payload: Record<string, any>;
  description: string;
}

interface WebhookSimulatorModalProps {
  clientName: string;
  onClose: () => void;
  onDispatch: (event: WebhookEventPayload) => void;
}

const sampleEvents: WebhookEventPayload[] = [
  {
    id: 'evt_stripe_disc',
    source: 'stripe',
    eventType: 'invoice.payment_succeeded',
    timestamp: new Date().toISOString(),
    clientName: 'Yojit FZE',
    description: 'Stripe processed recurring invoice ($3,500.00) with expired 20% promotional coupon code applied.',
    payload: {
      event: 'invoice.payment_succeeded',
      invoice_id: 'in_1Mxyz928374',
      customer_id: 'cus_YojitDubai99',
      amount_paid: 350000,
      currency: 'usd',
      discount_applied: {
        coupon_id: 'ONBOARDING_20_PCT',
        valid_until: '2026-01-15T00:00:00Z',
        active: true,
      },
    },
  },
  {
    id: 'evt_entitlements_module',
    source: 'entitlements',
    eventType: 'feature_flag.updated',
    timestamp: new Date().toISOString(),
    clientName: 'Yojit FZE',
    description: 'Customer success engineer activated Enterprise Analytics feature key without billing synchronization.',
    payload: {
      event: 'feature_flag.updated',
      account_id: 'acc_yojit_fze',
      feature_key: 'analytics_advanced_reporting',
      status: 'enabled',
      updated_by: 'support_engineer@internal.io',
      billing_sync_verified: false,
    },
  },
  {
    id: 'evt_telemetry_seats',
    source: 'telemetry',
    eventType: 'metrics.seat_threshold_exceeded',
    timestamp: new Date().toISOString(),
    clientName: 'Yojit FZE',
    description: 'Daily active user telemetry detected 175 unique active logins (75 seats exceeding 100 license cap).',
    payload: {
      event: 'metrics.seat_threshold_exceeded',
      client_id: 'yojit_fze',
      contracted_seats: 100,
      active_daily_users: 175,
      excess_seats: 75,
      metered_overage_rate: 50.0,
      monthly_overage_delta: 3750.0,
    },
  },
];

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  clientName,
  onClose,
  onDispatch,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(sampleEvents[0].id);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const selectedEvent = sampleEvents.find((e) => e.id === selectedEventId) || sampleEvents[0];

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
      onDispatch(selectedEvent);
      setTimeout(() => {
        setDispatchedSuccess(false);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
      }}
    >
      <div
        style={{
          width: 720,
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #d1d5db)',
          borderRadius: 'var(--radius, 12px)',
          padding: 28,
          boxShadow: 'var(--shadow-2xl)',
          color: 'var(--foreground, #1e293b)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Real-Time Pipeline Testing
            </div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: 18, color: 'var(--foreground, #1e293b)' }}>
              Live Ingestion & Webhook Event Simulator
            </h2>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
              Dispatch simulated operational events to trigger instantaneous automated dual-stage reconciliation.
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer', padding: 4 }}
          >
            <Cancel01Icon size={18} />
          </button>
        </div>

        {/* Event Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {sampleEvents.map((evt) => {
            const isSelected = selectedEventId === evt.id;
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius, 8px)',
                  background: isSelected ? 'var(--accent, #e0e7ff)' : 'var(--muted, #f3f4f6)',
                  border: isSelected ? '1px solid var(--primary, #6366f1)' : '1px solid var(--border, #d1d5db)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: isSelected ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)' }}>
                    {evt.source}
                  </span>
                  <FlashIcon size={12} color={isSelected ? 'var(--primary, #6366f1)' : '#9ca3af'} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                  {evt.eventType}
                </div>
              </div>
            );
          })}
        </div>

        {/* Description Strip */}
        <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)', fontSize: 12, color: 'var(--foreground, #1e293b)', marginBottom: 16 }}>
          <strong>Event Scenario:</strong> {selectedEvent.description}
        </div>

        {/* JSON Payload Inspector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>Raw JSON Webhook Payload:</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground, #6b7280)' }}>Content-Type: application/json</span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 14,
              borderRadius: 6,
              background: '#0f172a',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              lineHeight: 1.5,
              maxHeight: 180,
              overflowY: 'auto',
              border: '1px solid var(--border, #d1d5db)',
            }}
          >
            {JSON.stringify(selectedEvent.payload, null, 2)}
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center' }}>
          {dispatchedSuccess && (
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckmarkCircle01Icon size={14} />
              <span>Event Dispatched & Reconciled!</span>
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'transparent', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer' }}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDispatching}
            onClick={handleDispatch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 18px',
              borderRadius: 'var(--radius, 6px)',
              border: 'none',
              background: 'var(--primary, #6366f1)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: isDispatching ? 'wait' : 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <FlashIcon size={14} />
            <span>{isDispatching ? 'Dispatching & Reconciling...' : 'Dispatch Webhook Event'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
