// =============================================================================
// ResolutionDrafter.tsx — Multi-Tone AI Customer True-Up Notice Generator
// Supports Collaborative RevOps, Firm Contractual Notice, and Upsell Expansion
// Includes n8n Email Dispatch with Base64 Invoice Attachment
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  MailSend01Icon,
  FlashIcon,
  File01Icon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  Alert02Icon,
  Edit01Icon,
  UserGroupIcon,
  ViewIcon,
} from 'hugeicons-react';

export type ResolutionTone = 'revops' | 'legal' | 'expansion';

export interface DispatchNoticeOptions {
  to: string;
  cc: string;
  attachInvoice: boolean;
}

interface ResolutionDrafterProps {
  clientName: string;
  contactName: string;
  contactEmail: string;
  flagTitle: string;
  flagType: string;
  cumulativeImpact: number;
  monthsCompounding: number;
  evidenceClause: string;
  onApprove: (finalNoticeText: string, options: DispatchNoticeOptions) => Promise<void> | void;
  onMarkException: () => void;
  onViewInvoice: () => void;
}

export const ResolutionDrafter: React.FC<ResolutionDrafterProps> = ({
  clientName,
  contactName,
  contactEmail,
  flagTitle,
  flagType,
  cumulativeImpact,
  monthsCompounding,
  evidenceClause,
  onApprove,
  onMarkException,
  onViewInvoice,
}) => {
  const [selectedTone, setSelectedTone] = useState<ResolutionTone>('revops');
  const [noticeText, setNoticeText] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>(contactEmail || '');
  const [ccEmail, setCcEmail] = useState<string>('revops-audit@scoutguard.io');
  const [attachInvoice, setAttachInvoice] = useState<boolean>(true);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [showCcInput, setShowCcInput] = useState<boolean>(false);

  useEffect(() => {
    setRecipientEmail(contactEmail || '');
  }, [contactEmail]);

  const generateNoticeContent = (tone: ResolutionTone): string => {
    const formattedAmount = `$${cumulativeImpact.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    switch (tone) {
      case 'revops':
        return `Subject: True-Up Adjustment & Operational Billing Sync — ${clientName}

Dear ${contactName || 'Finance Team'} at ${clientName},

I hope you are having a productive quarter.

During our routine semi-annual revenue operations audit, we identified a configuration drift between our executed Service Agreement and the active billing subscription profile.

Specifically, following the conclusion of the onboarding phase (${evidenceClause}), invoices continued at the introductory rate rather than the standard contract baseline over the past ${monthsCompounding} months.

Reconciliation Summary:
• Account: ${clientName}
• Issue: ${flagTitle}
• Audit Adjustment Amount: ${formattedAmount}
• Attached: True-Up Invoice & Itemized Ledger

We have attached the formal itemized true-up invoice for ${formattedAmount}. Please let us know if you would like to review this on a quick call, or if you would like this adjusted directly against your next billing cycle.

Warm regards,

Finance & Revenue Operations Team
Scout Revenue Guard`;

      case 'legal':
        return `Subject: FORMAL NOTICE: Contractual True-Up Invoice for ${clientName}

Attn: ${contactName || 'Accounts Payable'}, Legal & Finance Department
${clientName}

Dear Accounts Payable Team,

Please be advised that pursuant to the terms and conditions of our Master Service Agreement (${evidenceClause}), a financial audit has determined an outstanding unbilled variance of ${formattedAmount}.

Audit Finding & Section Reference:
• Issue: ${flagTitle}
• Compounding Period: ${monthsCompounding} billing cycles
• Outstanding Balance Due: ${formattedAmount}

Per our contractual payment schedule, attached is True-Up Invoice (${formattedAmount}) payable under Net 15 terms. Subsequent recurring invoices will reflect the standard contractual schedule.

Please confirm receipt and remittance scheduling with our accounts team at revops-billing@scoutguard.io.

Sincerely,

Commercial Legal & Revenue Assurance Directorate
Scout Revenue Guard`;

      case 'expansion':
        return `Subject: Strategic Review & True-Up Alignment — Expanding ${clientName}

Hi ${contactName || 'Team'},

We are thrilled to see how rapidly ${clientName} has scaled its usage of our platform over the past ${monthsCompounding} months, particularly with your team's widespread adoption of Analytics and user seat growth.

As part of our periodic account review, our telemetry reflects that your team has exceeded your initial contract baseline, resulting in a pro-rated true-up delta of ${formattedAmount} (${evidenceClause}).

Rather than issuing a standard one-off true-up invoice, we would love to offer you a proactive Enterprise Tier Upgrade:
1. Lock in an expanded annual license covering all active seats + modules at a discounted tier.
2. Credit 50% of the past ${formattedAmount} true-up balance directly toward your multi-year renewal.

Attached is the itemized true-up invoice for your review. Let us know if you are open to exploring the annual tier upgrade this week.

Best regards,

Enterprise Growth & Customer Success
Scout Revenue Guard`;
    }
  };

  useEffect(() => {
    setNoticeText(generateNoticeContent(selectedTone));
  }, [selectedTone, clientName, flagTitle, cumulativeImpact, monthsCompounding, evidenceClause]);

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      await onApprove(noticeText, {
        to: recipientEmail || contactEmail,
        cc: ccEmail,
        attachInvoice,
      });
    } finally {
      setIsDispatching(false);
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
      }}
    >
      {/* Header & Tone Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--accent, #e0e7ff)', color: 'var(--primary, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MailSend01Icon size={16} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase' }}>
              AI Customer True-Up Drafter
            </div>
            <h3 style={{ margin: 0, fontSize: 15, color: 'var(--foreground, #1e293b)' }}>
              Resolution Strategy for {clientName}
            </h3>
          </div>
        </div>

        {/* 3 Tone Presets */}
        <div style={{ display: 'flex', background: 'var(--muted, #f3f4f6)', padding: 3, borderRadius: 6, border: '1px solid var(--border, #d1d5db)' }}>
          <button
            onClick={() => setSelectedTone('revops')}
            style={{
              padding: '5px 10px',
              borderRadius: 4,
              border: 'none',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              background: selectedTone === 'revops' ? 'var(--card, #ffffff)' : 'transparent',
              color: selectedTone === 'revops' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
              boxShadow: selectedTone === 'revops' ? 'var(--shadow-2xs)' : 'none',
            }}
          >
            Collaborative RevOps
          </button>
          <button
            onClick={() => setSelectedTone('legal')}
            style={{
              padding: '5px 10px',
              borderRadius: 4,
              border: 'none',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              background: selectedTone === 'legal' ? 'var(--card, #ffffff)' : 'transparent',
              color: selectedTone === 'legal' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
              boxShadow: selectedTone === 'legal' ? 'var(--shadow-2xs)' : 'none',
            }}
          >
            Firm Legal Notice
          </button>
          <button
            onClick={() => setSelectedTone('expansion')}
            style={{
              padding: '5px 10px',
              borderRadius: 4,
              border: 'none',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              background: selectedTone === 'expansion' ? 'var(--card, #ffffff)' : 'transparent',
              color: selectedTone === 'expansion' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
              boxShadow: selectedTone === 'expansion' ? 'var(--shadow-2xs)' : 'none',
            }}
          >
            Expansion / Upsell
          </button>
        </div>
      </div>

      {/* Recipient Configuration Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '12px 14px',
          borderRadius: 6,
          background: 'var(--muted, #f8fafc)',
          border: '1px solid var(--border, #e2e8f0)',
          marginBottom: 14,
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <span style={{ fontWeight: 600, color: 'var(--muted-foreground, #64748b)', width: 28 }}>To:</span>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@company.com"
              style={{
                flex: 1,
                maxWidth: 280,
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid var(--border, #cbd5e1)',
                background: '#ffffff',
                color: 'var(--foreground, #1e293b)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}
            />
            <button
              onClick={() => setShowCcInput(!showCcInput)}
              style={{
                padding: '3px 7px',
                borderRadius: 4,
                border: '1px solid var(--border, #cbd5e1)',
                background: 'transparent',
                color: 'var(--muted-foreground, #64748b)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {showCcInput ? 'Hide CC' : '+ CC'}
            </button>
          </div>

          <div>
            Recovery Impact:{' '}
            <strong style={{ color: 'var(--destructive, #ef4444)', fontFamily: 'var(--font-mono)' }}>
              ${cumulativeImpact.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        {showCcInput && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, color: 'var(--muted-foreground, #64748b)', width: 28 }}>CC:</span>
            <input
              type="text"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              placeholder="audit@yourdomain.com, billing@yourdomain.com"
              style={{
                flex: 1,
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid var(--border, #cbd5e1)',
                background: '#ffffff',
                color: 'var(--foreground, #1e293b)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>
        )}

        {/* Attachment Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px dashed var(--border, #e2e8f0)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, color: 'var(--foreground, #334155)', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={attachInvoice}
              onChange={(e) => setAttachInvoice(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--primary, #6366f1)' }}
            />
            <span>Attach Itemized True-Up Invoice (Base64 ASCII Receipt & Clause Citations)</span>
          </label>
        </div>
      </div>

      {/* Editable Notice Textarea */}
      <textarea
        value={noticeText}
        onChange={(e) => setNoticeText(e.target.value)}
        rows={12}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 6,
          border: '1px solid var(--border, #d1d5db)',
          background: 'var(--card, #ffffff)',
          color: 'var(--foreground, #1e293b)',
          fontFamily: 'inherit',
          fontSize: 12,
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
        }}
      />

      {/* Footer Action Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onViewInvoice}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius, 6px)',
              border: '1px solid var(--border, #d1d5db)',
              background: 'var(--muted, #f3f4f6)',
              color: 'var(--foreground, #1e293b)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-2xs)',
            }}
          >
            <Invoice01Icon size={14} color="var(--primary, #6366f1)" />
            <span>View Itemized True-Up Invoice</span>
          </button>

          <button
            onClick={onMarkException}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius, 6px)',
              border: '1px solid var(--border, #d1d5db)',
              background: 'transparent',
              color: 'var(--muted-foreground, #6b7280)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Mark Known Exception
          </button>
        </div>

        <button
          onClick={handleDispatch}
          disabled={isDispatching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 18px',
            borderRadius: 'var(--radius, 6px)',
            border: 'none',
            background: isDispatching ? 'var(--muted-foreground, #94a3b8)' : 'var(--primary, #6366f1)',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            cursor: isDispatching ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background 0.15s ease',
          }}
        >
          {isDispatching ? (
            <>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'scout-spin 0.8s linear infinite',
                }}
              />
              <span>Dispatching via n8n...</span>
            </>
          ) : (
            <>
              <CheckmarkCircle01Icon size={15} />
              <span>Approve & Dispatch via n8n</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

