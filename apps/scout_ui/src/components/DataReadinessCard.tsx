// =============================================================================
// DataReadinessCard.tsx — 4-Source Client Data Readiness Tracker
// Tracks Contracts, Billing, Entitlements, and Telemetry with Upload CTAs
// =============================================================================

import React from 'react';
import {
  File01Icon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  UserGroupIcon,
  Upload01Icon,
  PlusSignIcon,
  CheckmarkBadge01Icon,
  Alert02Icon,
  FlashIcon,
} from 'hugeicons-react';
import type { IngestionSourceType } from './DataIngestionModal';

interface SourceStatus {
  hasData: boolean;
  title: string;
  details: string;
  lastSynced: string;
}

interface DataReadinessCardProps {
  clientName: string;
  contractStatus: SourceStatus;
  billingStatus: SourceStatus;
  entitlementsStatus: SourceStatus;
  usageStatus: SourceStatus;
  onOpenIngestionModal: (sourceType: IngestionSourceType) => void;
  onLoadAllSamples?: () => void;
}

export const DataReadinessCard: React.FC<DataReadinessCardProps> = ({
  clientName,
  contractStatus,
  billingStatus,
  entitlementsStatus,
  usageStatus,
  onOpenIngestionModal,
  onLoadAllSamples,
}) => {
  const sources = [
    { type: 'contract' as IngestionSourceType, label: '1. Contract Agreement', icon: File01Icon, status: contractStatus },
    { type: 'billing' as IngestionSourceType, label: '2. Billing System (Stripe)', icon: Invoice01Icon, status: billingStatus },
    { type: 'entitlements' as IngestionSourceType, label: '3. Product Entitlements', icon: CheckmarkCircle01Icon, status: entitlementsStatus },
    { type: 'usage' as IngestionSourceType, label: '4. Usage Telemetry', icon: UserGroupIcon, status: usageStatus },
  ];

  const connectedCount = sources.filter((s) => s.status.hasData).length;
  const isFullyReady = connectedCount === 4;

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 'var(--radius, 8px)',
        background: 'var(--card, #ffffff)',
        border: '1px solid var(--border, #d1d5db)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: 24,
      }}
    >
      {/* Header with Readiness Badge & Quick Load Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Data Ingestion Status
          </div>
          <h3 style={{ margin: '2px 0 0 0', fontSize: 16, color: 'var(--foreground, #1e293b)' }}>
            {clientName} · Operational Data Readiness
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onLoadAllSamples && !isFullyReady && (
            <button
              onClick={onLoadAllSamples}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 'var(--radius, 6px)',
                border: '1px solid var(--primary, #6366f1)',
                background: 'var(--accent, #e0e7ff)',
                color: 'var(--primary, #6366f1)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FlashIcon size={13} />
              <span>Load Complete Sample Dataset</span>
            </button>
          )}

          <span
            style={{
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              background: isFullyReady ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: isFullyReady ? '#10b981' : '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isFullyReady ? <CheckmarkBadge01Icon size={14} /> : <Alert02Icon size={14} />}
            <span>{connectedCount}/4 Data Sources Connected</span>
          </span>
        </div>
      </div>

      {/* Guided Onboarding Banner if 0/4 sources */}
      {connectedCount === 0 && (
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--radius, 6px)',
            background: 'var(--muted, #f3f4f6)',
            border: '1px dashed var(--border, #d1d5db)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>
              No operational data sources connected yet for {clientName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
              Upload contract agreement, billing invoices, entitlements, and telemetry to automatically trigger AI reconciliation.
            </div>
          </div>
          {onLoadAllSamples && (
            <button
              onClick={onLoadAllSamples}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius, 6px)',
                border: 'none',
                background: 'var(--primary, #6366f1)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FlashIcon size={13} />
              <span>Load 4 Sample Sources</span>
            </button>
          )}
        </div>
      )}

      {/* 4 Source Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        {sources.map((item) => {
          const IconComponent = item.icon;
          const { hasData, details, lastSynced } = item.status;
          return (
            <div
              key={item.type}
              style={{
                padding: 14,
                borderRadius: 'var(--radius, 6px)',
                background: hasData ? 'var(--card, #ffffff)' : 'var(--muted, #f3f4f6)',
                border: hasData ? '1px solid var(--border, #d1d5db)' : '1px dashed var(--border, #d1d5db)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: hasData ? 'var(--foreground, #1e293b)' : 'var(--muted-foreground, #6b7280)' }}>
                    <IconComponent size={15} color={hasData ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)'} />
                    <span>{item.label}</span>
                  </div>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: hasData ? '#10b981' : '#f59e0b',
                    }}
                  />
                </div>

                <div style={{ fontSize: 12, color: hasData ? 'var(--foreground, #1e293b)' : 'var(--muted-foreground, #6b7280)', lineHeight: 1.4, minHeight: 34 }}>
                  {hasData ? details : 'No data ingested yet.'}
                </div>

                <div style={{ fontSize: 10, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  {hasData ? `Updated: ${lastSynced}` : 'Status: Pending connection'}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => onOpenIngestionModal(item.type)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 4,
                    border: '1px solid var(--border, #d1d5db)',
                    background: hasData ? 'var(--muted, #f3f4f6)' : 'var(--primary, #6366f1)',
                    color: hasData ? 'var(--foreground, #1e293b)' : '#ffffff',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Upload01Icon size={12} />
                  <span>{hasData ? 'Update Source' : 'Upload / Connect'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
