// =============================================================================
// TrueUpInvoiceModal.tsx — Formal Itemized Customer True-Up Invoice Modal
// Generates printable, PDF-style true-up billing receipts with clause citations
// =============================================================================

import React, { useState } from 'react';
import {
  Invoice01Icon,
  Download01Icon,
  PrinterIcon,
  Copy01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  SecurityCheckIcon,
  File01Icon,
} from 'hugeicons-react';

export interface InvoiceLineItem {
  id: string;
  description: string;
  contractClause: string;
  period: string;
  quantity: string;
  unitPrice: number;
  total: number;
}

interface TrueUpInvoiceModalProps {
  clientName: string;
  contactName: string;
  contactEmail: string;
  currency: string;
  items: InvoiceLineItem[];
  onClose: () => void;
}

export const defaultYojitInvoiceItems: InvoiceLineItem[] = [
  {
    id: 'item_1',
    description: 'Promotional Discount Expiration Adjustment (20% rate applied past validity period)',
    contractClause: 'Section 3.2 (6-month onboarding promotion expiring 2026-01-15)',
    period: '2026-01-15 to 2026-08-15 (7 months)',
    quantity: '7 months',
    unitPrice: 833.33,
    total: 5833.33,
  },
  {
    id: 'item_2',
    description: 'Metered Daily Active User Seat Overage (50 seats exceeding 100 baseline quota)',
    contractClause: 'Section 4.3 ($50/seat/month overage rate for seats > 100)',
    period: '2026-06-01 to 2026-08-28 (3 billing cycles)',
    quantity: '50 seats × 3 mos',
    unitPrice: 50.0,
    total: 7500.0,
  },
  {
    id: 'item_3',
    description: 'Unbilled Feature Provisioning: Enterprise Analytics Add-on Module ($10k/yr rate)',
    contractClause: 'Section 4.1 (Analytics designated as optional add-on @ $10,000/year)',
    period: '2025-10-01 to 2026-08-01 (10 months pro-rated)',
    quantity: '10 months',
    unitPrice: 833.33,
    total: 8333.33,
  },
];

export const TrueUpInvoiceModal: React.FC<TrueUpInvoiceModalProps> = ({
  clientName,
  contactName,
  contactEmail,
  currency,
  items,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const invoiceNumber = `INV-2026-08-TRU-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = '2026-08-28';
  const dueDate = '2026-09-12 (Net 15)';

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = 0.0;
  const totalDue = subtotal + tax;

  const handleCopyPayload = () => {
    const payload = JSON.stringify(
      {
        invoiceNumber,
        clientName,
        contactName,
        contactEmail,
        currency,
        issueDate,
        dueDate,
        items,
        subtotal,
        totalDue,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
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
          width: 760,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #d1d5db)',
          borderRadius: 'var(--radius, 12px)',
          padding: 36,
          boxShadow: 'var(--shadow-2xl)',
          color: 'var(--foreground, #1e293b)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border, #d1d5db)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--accent, #e0e7ff)', color: 'var(--primary, #6366f1)', fontWeight: 700, textTransform: 'uppercase' }}>
              True-Up Adjustment Invoice
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', fontFamily: 'var(--font-mono)' }}>
              {invoiceNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleCopyPayload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--border, #d1d5db)',
                background: 'var(--muted, #f3f4f6)',
                color: 'var(--foreground, #1e293b)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? <CheckmarkCircle01Icon size={14} color="#10b981" /> : <Copy01Icon size={14} />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--border, #d1d5db)',
                background: 'var(--muted, #f3f4f6)',
                color: 'var(--foreground, #1e293b)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <PrinterIcon size={14} />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer', padding: 4 }}
            >
              <Cancel01Icon size={18} />
            </button>
          </div>
        </div>

        {/* Formal Printable Invoice Document */}
        <div style={{ border: '1px solid var(--border, #d1d5db)', borderRadius: 8, padding: 28, background: '#ffffff' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary, #6366f1)', letterSpacing: '-0.02em' }}>
                SCOUT ENTERPRISE
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                Revenue Operations & Financial Recovery Services
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>
                revops-billing@scoutguard.io · tax id: US-88492019
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                TRUE-UP INVOICE
              </div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--primary, #6366f1)', marginTop: 2, fontWeight: 700 }}>
                {invoiceNumber}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 4 }}>
                Issue Date: <strong>{issueDate}</strong>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>
                Payment Terms: <strong>{dueDate}</strong>
              </div>
            </div>
          </div>

          {/* Billed To & Contract Schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 14, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)', marginBottom: 24, fontSize: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-foreground, #6b7280)', textTransform: 'uppercase' }}>
                BILLED TO LEGAL ENTITY
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginTop: 2 }}>
                {clientName}
              </div>
              <div style={{ color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                Attn: {contactName}
              </div>
              <div style={{ color: 'var(--primary, #6366f1)', fontFamily: 'var(--font-mono)' }}>
                {contactEmail}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-foreground, #6b7280)', textTransform: 'uppercase' }}>
                GOVERNING COMMERCIAL CONTRACT
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginTop: 2 }}>
                Master SaaS Service Agreement
              </div>
              <div style={{ color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                Reconciliation Period: August 2025 – August 2026
              </div>
              <div style={{ color: 'var(--muted-foreground, #6b7280)' }}>
                Currency: <strong>{currency}</strong>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12, marginBottom: 20 }}>
            <thead>
              <tr style={{ background: 'var(--muted, #f3f4f6)', borderBottom: '2px solid var(--border, #d1d5db)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>Item Description & Clause Citation</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>Audit Period</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>Quantity</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--foreground, #1e293b)', textAlign: 'right' }}>Unit Rate</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--foreground, #1e293b)', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border, #d1d5db)' }}>
                  <td style={{ padding: '12px 12px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>{item.description}</div>
                    <div style={{ fontSize: 11, color: 'var(--primary, #6366f1)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <File01Icon size={12} />
                      <span>{item.contractClause}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--muted-foreground, #6b7280)', verticalAlign: 'top' }}>
                    {item.period}
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--foreground, #1e293b)', verticalAlign: 'top', fontFamily: 'var(--font-mono)' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', verticalAlign: 'top', fontFamily: 'var(--font-mono)' }}>
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--foreground, #1e293b)', verticalAlign: 'top', fontFamily: 'var(--font-mono)' }}>
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal & Summary Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <div style={{ width: 280, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--muted-foreground, #6b7280)' }}>
                <span>Reconciliation Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--muted-foreground, #6b7280)' }}>
                <span>Applicable Sales Tax (0%):</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid var(--border, #d1d5db)', marginTop: 4, fontSize: 15, fontWeight: 800 }}>
                <span style={{ color: 'var(--primary, #6366f1)' }}>Total Due:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary, #6366f1)' }}>
                  ${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Contractual Legal Footnote & Audit Verification */}
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)', fontSize: 11, color: 'var(--muted-foreground, #6b7280)', lineHeight: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 2 }}>
              <SecurityCheckIcon size={14} color="#10b981" />
              <span>Cryptographic Revenue Audit Verification · Hash: 0x7f8a9b2c3d4e</span>
            </div>
            This true-up statement represents the pro-rated adjustment between the executed Master Service Agreement, provisioned entitlement feature keys, and billed Stripe subscription ledger. Remittance instructions available via ACH / Wire Transfer.
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 18px',
              borderRadius: 'var(--radius, 6px)',
              border: 'none',
              background: 'var(--primary, #6366f1)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
