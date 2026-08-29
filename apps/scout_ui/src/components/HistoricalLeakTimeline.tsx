// =============================================================================
// HistoricalLeakTimeline.tsx — Interactive Chronological Revenue Leak Timeline
// Visualizes when system drifts occurred and how monthly leakage compounded
// =============================================================================

import React, { useState } from 'react';
import {
  File01Icon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  UserGroupIcon,
  Alert02Icon,
  FlashIcon,
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
} from 'hugeicons-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: 'contract' | 'entitlements' | 'discount' | 'telemetry' | 'audit';
  description: string;
  driftSource: string;
  monthlyImpact: number;
  cumulativeImpactAtDate: number;
  isLeakStart: boolean;
}

interface HistoricalLeakTimelineProps {
  clientName: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'evt_1',
    date: '2025-08-01',
    title: 'Master Service Agreement Executed',
    category: 'contract',
    description: 'Contract signed for $50,000/yr ACV with 100 included user seats and a 20% 6-month onboarding discount (expiring 2026-01-15).',
    driftSource: 'Legal Agreement',
    monthlyImpact: 0,
    cumulativeImpactAtDate: 0,
    isLeakStart: false,
  },
  {
    id: 'evt_2',
    date: '2025-10-01',
    title: 'Analytics Module Activated in App',
    category: 'entitlements',
    description: 'Product engineering enabled the Analytics feature flag in entitlements DB. Stripe subscription was not updated with the $10k/yr line item.',
    driftSource: 'Entitlements vs Billing Drift',
    monthlyImpact: 833.33,
    cumulativeImpactAtDate: 0,
    isLeakStart: true,
  },
  {
    id: 'evt_3',
    date: '2026-01-15',
    title: 'Introductory Discount Expiration Deadline',
    category: 'discount',
    description: 'The 20% introductory onboarding discount legally expired per Section 3.2. Billing coupon remained active in recurring invoices.',
    driftSource: 'Billing vs Contract Drift',
    monthlyImpact: 833.33,
    cumulativeImpactAtDate: 2500.0,
    isLeakStart: true,
  },
  {
    id: 'evt_4',
    date: '2026-06-01',
    title: 'Active User Seats Expand to 150',
    category: 'telemetry',
    description: 'Telemetry logs report 150 daily active user accounts (50 excess seats). Metered overage billing webhook was not configured.',
    driftSource: 'Telemetry vs Contract Drift',
    monthlyImpact: 2500.0,
    cumulativeImpactAtDate: 11666.66,
    isLeakStart: true,
  },
  {
    id: 'evt_5',
    date: '2026-08-28',
    title: 'Today: Scout Dual-Stage Audit Scan',
    category: 'audit',
    description: 'Deterministic rule engine identifies 3 active compounding leaks ($4,166.66/month velocity). Agentic CoT drafts true-up notice for $21,666.66.',
    driftSource: 'Scout Hybrid Reconciler',
    monthlyImpact: 4166.66,
    cumulativeImpactAtDate: 21666.66,
    isLeakStart: false,
  },
];

export const HistoricalLeakTimeline: React.FC<HistoricalLeakTimelineProps> = ({ clientName }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('evt_5');

  const selectedEvent = timelineEvents.find((e) => e.id === selectedEventId) || timelineEvents[timelineEvents.length - 1];

  const getCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'contract':
        return File01Icon;
      case 'entitlements':
        return CheckmarkCircle01Icon;
      case 'discount':
        return Invoice01Icon;
      case 'telemetry':
        return UserGroupIcon;
      case 'audit':
        return Alert02Icon;
    }
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 'var(--radius, 8px)',
        background: 'var(--card, #ffffff)',
        border: '1px solid var(--border, #d1d5db)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Historical Drift Genesis
          </div>
          <h3 style={{ margin: '2px 0 0 0', fontSize: 16, color: 'var(--foreground, #1e293b)' }}>
            {clientName} · Revenue Leak Timeline & Compounding Velocity
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted-foreground, #6b7280)' }}>
          <Clock01Icon size={14} />
          <span>Genesis: August 2025 &rarr; Today: August 2026 (12 Months Elapsed)</span>
        </div>
      </div>

      {/* Horizontal Milestone Stepper */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
          position: 'relative',
          paddingBottom: 24,
          marginBottom: 20,
          borderBottom: '1px solid var(--border, #d1d5db)',
        }}
      >
        {timelineEvents.map((evt, idx) => {
          const isSelected = selectedEventId === evt.id;
          const IconComp = getCategoryIcon(evt.category);

          return (
            <div
              key={evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              style={{
                cursor: 'pointer',
                padding: 12,
                borderRadius: 'var(--radius, 8px)',
                background: isSelected ? 'var(--accent, #e0e7ff)' : 'var(--muted, #f3f4f6)',
                border: isSelected ? '1px solid var(--primary, #6366f1)' : '1px solid var(--border, #d1d5db)',
                boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: isSelected ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)' }}>
                  {evt.date}
                </span>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: evt.isLeakStart ? 'var(--destructive, #ef4444)' : isSelected ? 'var(--primary, #6366f1)' : '#10b981',
                  }}
                />
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground, #1e293b)', lineHeight: 1.3, minHeight: 32 }}>
                {evt.title}
              </div>

              {evt.isLeakStart && (
                <div style={{ fontSize: 10, color: 'var(--destructive, #ef4444)', fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FlashIcon size={11} />
                  <span>+${evt.monthlyImpact.toFixed(0)}/mo leak begins</span>
                </div>
              )}

              {evt.category === 'audit' && (
                <div style={{ fontSize: 10, color: 'var(--destructive, #ef4444)', fontWeight: 800, marginTop: 6 }}>
                  $21,666.66 Cumulative
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Event Detail Card */}
      <div style={{ padding: 16, borderRadius: 'var(--radius, 6px)', background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '75%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--accent, #e0e7ff)', color: 'var(--primary, #6366f1)', fontWeight: 700 }}>
              {selectedEvent.date}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
              {selectedEvent.title}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--foreground, #1e293b)', lineHeight: 1.5 }}>
            {selectedEvent.description}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 6 }}>
            Root-Cause Vector: <strong>{selectedEvent.driftSource}</strong>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>CUMULATIVE AT MILESTONE</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: selectedEvent.cumulativeImpactAtDate > 0 ? 'var(--destructive, #ef4444)' : '#10b981', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            ${selectedEvent.cumulativeImpactAtDate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {selectedEvent.monthlyImpact > 0 && (
            <div style={{ fontSize: 11, color: 'var(--destructive, #ef4444)', marginTop: 2 }}>
              Running Velocity: ${selectedEvent.monthlyImpact.toFixed(2)}/mo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
