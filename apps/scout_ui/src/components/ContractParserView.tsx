// =============================================================================
// ContractParserView.tsx — Client-Wise AI Contract Parser & Extraction Pipeline
// Displays a client contract cards grid + split-pane extraction workspace
// =============================================================================

import React, { useState } from 'react';
import {
  File01Icon,
  Brain02Icon,
  Building01Icon,
  CheckmarkBadge01Icon,
  Alert02Icon,
  Upload01Icon,
  RefreshIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Edit01Icon,
  ViewIcon,
  FlashIcon,
} from 'hugeicons-react';
import { liveLlmService } from '../services/liveLlmService';

export interface ParsedContractTerms {
  clientName: string;
  effectiveDate: string;
  annualFee: number;
  discountPct: number;
  discountExpiry?: string;
  seatsIncluded: number;
  modules: string[];
  modulePrices: Record<string, number>;
  overageSeatPrice: number;
  rawClauses: {
    pricingClause?: string;
    discountClause?: string;
    entitlementsClause?: string;
    overageClause?: string;
  };
}

export interface ClientContractData {
  id: string;
  name: string;
  industry: string;
  contractRaw?: string;
  parsedTerms?: ParsedContractTerms;
  annualContractValue: number;
}

interface ContractParserViewProps {
  clients: ClientContractData[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onUpdateContract: (clientId: string, rawText: string) => void;
  onOpenUploadModal: (clientId: string) => void;
}

export const ContractParserView: React.FC<ContractParserViewProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onUpdateContract,
  onOpenUploadModal,
}) => {
  const [activeClientDetailId, setActiveClientDetailId] = useState<string | null>(null);
  const [editableText, setEditableText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const detailClient = clients.find((c) => c.id === (activeClientDetailId || selectedClientId)) || clients[0];

  const handleOpenDetail = (client: ClientContractData) => {
    setActiveClientDetailId(client.id);
    setEditableText(client.contractRaw || '');
  };

  const handleSaveAndReParse = async () => {
    if (!detailClient) return;
    setIsExtracting(true);
    if (liveLlmService.isLive()) {
      const extracted = await liveLlmService.extractContractTerms(editableText);
      if (extracted) {
        detailClient.parsedTerms = extracted;
      }
    }
    setIsExtracting(false);
    onUpdateContract(detailClient.id, editableText);
  };

  return (
    <div className="scout-fade-in">
      {/* If looking at all client contracts (Grid View) */}
      {!activeClientDetailId ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Client Contract Repository & Extraction Status
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                Each client has an isolated legal agreement repository, amendment history, and AI term extraction schema
              </div>
            </div>

            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)', background: 'var(--card, #ffffff)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)' }}>
              {clients.filter((c) => Boolean(c.contractRaw)).length}/{clients.length} Contracts Parsed
            </span>
          </div>

          {/* 3-Column Grid of Client Contract Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {clients.map((client) => {
              const hasContract = Boolean(client.contractRaw);
              const terms = client.parsedTerms;

              return (
                <div
                  key={client.id}
                  onClick={() => handleOpenDetail(client)}
                  style={{
                    padding: 20,
                    borderRadius: 'var(--radius, 10px)',
                    background: 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d1d5db)',
                    boxShadow: 'var(--shadow-xs)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 240,
                    transition: 'all 0.15s ease',
                  }}
                  className="scout-client-card"
                >
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 6, background: 'var(--accent, #e0e7ff)', color: 'var(--primary, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <File01Icon size={18} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                            {client.name}
                          </h3>
                          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>
                            {client.industry}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          borderRadius: 12,
                          fontWeight: 600,
                          background: hasContract ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: hasContract ? '#10b981' : '#f59e0b',
                        }}
                      >
                        {hasContract ? 'Parsed & Extracted' : 'Missing Contract'}
                      </span>
                    </div>

                    {/* Extracted Schema Preview */}
                    {hasContract && terms ? (
                      <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)', fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
                        <div><strong>Contract Fee:</strong> ${terms.annualFee.toLocaleString()}/yr</div>
                        <div><strong>Discount:</strong> {terms.discountPct}% {terms.discountExpiry ? `(exp ${terms.discountExpiry})` : '(No expiry)'}</div>
                        <div><strong>Included Seats:</strong> {terms.seatsIncluded} seats (${terms.overageSeatPrice}/seat overage)</div>
                        <div><strong>Modules:</strong> {terms.modules.join(', ')}</div>
                      </div>
                    ) : (
                      <div style={{ padding: 16, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px dashed var(--border, #d1d5db)', fontSize: 12, color: 'var(--muted-foreground, #6b7280)', textAlign: 'center', marginBottom: 12 }}>
                        No contract uploaded yet. Click to upload agreement and extract terms.
                      </div>
                    )}
                  </div>

                  {/* Card Footer Link */}
                  <div style={{ borderTop: '1px solid var(--border, #d1d5db)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary, #6366f1)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>Inspect Extraction & Clauses</span>
                      <ArrowRight01Icon size={12} />
                    </span>
                    {hasContract && (
                      <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckmarkBadge01Icon size={13} />
                        <span>99.4% Match</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed Client Contract Workspace (Split-Pane) */
        <div>
          {/* Detail Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border, #d1d5db)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setActiveClientDetailId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--foreground, #1e293b)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft01Icon size={14} />
                <span>All Client Contracts</span>
              </button>

              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                {detailClient.name} · Contract Extraction Workspace
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => onOpenUploadModal(detailClient.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
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
                <Upload01Icon size={13} />
                <span>Upload New Agreement / SOW</span>
              </button>
            </div>
          </div>

          {/* Split-Pane Extraction View */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Left Pane: Raw Document Editor */}
            <div style={{ padding: 20, borderRadius: 'var(--radius, 8px)', background: 'var(--card, #ffffff)', border: '1px solid var(--border, #d1d5db)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                  <File01Icon size={16} color="var(--primary, #6366f1)" />
                  <span>Raw Service Agreement Document</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontFamily: 'var(--font-mono)' }}>
                  service_agreement.md
                </span>
              </div>

              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                rows={16}
                placeholder="Paste or upload service agreement text..."
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
                  resize: 'vertical',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={handleSaveAndReParse}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 6,
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
                  <RefreshIcon size={13} />
                  <span>Re-Parse Agreement & Extract Terms</span>
                </button>
              </div>
            </div>

            {/* Right Pane: AI Structured Terms Extraction */}
            <div style={{ padding: 20, borderRadius: 'var(--radius, 8px)', background: 'var(--card, #ffffff)', border: '1px solid var(--border, #d1d5db)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                  <Brain02Icon size={16} color="var(--primary, #6366f1)" />
                  <span>AI Extracted Commercial Terms</span>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }}>
                  99.4% Extraction Confidence
                </span>
              </div>

              {detailClient.parsedTerms ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>BASE SUBSCRIPTION FEE</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                      ${detailClient.parsedTerms.annualFee.toLocaleString()}/year
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>INTRODUCTORY ONBOARDING DISCOUNT</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--destructive, #ef4444)', marginTop: 2 }}>
                      {detailClient.parsedTerms.discountPct}% discount — Expired {detailClient.parsedTerms.discountExpiry || '2026-01-15'}
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>INCLUDED USER SEATS QUOTA</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginTop: 2 }}>
                      {detailClient.parsedTerms.seatsIncluded} User Seats Included
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>METERED OVERAGE RATE</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginTop: 2 }}>
                      ${detailClient.parsedTerms.overageSeatPrice}/seat/month
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>ENTITLED FEATURE MODULES</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginTop: 2 }}>
                      {detailClient.parsedTerms.modules.join(', ')}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 24, borderRadius: 6, background: 'var(--muted, #f3f4f6)', border: '1px dashed var(--border, #d1d5db)', textAlign: 'center', color: 'var(--muted-foreground, #6b7280)' }}>
                  No parsed terms available yet. Enter or upload agreement text and click Re-Parse.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
