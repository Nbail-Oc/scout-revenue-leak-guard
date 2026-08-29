// =============================================================================
// AuditLogView.tsx — Compliance & Cryptographic Verification Audit Log
// Immutable chronological audit ledger of all dual-stage reconciliation runs,
// agent inferences, and human approvals with cryptographic hashes.
// =============================================================================

import React from 'react';
import { Download01Icon } from 'hugeicons-react';
import type { AuditLogEntry } from '../types/scout';

interface AuditLogViewProps {
  auditLogs: AuditLogEntry[];
  onExportReport: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  auditLogs,
  onExportReport,
}) => {
  return (
    <div className="scout-fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
            Cryptographic Financial Audit Ledger
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
            Immutable chronological records of all dual-stage reconciliation runs, agent inferences, and human approvals
          </div>
        </div>

        <button
          onClick={onExportReport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 'var(--radius, 6px)',
            border: '1px solid var(--border, #d1d5db)',
            background: 'var(--card, #ffffff)',
            color: 'var(--foreground, #1e293b)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-2xs)',
          }}
        >
          <Download01Icon size={14} />
          <span>Export Compliance Report (CSV/JSON)</span>
        </button>
      </div>

      <div
        style={{
          borderRadius: 'var(--radius, 8px)',
          overflow: 'hidden',
          border: '1px solid var(--border, #d1d5db)',
          background: 'var(--card, #ffffff)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--muted, #f3f4f6)', borderBottom: '1px solid var(--border, #d1d5db)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                Timestamp
              </th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                Actor
              </th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                Target Account
              </th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                Action Event
              </th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                Status
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  fontWeight: 600,
                  color: 'var(--muted-foreground, #6b7280)',
                  textAlign: 'right',
                }}
              >
                Audit Hash
              </th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border, #d1d5db)' }}>
                <td
                  style={{
                    padding: '14px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--muted-foreground, #6b7280)',
                  }}
                >
                  {log.timestamp}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>
                  {log.actor}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--foreground, #1e293b)' }}>
                  {log.clientName}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--muted-foreground, #6b7280)' }}>
                  {log.action}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        log.status === 'approved'
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'var(--accent, #e0e7ff)',
                      color: log.status === 'approved' ? '#10b981' : 'var(--primary, #6366f1)',
                    }}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--muted-foreground, #6b7280)',
                  }}
                >
                  <code>{log.hash}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
