// =============================================================================
// DataIngestionModal.tsx — Interactive Multi-Source Data Ingestion Modal
// Supports Contracts, Billing CSV, Entitlements CSV, and Usage Telemetry CSV
// =============================================================================

import React, { useState } from 'react';
import {
  File01Icon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  UserGroupIcon,
  Cancel01Icon,
  Download01Icon,
  Alert02Icon,
  ArrowRight01Icon,
  FlashIcon,
} from 'hugeicons-react';

export type IngestionSourceType = 'contract' | 'billing' | 'entitlements' | 'usage';

interface DataIngestionModalProps {
  sourceType: IngestionSourceType;
  clientName: string;
  onClose: () => void;
  onSuccess: (data: {
    sourceType: IngestionSourceType;
    rawText: string;
    parsedCount: number;
    previewData?: any;
  }) => void;
}

const sampleDataPresets: Record<IngestionSourceType, { filename: string; content: string }> = {
  contract: {
    filename: 'service_agreement_v2.md',
    content: `# Service Agreement

## Client: Yojit FZE
## Effective Date: 2025-08-01

## Pricing & Commercial Schedule
- Section 3.1: Annual subscription fee of $50,000 billed in advance annually.
- Section 3.2: Customer receives 20% introductory onboarding discount for first 6 months, strictly expiring 2026-01-15.

## Entitlements & Licensing
- Section 4.1: Base entitlement includes 100 user seats and Basic Platform module.
- Section 4.2: Analytics module designated as optional add-on at $10,000/year.

## Overage Terms
- Section 4.3: Additional user seats beyond 100 included baseline billed at $50/seat/month.
`,
  },
  billing: {
    filename: 'stripe_invoices_2026_08.csv',
    content: `customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at
yojit_dubai,42000,20,100,"Basic",2026-08-28T12:00:00Z
`,
  },
  entitlements: {
    filename: 'entitlements_export.csv',
    content: `customer_id,granted_seats,granted_modules,granted_at
yojit_dubai,100,"Basic,Analytics",2025-10-01T09:00:00Z
`,
  },
  usage: {
    filename: 'daily_telemetry_2026_08.csv',
    content: `customer_id,period,active_seats,features_used
yojit_dubai,2026-08,150,"Basic,Analytics"
`,
  },
};

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  sourceType,
  clientName,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [textContent, setTextContent] = useState<string>(sampleDataPresets[sourceType].content);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);

  // Simple CSV parser for preview & validation
  const parseCsv = (text: string): { rows: string[][]; error?: string } => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      return { rows: [], error: 'CSV must contain a header row and at least one data row.' };
    }

    const rows: string[][] = lines.map((line) => {
      const row: string[] = [];
      let inQuotes = false;
      let cur = '';
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') inQuotes = !inQuotes;
        else if (c === ',' && !inQuotes) {
          row.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      row.push(cur.trim());
      return row;
    });

    const headers = rows[0].map((h) => h.toLowerCase());

    if (sourceType === 'billing') {
      const required = ['customer_id', 'current_price', 'active_discount_pct', 'billed_seats'];
      for (const col of required) {
        if (!headers.includes(col)) {
          return { rows, error: `Missing required column: ${col}` };
        }
      }
    } else if (sourceType === 'entitlements') {
      const required = ['customer_id', 'granted_seats', 'granted_modules'];
      for (const col of required) {
        if (!headers.includes(col)) {
          return { rows, error: `Missing required column: ${col}` };
        }
      }
    } else if (sourceType === 'usage') {
      const required = ['customer_id', 'period', 'active_seats'];
      for (const col of required) {
        if (!headers.includes(col)) {
          return { rows, error: `Missing required column: ${col}` };
        }
      }
    }

    return { rows };
  };

  const handleValidateAndSubmit = () => {
    setValidationError(null);

    if (!textContent.trim()) {
      setValidationError('Please provide content to ingest.');
      return;
    }

    if (sourceType === 'contract') {
      onSuccess({
        sourceType,
        rawText: textContent,
        parsedCount: 1,
      });
      onClose();
      return;
    }

    const { rows, error } = parseCsv(textContent);
    if (error) {
      setValidationError(error);
      return;
    }

    onSuccess({
      sourceType,
      rawText: textContent,
      parsedCount: rows.length - 1,
      previewData: rows,
    });
    onClose();
  };

  const handleLoadSample = () => {
    setTextContent(sampleDataPresets[sourceType].content);
    setValidationError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setTextContent(content);
      if (sourceType !== 'contract') {
        const { rows, error } = parseCsv(content);
        if (error) setValidationError(error);
        else {
          setValidationError(null);
          setPreviewRows(rows);
        }
      }
    };
    reader.readAsText(file);
  };

  const getSourceDetails = () => {
    switch (sourceType) {
      case 'contract':
        return {
          title: 'Contract Agreement Ingestion',
          desc: 'Upload Markdown (.md), PDF, or text service agreement for automated AI term extraction.',
          icon: File01Icon,
        };
      case 'billing':
        return {
          title: 'Billing & Invoicing CSV Connector',
          desc: 'Ingest Stripe or ERP billing subscriptions with recurring rates, coupons, and billed modules.',
          icon: Invoice01Icon,
        };
      case 'entitlements':
        return {
          title: 'Product Entitlements CSV Connector',
          desc: 'Ingest provisioned feature flags, granted user seat quotas, and activation timestamps.',
          icon: CheckmarkCircle01Icon,
        };
      case 'usage':
        return {
          title: 'Usage Telemetry CSV Connector',
          desc: 'Ingest active daily/monthly user counts and feature adoption logs to audit metered overages.',
          icon: UserGroupIcon,
        };
    }
  };

  const details = getSourceDetails();
  const IconComp = details.icon;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 640,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #d1d5db)',
          borderRadius: 'var(--radius, 12px)',
          padding: 28,
          boxShadow: 'var(--shadow-2xl)',
          color: 'var(--foreground, #1e293b)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius, 8px)',
                background: 'var(--accent, #e0e7ff)',
                color: 'var(--primary, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComp size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {clientName} · Data Source Connector
              </div>
              <h2 style={{ margin: '2px 0 0 0', fontSize: 18, color: 'var(--foreground, #1e293b)' }}>
                {details.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer', padding: 4 }}
          >
            <Cancel01Icon size={18} />
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--muted-foreground, #6b7280)', marginBottom: 20, lineHeight: 1.5 }}>
          {details.desc}
        </div>

        {/* Tab Switcher & Load Sample */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', background: 'var(--muted, #f3f4f6)', padding: 3, borderRadius: 6, border: '1px solid var(--border, #d1d5db)' }}>
            <button
              onClick={() => setActiveTab('paste')}
              style={{
                padding: '5px 12px',
                borderRadius: 4,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'paste' ? 'var(--card, #ffffff)' : 'transparent',
                color: activeTab === 'paste' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
                boxShadow: activeTab === 'paste' ? 'var(--shadow-xs)' : 'none',
              }}
            >
              Editor / Paste
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              style={{
                padding: '5px 12px',
                borderRadius: 4,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'upload' ? 'var(--card, #ffffff)' : 'transparent',
                color: activeTab === 'upload' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
                boxShadow: activeTab === 'upload' ? 'var(--shadow-xs)' : 'none',
              }}
            >
              Upload File
            </button>
          </div>

          <button
            onClick={handleLoadSample}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid var(--border, #d1d5db)',
              background: 'var(--card, #ffffff)',
              color: 'var(--primary, #6366f1)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-2xs)',
            }}
          >
            <FlashIcon size={13} />
            <span>Load Sample Preset</span>
          </button>
        </div>

        {/* Upload Mode */}
        {activeTab === 'upload' && (
          <div
            style={{
              padding: 28,
              border: '2px dashed var(--border, #d1d5db)',
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--muted, #f3f4f6)',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            <input
              type="file"
              accept={sourceType === 'contract' ? '.md,.markdown,.pdf,.txt' : '.csv'}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-ingest-input"
            />
            <label
              htmlFor="file-ingest-input"
              style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: 8 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent, #e0e7ff)', color: 'var(--primary, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download01Icon size={20} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>
                {selectedFile ? selectedFile.name : 'Click to browse or drop file here'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>
                Supported format: {sourceType === 'contract' ? 'Markdown (.md), PDF, Plain Text' : 'CSV files (.csv)'}
              </div>
            </label>
          </div>
        )}

        {/* Paste/Editor Mode */}
        {activeTab === 'paste' && (
          <div style={{ marginBottom: 16 }}>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={10}
              placeholder={sourceType === 'contract' ? 'Paste service agreement markdown here...' : 'Paste CSV rows including headers...'}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 6,
                border: '1px solid var(--border, #d1d5db)',
                background: 'var(--muted, #f3f4f6)',
                color: 'var(--foreground, #1e293b)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Validation Errors */}
        {validationError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--destructive, #ef4444)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Alert02Icon size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius, 6px)',
              border: '1px solid var(--border, #d1d5db)',
              background: 'transparent',
              color: 'var(--muted-foreground, #6b7280)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleValidateAndSubmit}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius, 6px)',
              border: 'none',
              background: 'var(--primary, #6366f1)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <CheckmarkCircle01Icon size={16} />
            <span>Validate & Ingest Source</span>
          </button>
        </div>
      </div>
    </div>
  );
};
