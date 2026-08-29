// =============================================================================
// ApprovalQueueView.tsx — Finance True-Up Approval Queue
// One-click dispute resolution, multi-tone customer communication drafter,
// and itemized true-up reconciliation.
// =============================================================================

import React, { useState } from 'react';
import {
  CheckmarkCircle01Icon,
  Invoice01Icon,
} from 'hugeicons-react';
import { ResolutionDrafter } from './ResolutionDrafter';
import type { ClientItem, RevenueLeakFlag } from '../types/scout';

interface ApprovalQueueViewProps {
  selectedClient: ClientItem;
  onApproveResolution: (
    flagId: string,
    dispatchOptions?: { noticeText: string; to: string; cc: string; attachInvoice: boolean }
  ) => Promise<void> | void;
  onMarkException: (flagId: string) => void;
  onBulkApproveAll: () => void;
  onOpenInvoiceModal: () => void;
}

export const ApprovalQueueView: React.FC<ApprovalQueueViewProps> = ({
  selectedClient,
  onApproveResolution,
  onMarkException,
  onBulkApproveAll,
  onOpenInvoiceModal,
}) => {
  const [queueFilterStatus, setQueueFilterStatus] = useState<'all' | 'open' | 'approved'>('all');
  const [selectedQueueItem, setSelectedQueueItem] = useState<RevenueLeakFlag | null>(
    selectedClient.flags[0] || null
  );

  const openFlagsCount = selectedClient.flags.filter((f) => f.status === 'open').length;

  return (
    <div className="scout-fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setQueueFilterStatus('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid var(--border, #d1d5db)',
              background: queueFilterStatus === 'all' ? 'var(--primary, #6366f1)' : 'var(--card, #ffffff)',
              color: queueFilterStatus === 'all' ? '#ffffff' : 'var(--foreground, #1e293b)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Items ({selectedClient.flags.length})
          </button>
          <button
            onClick={() => setQueueFilterStatus('open')}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid var(--border, #d1d5db)',
              background: queueFilterStatus === 'open' ? 'var(--primary, #6366f1)' : 'var(--card, #ffffff)',
              color: queueFilterStatus === 'open' ? '#ffffff' : 'var(--foreground, #1e293b)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Pending Action ({openFlagsCount})
          </button>
          <button
            onClick={() => setQueueFilterStatus('approved')}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid var(--border, #d1d5db)',
              background: queueFilterStatus === 'approved' ? 'var(--primary, #6366f1)' : 'var(--card, #ffffff)',
              color: queueFilterStatus === 'approved' ? '#ffffff' : 'var(--foreground, #1e293b)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Approved / Reconciled
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onOpenInvoiceModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--border, #d1d5db)',
              background: 'var(--card, #ffffff)',
              color: 'var(--foreground, #1e293b)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Invoice01Icon size={14} />
            <span>Itemized Invoice</span>
          </button>

          <button
            onClick={onBulkApproveAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--primary, #6366f1)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <CheckmarkCircle01Icon size={14} />
            <span>Bulk Approve All Open ({openFlagsCount})</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Left Column: Flag Queue List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
            True-Up Adjustment Items ({selectedClient.name})
          </div>

          {selectedClient.flags
            .filter((f) => queueFilterStatus === 'all' || f.status === queueFilterStatus)
            .map((flag) => {
              const isSelected = selectedQueueItem?.id === flag.id;
              return (
                <div
                  key={flag.id}
                  onClick={() => setSelectedQueueItem(flag)}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius, 8px)',
                    background: isSelected ? 'var(--accent, #e0e7ff)' : 'var(--card, #ffffff)',
                    border: isSelected ? '1px solid var(--primary, #6366f1)' : '1px solid var(--border, #d1d5db)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-2xs)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--primary, #6366f1)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {flag.type.replace('_', ' ')}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--destructive, #ef4444)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      ${flag.cumulativeImpact.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginTop: 4 }}>
                    {flag.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 4 }}>
                    Status:{' '}
                    <span style={{ fontWeight: 600, color: flag.status === 'open' ? '#f59e0b' : '#10b981' }}>
                      {flag.status.toUpperCase()}
                    </span>{' '}
                    · {flag.monthsCompounding} months compounding
                  </div>
                </div>
              );
            })}
        </div>

        {/* Right Column: Multi-Tone AI Resolution Drafter */}
        {selectedQueueItem && (
          <ResolutionDrafter
            clientName={selectedClient.name}
            contactName={selectedClient.contactName}
            contactEmail={selectedClient.contactEmail}
            flagTitle={selectedQueueItem.title}
            flagType={selectedQueueItem.type}
            cumulativeImpact={selectedQueueItem.cumulativeImpact}
            monthsCompounding={selectedQueueItem.monthsCompounding}
            evidenceClause={selectedQueueItem.evidence.clause}
            onApprove={(noticeText, options) =>
              onApproveResolution(selectedQueueItem.id, {
                noticeText,
                to: options.to,
                cc: options.cc,
                attachInvoice: options.attachInvoice,
              })
            }
            onMarkException={() => onMarkException(selectedQueueItem.id)}
            onViewInvoice={onOpenInvoiceModal}
          />
        )}
      </div>
    </div>
  );
};
