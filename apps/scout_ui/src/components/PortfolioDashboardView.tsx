// =============================================================================
// PortfolioDashboardView.tsx — Executive Revenue Leakage Portfolio View
// High-Impact Bklit Bento Visualizations, Comparative Cross-Client Bar Analytics,
// Root-Cause Vectors, and 3-Column Enterprise Client Account Cards.
// =============================================================================

import React from 'react';
import {
  Alert02Icon,
  CheckmarkBadge01Icon,
  FlashIcon,
  PlusSignIcon,
  ArrowRight01Icon,
} from 'hugeicons-react';
import { BKLitKpiChart } from './BKLitKpiChart';
import type { ClientItem } from '../types/scout';

interface PortfolioDashboardViewProps {
  clients: ClientItem[];
  totalPortfolioAtRisk: number;
  totalMonthlyVelocity: number;
  totalOpenFlags: number;
  onSelectClient: (clientId: string) => void;
  onAddClient: () => void;
}

export const PortfolioDashboardView: React.FC<PortfolioDashboardViewProps> = ({
  clients,
  totalPortfolioAtRisk,
  totalMonthlyVelocity,
  totalOpenFlags,
  onSelectClient,
  onAddClient,
}) => {
  const cleanClientsCount = clients.filter(
    (c) => c.flags.filter((f) => f.status === 'open').length === 0
  ).length;

  return (
    <div className="scout-fade-in">
      {/* Top 3 Primary Bento KPI Cards (Expansive High-Impact Visualizations) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 18,
          marginBottom: 28,
        }}
      >
        {/* Card 1: Cumulative ARR at Risk */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Cumulative ARR at Risk
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--destructive, #ef4444)',
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  ${totalPortfolioAtRisk.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <Alert02Icon size={16} color="var(--destructive, #ef4444)" />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 3 }}>
              Across {totalOpenFlags} active leakage flags &bull; Entitlements vs Invoiced baseline
            </div>
          </div>
          <BKLitKpiChart type="cumulative_arr_area" height={165} />
        </div>

        {/* Card 2: Monthly Leak Velocity */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Monthly Leak Velocity
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--primary, #6366f1)',
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  ${totalMonthlyVelocity.toLocaleString('en-US', { minimumFractionDigits: 0 })}/mo
                </span>
                <FlashIcon size={16} color="var(--primary, #6366f1)" />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 3 }}>
              ${(totalMonthlyVelocity * 12).toLocaleString('en-US', { minimumFractionDigits: 0 })}/yr unbilled run-rate &bull; 6-Month Trajectory
            </div>
          </div>
          <BKLitKpiChart type="monthly_velocity_bars" height={165} />
        </div>

        {/* Card 3: Client Health & AI Assurance Allocation */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Portfolio Health & AI SLA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#10b981',
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {Math.round((cleanClientsCount / (clients.length || 1)) * 100)}% Reconciled
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--primary, #6366f1)',
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  96.3% AI SLA
                </span>
                <CheckmarkBadge01Icon size={16} color="#10b981" />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 3 }}>
              {cleanClientsCount}/{clients.length} Accounts leak-free &bull; Dual-Stage Deterministic + CoT
            </div>
          </div>
          <BKLitKpiChart type="health_rate_radial" height={165} />
        </div>
      </div>

      {/* Leak Distribution & Visual Breakdown by Root-Cause Vector */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 20,
            marginBottom: 16,
          }}
        >
          {/* Visual Bklit Multi-Bar Breakdown */}
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--primary, #6366f1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Portfolio Cross-Client Comparative
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                  Client ARR Baseline vs Recoverable Drift
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                Official Bklit Bar
              </span>
            </div>
            <BKLitKpiChart type="portfolio_client_comparison" height={175} />
          </div>

          {/* Visual Bklit Root-Cause Allocation Spectrum */}
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--destructive, #ef4444)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Root-Cause Exposure
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                  Unbilled Capital Breakdown by Vector
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--destructive, #ef4444)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                Root Spectrum
              </span>
            </div>
            <BKLitKpiChart type="root_cause_breakdown" height={175} />
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--foreground, #1e293b)' }}>
          Root-Cause Leak Breakdown Detail
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div
            style={{
              padding: 20,
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
              Stale Introductory Discounts
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--destructive, #ef4444)',
                marginTop: 6,
                fontFamily: 'var(--font-mono)',
              }}
            >
              $5,833.33
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, lineHeight: 1.5 }}>
              Coupons or promotional rates active past contracted expiration deadlines.
            </div>
          </div>

          <div
            style={{
              padding: 20,
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
              Unbilled Seat Overages
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--destructive, #ef4444)',
                marginTop: 6,
                fontFamily: 'var(--font-mono)',
              }}
            >
              $7,500.00
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, lineHeight: 1.5 }}>
              Daily active users exceeding base license limits without triggered metering.
            </div>
          </div>

          <div
            style={{
              padding: 20,
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
              Unbilled Add-on Modules
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--destructive, #ef4444)',
                marginTop: 6,
                fontFamily: 'var(--font-mono)',
              }}
            >
              $8,333.33
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, lineHeight: 1.5 }}>
              Premium features provisioned in app without corresponding billing line items.
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Client Accounts Card Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
              Monitored Client Accounts
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
              Click any client card to open its dedicated revenue reconciliation dashboard
            </div>
          </div>

          <button
            onClick={onAddClient}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius, 6px)',
              border: '1px solid var(--primary, #6366f1)',
              background: 'var(--accent, #e0e7ff)',
              color: 'var(--primary, #6366f1)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <PlusSignIcon size={14} />
            <span>Add Client Account</span>
          </button>
        </div>

        {/* Responsive Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {clients.map((client) => {
            const clientLeak = client.flags
              .filter((f) => f.status === 'open')
              .reduce((s, f) => s + f.cumulativeImpact, 0);
            const sourcesCount = [
              Boolean(client.contractRaw),
              Boolean(client.billingData),
              Boolean(client.entitlementsData),
              Boolean(client.usageData),
            ].filter(Boolean).length;

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
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
                  transition: 'all 0.15s ease',
                }}
                className="scout-client-card"
              >
                <div>
                  {/* Header & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                        {client.name}
                      </h3>
                      <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                        {client.contactName} · {client.billingSystem}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontWeight: 600,
                        background:
                          clientLeak > 0
                            ? 'rgba(239, 68, 68, 0.1)'
                            : sourcesCount === 0
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                        color:
                          clientLeak > 0
                            ? 'var(--destructive, #ef4444)'
                            : sourcesCount === 0
                            ? '#f59e0b'
                            : '#10b981',
                      }}
                    >
                      {clientLeak > 0
                        ? `${client.flags.filter((f) => f.status === 'open').length} Open Leaks`
                        : sourcesCount === 0
                        ? 'Needs Ingestion'
                        : 'Clean'}
                    </span>
                  </div>

                  {/* ACV & Leakage Value Bento */}
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      background: 'var(--muted, #f3f4f6)',
                      border: '1px solid var(--border, #d1d5db)',
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--muted-foreground, #6b7280)' }}>Contract ACV:</span>
                      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {client.annualContractValue > 0
                          ? `$${client.annualContractValue.toLocaleString()}`
                          : 'Awaiting Ingestion'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
                      <span style={{ color: 'var(--muted-foreground, #6b7280)' }}>ARR at Risk:</span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: clientLeak > 0 ? 'var(--destructive, #ef4444)' : '#10b981',
                        }}
                      >
                        ${clientLeak.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* 4-Source Readiness Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>
                      Data Readiness:
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: sourcesCount === 4 ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {sourcesCount}/4 Sources
                    </span>
                  </div>
                </div>

                {/* Card Action Link */}
                <div
                  style={{
                    borderTop: '1px solid var(--border, #d1d5db)',
                    paddingTop: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--primary, #6366f1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>Open Client Dashboard</span>
                    <ArrowRight01Icon size={13} />
                  </span>
                </div>
              </div>
            );
          })}

          {/* "+ Add New Client" Card */}
          <div
            onClick={onAddClient}
            style={{
              padding: 24,
              borderRadius: 'var(--radius, 10px)',
              background: 'transparent',
              border: '2px dashed var(--border, #d1d5db)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
              textAlign: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--accent, #e0e7ff)',
                color: 'var(--primary, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusSignIcon size={22} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Add Client Account
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                Create account & connect sources
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
