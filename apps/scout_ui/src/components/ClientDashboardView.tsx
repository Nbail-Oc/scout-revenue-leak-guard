// =============================================================================
// ClientDashboardView.tsx — Dedicated Enterprise Client Revenue Reconciliation Workspace
// 4-Source Data Readiness Tracker, 4-Panel Synchronized Matrix, Official Bklit Visualizations,
// Dual-Stage Chain-of-Thought Inspector, and Historical ARR Forecast Simulator.
// =============================================================================

import React, { useState } from 'react';
import {
  Brain02Icon,
  Clock01Icon,
  File01Icon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  UserGroupIcon,
  Upload01Icon,
  Edit01Icon,
  CheckmarkBadge01Icon,
  Cancel01Icon,
  FlashIcon,
  Alert02Icon,
  MailSend01Icon,
} from 'hugeicons-react';
import { DataReadinessCard } from './DataReadinessCard';
import { HistoricalLeakTimeline } from './HistoricalLeakTimeline';
import { ARRForecastSimulator } from './ARRForecastSimulator';
import { BKLitKpiChart, ConcentricRingGauge } from './BKLitKpiChart';
import { SimpleAreaChart } from './simple-charts/SimpleAreaChart';
import { SimpleBarChart } from './simple-charts/SimpleBarChart';
import type { ClientItem, RevenueLeakFlag } from '../types/scout';
import type { IngestionSourceType } from './DataIngestionModal';

interface ClientDashboardViewProps {
  selectedClient: ClientItem;
  onOpenIngestionModal: (type: IngestionSourceType) => void;
  onLoadAllSamples: () => void;
  onOpenInvoiceModal: () => void;
  onOpenDraftNotice: (flag: RevenueLeakFlag) => void;
  onOpenERPWriteback: () => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({
  selectedClient,
  onOpenIngestionModal,
  onLoadAllSamples,
  onOpenInvoiceModal,
  onOpenDraftNotice,
  onOpenERPWriteback,
}) => {
  const [clientWorkspaceView, setClientWorkspaceView] = useState<'matrix' | 'timeline'>('matrix');
  const [selectedCoTFlag, setSelectedCoTFlag] = useState<RevenueLeakFlag | null>(null);

  const openFlags = selectedClient.flags.filter((f) => f.status === 'open');
  const monthlyLeakVelocity = openFlags.reduce((s, f) => s + f.monthlyImpact, 0);
  const cumulativeRecoverable = openFlags.reduce((s, f) => s + f.cumulativeImpact, 0);

  // Dynamic 30-day run-rate trajectory data for Bklit AreaChart
  const baseContractMonthly = (selectedClient.parsedTerms?.annualFee || selectedClient.annualContractValue || 50000) / 12;
  const billedMonthly = (selectedClient.billingData?.chargedAnnual || 42000) / 12;
  const overageSeatsMonthly = selectedClient.usageData?.activeDailySeats
    ? Math.max(0, selectedClient.usageData.activeDailySeats - (selectedClient.parsedTerms?.seatsIncluded || 100)) * 50
    : 0;

  const trajectoryData = [
    { date: '2026-08-01', expected: baseContractMonthly, invoiced: billedMonthly },
    { date: '2026-08-06', expected: baseContractMonthly, invoiced: billedMonthly },
    { date: '2026-08-12', expected: baseContractMonthly + 833.33, invoiced: billedMonthly },
    { date: '2026-08-18', expected: baseContractMonthly + 833.33, invoiced: billedMonthly },
    { date: '2026-08-24', expected: baseContractMonthly + 833.33 + overageSeatsMonthly, invoiced: billedMonthly },
    { date: '2026-08-29', expected: baseContractMonthly + 833.33 + overageSeatsMonthly, invoiced: billedMonthly },
  ];

  // 4-Source Calibration Bar Data
  const crossSystemData = [
    {
      month: 'Contract',
      amount: selectedClient.parsedTerms?.annualFee || selectedClient.annualContractValue || 50000,
    },
    {
      month: 'Stripe Billed',
      amount: selectedClient.billingData?.chargedAnnual || 0,
    },
    {
      month: 'Entitled DB',
      amount:
        (selectedClient.entitlementsData?.grantedSeats ? selectedClient.entitlementsData.grantedSeats * 500 : 50000) +
        (selectedClient.entitlementsData?.grantedModules?.includes('Analytics') ? 10000 : 0),
    },
    {
      month: 'Telemetry',
      amount:
        (selectedClient.usageData?.activeDailySeats ? selectedClient.usageData.activeDailySeats * 500 : 50000) +
        (selectedClient.usageData?.featuresUsed?.includes('Analytics') ? 10000 : 0),
    },
  ];

  return (
    <div className="scout-fade-in">
      {/* View Sub-Tabs Switcher (Matrix vs Timeline & Simulator) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            background: 'var(--muted, #f3f4f6)',
            padding: 3,
            borderRadius: 6,
            border: '1px solid var(--border, #d1d5db)',
          }}
        >
          <button
            onClick={() => setClientWorkspaceView('matrix')}
            style={{
              padding: '6px 14px',
              borderRadius: 4,
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: clientWorkspaceView === 'matrix' ? 'var(--card, #ffffff)' : 'transparent',
              color: clientWorkspaceView === 'matrix' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
              boxShadow: clientWorkspaceView === 'matrix' ? 'var(--shadow-2xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Brain02Icon size={14} />
            <span>4-Panel Matrix & Flags</span>
          </button>
          <button
            onClick={() => setClientWorkspaceView('timeline')}
            style={{
              padding: '6px 14px',
              borderRadius: 4,
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: clientWorkspaceView === 'timeline' ? 'var(--card, #ffffff)' : 'transparent',
              color: clientWorkspaceView === 'timeline' ? 'var(--primary, #6366f1)' : 'var(--muted-foreground, #6b7280)',
              boxShadow: clientWorkspaceView === 'timeline' ? 'var(--shadow-2xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Clock01Icon size={14} />
            <span>Historical Timeline & ARR Simulator</span>
          </button>
        </div>

        <span style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)' }}>
          Operating Currency: <strong>{selectedClient.currency}</strong> · Billing Engine:{' '}
          <strong>{selectedClient.billingSystem}</strong>
        </span>
      </div>

      {/* Top Metric Strip for Selected Client */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: 18,
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground, #6b7280)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Contract Baseline Value
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--foreground, #1e293b)',
              marginTop: 4,
              fontFamily: 'var(--font-mono)',
            }}
          >
            ${(selectedClient.parsedTerms?.annualFee || selectedClient.annualContractValue).toLocaleString()}.00/yr
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 2, fontWeight: 500 }}>Base legal agreement</div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground, #6b7280)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Currently Billed Rate
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--primary, #6366f1)',
              marginTop: 4,
              fontFamily: 'var(--font-mono)',
            }}
          >
            ${(selectedClient.billingData?.chargedAnnual || 0).toLocaleString()}.00/yr
          </div>
          <div
            style={{
              fontSize: 11,
              color: selectedClient.billingData?.activeDiscountPct ? '#f59e0b' : '#10b981',
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {selectedClient.billingData
              ? `${selectedClient.billingData.activeDiscountPct}% discount active`
              : 'No billing synced'}
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 'var(--radius, 8px)',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--destructive, #ef4444)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Monthly Leakage Velocity
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--destructive, #ef4444)',
              marginTop: 4,
              fontFamily: 'var(--font-mono)',
            }}
          >
            ${monthlyLeakVelocity.toFixed(2)}/mo
          </div>
          <div style={{ fontSize: 11, color: 'var(--destructive, #ef4444)', marginTop: 2 }}>
            Compounding monthly run-rate
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 'var(--radius, 8px)',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11,
                color: 'var(--destructive, #ef4444)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Cumulative Recoverable ARR
            </span>
            <button
              onClick={onOpenInvoiceModal}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--primary, #6366f1)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Invoice01Icon size={12} />
              <span>Invoice</span>
            </button>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--destructive, #ef4444)',
              marginTop: 4,
              fontFamily: 'var(--font-mono)',
            }}
          >
            ${cumulativeRecoverable.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--destructive, #ef4444)', marginTop: 2 }}>
            Across {openFlags.length} active leak vectors
          </div>
        </div>
      </div>

      {/* Dedicated Official Bklit Visual Analytics for Selected Client */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Client Chart 1: 30-Day Entitlements vs Invoiced Run-Rate Curve (Official Bklit AreaChart) */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
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
                Revenue Assurance Trajectory
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Legal Contract Baseline vs Active Stripe Billing
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--destructive, #ef4444)',
                background: 'rgba(239, 68, 68, 0.08)',
                padding: '3px 8px',
                borderRadius: 6,
                fontFamily: 'var(--font-mono)',
              }}
            >
              -${monthlyLeakVelocity.toFixed(0)}/mo Gap
            </span>
          </div>
          <div style={{ width: '100%', minHeight: 175 }}>
            <SimpleAreaChart
              data={trajectoryData}
              xDataKey="date"
              areaKeys={[
                { key: 'expected', color: '#ef4444', fillOpacity: 0.3 },
                { key: 'invoiced', color: '#6366f1', fillOpacity: 0.2 },
              ]}
              height={175}
            />
          </div>
        </div>

        {/* Client Chart 2: 4-Source Cross-System Dollar Calibration Spectrum (Official Bklit BarChart) */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 'var(--radius, 8px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #d1d5db)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
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
                4-Source Cross-Reconciliation
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Annualized Dollar Valuation Across All Systems
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              Live Calibrated
            </span>
          </div>
          <div style={{ width: '100%', minHeight: 175 }}>
            <SimpleBarChart
              data={crossSystemData}
              xDataKey="month"
              barKey="amount"
              barColor="#6366f1"
              height={175}
            />
          </div>
        </div>

        {/* Client Chart 3: Leak Vector Risk Allocation Concentric Ring */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
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
                Leakage Composition
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Risk Vector Allocation & SLA
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.08)',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              {openFlags.length} Active Flags
            </span>
          </div>
          <ConcentricRingGauge
            data={
              openFlags.length > 0
                ? openFlags.map((f, i) => ({
                    label: f.type.replace(/_/g, ' '),
                    value: Math.round((f.cumulativeImpact / (cumulativeRecoverable || 1)) * 100),
                    color: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#6366f1',
                  }))
                : [{ label: 'Clean SLA', value: 100, color: '#10b981' }]
            }
            centerValue={openFlags.length > 0 ? `${openFlags.length} Leaks` : '100%'}
            centerLabel={openFlags.length > 0 ? 'Remediation Req' : 'SLA Compliant'}
            size={190}
          />
        </div>
      </div>

      {/* TAB VIEW 1: 4-PANEL MATRIX & FLAGS */}
      {clientWorkspaceView === 'matrix' && (
        <div>
          {/* 4-Source Data Readiness Tracker with Ingestion CTAs */}
          <DataReadinessCard
            clientName={selectedClient.name}
            contractStatus={{
              hasData: Boolean(selectedClient.contractRaw),
              title: 'Contract Agreement',
              details: selectedClient.contractRaw
                ? `Base Fee $${selectedClient.parsedTerms?.annualFee.toLocaleString() || '50k'}`
                : 'Missing contract file',
              lastSynced: '2026-08-28',
            }}
            billingStatus={{
              hasData: Boolean(selectedClient.billingData),
              title: 'Billing Configuration',
              details: selectedClient.billingData
                ? `$${selectedClient.billingData.chargedAnnual.toLocaleString()}/yr (${selectedClient.billingData.activeDiscountPct}% discount)`
                : 'Missing billing record',
              lastSynced: selectedClient.billingData?.lastSynced || 'Pending',
            }}
            entitlementsStatus={{
              hasData: Boolean(selectedClient.entitlementsData),
              title: 'Product Entitlements',
              details: selectedClient.entitlementsData
                ? `${selectedClient.entitlementsData.grantedSeats} seats · ${selectedClient.entitlementsData.grantedModules.join(', ')}`
                : 'Missing entitlements',
              lastSynced: selectedClient.entitlementsData?.grantedAt || 'Pending',
            }}
            usageStatus={{
              hasData: Boolean(selectedClient.usageData),
              title: 'Usage Telemetry',
              details: selectedClient.usageData
                ? `${selectedClient.usageData.activeDailySeats} active seats (${selectedClient.usageData.period})`
                : 'Missing telemetry data',
              lastSynced: selectedClient.usageData?.period || 'Pending',
            }}
            onOpenIngestionModal={(type) => onOpenIngestionModal(type)}
            onLoadAllSamples={onLoadAllSamples}
          />

          {/* Synchronized 4-Panel Matrix (Shown when sources exist) */}
          {selectedClient.contractRaw && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: 'var(--foreground, #1e293b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Synchronized 4-Panel Cross-System Matrix</span>
                <span style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', fontWeight: 400 }}>
                  Click 'Update' on any panel to ingest fresh data
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {/* Panel 1: Contract Baseline */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius, 8px)',
                    background: 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d1d5db)',
                    boxShadow: 'var(--shadow-2xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--primary, #6366f1)' }}>
                      <File01Icon size={14} />
                      <span>1. Contract Baseline</span>
                    </div>
                    <button
                      onClick={() => onOpenIngestionModal('contract')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--primary, #6366f1)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Edit01Icon size={12} />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--foreground, #1e293b)' }}>
                    <div>
                      <strong>Annual Fee:</strong> ${selectedClient.parsedTerms?.annualFee.toLocaleString() || '50,000'}/yr
                    </div>
                    <div>
                      <strong>Discount:</strong> {selectedClient.parsedTerms?.discountPct || 20}% (
                      <span style={{ color: 'var(--destructive, #ef4444)', fontWeight: 600 }}>
                        exp {selectedClient.parsedTerms?.discountExpiry || '2026-01-15'}
                      </span>
                      )
                    </div>
                    <div>
                      <strong>Seats:</strong> {selectedClient.parsedTerms?.seatsIncluded || 100} base seats
                    </div>
                    <div>
                      <strong>Modules:</strong> {selectedClient.parsedTerms?.modules.join(', ') || 'Basic, Analytics'}
                    </div>
                    <div>
                      <strong>Overage:</strong> ${selectedClient.parsedTerms?.overageSeatPrice || 50}/seat/month
                    </div>
                  </div>
                </div>

                {/* Panel 2: Billing Configuration */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius, 8px)',
                    background: 'var(--card, #ffffff)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    boxShadow: 'var(--shadow-2xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--destructive, #ef4444)' }}>
                      <Invoice01Icon size={14} />
                      <span>2. Billing Config (Drift)</span>
                    </div>
                    <button
                      onClick={() => onOpenIngestionModal('billing')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--primary, #6366f1)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Upload01Icon size={12} />
                      <span>CSV</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--foreground, #1e293b)' }}>
                    <div>
                      <strong>Charged:</strong> ${selectedClient.billingData?.chargedAnnual.toLocaleString() || '42,000'}/yr
                    </div>
                    <div>
                      <strong>Active Discount:</strong>{' '}
                      <span style={{ color: 'var(--destructive, #ef4444)', fontWeight: 700 }}>
                        {selectedClient.billingData?.activeDiscountPct || 20}% STILL ACTIVE
                      </span>
                    </div>
                    <div>
                      <strong>Billed Seats:</strong> {selectedClient.billingData?.billedSeats || 100} seats
                    </div>
                    <div>
                      <strong>Billed Modules:</strong>{' '}
                      <span style={{ color: 'var(--destructive, #ef4444)', fontWeight: 700 }}>
                        {selectedClient.billingData?.billedModules.join(', ') || 'Basic only (missing Analytics)'}
                      </span>
                    </div>
                    <div>
                      <strong>Last Synced:</strong> {selectedClient.billingData?.lastSynced || '2026-08-28'}
                    </div>
                  </div>
                </div>

                {/* Panel 3: Product Entitlements */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius, 8px)',
                    background: 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d1d5db)',
                    boxShadow: 'var(--shadow-2xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                      <CheckmarkCircle01Icon size={14} />
                      <span>3. Product Entitlements</span>
                    </div>
                    <button
                      onClick={() => onOpenIngestionModal('entitlements')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--primary, #6366f1)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Upload01Icon size={12} />
                      <span>CSV</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--foreground, #1e293b)' }}>
                    <div>
                      <strong>Granted Seats:</strong> {selectedClient.entitlementsData?.grantedSeats || 100}
                    </div>
                    <div>
                      <strong>Granted Modules:</strong>{' '}
                      {selectedClient.entitlementsData?.grantedModules.join(' + ') || 'Basic + Analytics'}
                    </div>
                    <div>
                      <strong>Granted Date:</strong> {selectedClient.entitlementsData?.grantedAt || '2025-10-01'}
                    </div>
                    <div style={{ color: '#10b981', marginTop: 4, fontWeight: 500 }}>
                      Access provisioned properly
                    </div>
                  </div>
                </div>

                {/* Panel 4: Live Telemetry */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius, 8px)',
                    background: 'var(--card, #ffffff)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    boxShadow: 'var(--shadow-2xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--destructive, #ef4444)' }}>
                      <UserGroupIcon size={14} />
                      <span>4. Live Usage Telemetry</span>
                    </div>
                    <button
                      onClick={() => onOpenIngestionModal('usage')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--primary, #6366f1)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Upload01Icon size={12} />
                      <span>CSV</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--foreground, #1e293b)' }}>
                    <div>
                      <strong>Active Daily Seats:</strong>{' '}
                      <span style={{ color: 'var(--destructive, #ef4444)', fontWeight: 700 }}>
                        {selectedClient.usageData?.activeDailySeats || 150} (
                        {Number(selectedClient.usageData?.activeDailySeats || 150) -
                          (selectedClient.parsedTerms?.seatsIncluded || 100)}{' '}
                        Overage)
                      </span>
                    </div>
                    <div>
                      <strong>Features Used:</strong>{' '}
                      {selectedClient.usageData?.featuresUsed.join(' + ') || 'Basic + Analytics'}
                    </div>
                    <div>
                      <strong>Audited Period:</strong> {selectedClient.usageData?.period || '2026-08'}
                    </div>
                    <div style={{ color: 'var(--destructive, #ef4444)', fontWeight: 600 }}>
                      Unbilled: 50 seats × $50/mo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Leakage Flags Table (Ranked by Dollar Impact) */}
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
                color: 'var(--foreground, #1e293b)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Active Revenue Leakage Flags (Synthesized via Dual-Stage Pipeline)</span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)' }}>
                Ranked by Dollar Impact
              </span>
            </div>

            {selectedClient.flags.length > 0 ? (
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
                        Flag Issue & Vector
                      </th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                        Monthly Leak
                      </th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                        Compounding
                      </th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                        Cumulative Loss
                      </th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>
                        Confidence
                      </th>
                      <th
                        style={{
                          padding: '12px 16px',
                          fontWeight: 600,
                          color: 'var(--muted-foreground, #6b7280)',
                          textAlign: 'center',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClient.flags.map((flag) => (
                      <tr key={flag.id} style={{ borderBottom: '1px solid var(--border, #d1d5db)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>
                          {flag.title}
                          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', fontWeight: 400 }}>
                            Type: {flag.type.replace('_', ' ').toUpperCase()}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: 'var(--destructive, #ef4444)',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          ${flag.monthlyImpact.toFixed(2)}/mo
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--muted-foreground, #6b7280)' }}>
                          {flag.monthsCompounding} months
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: 'var(--destructive, #ef4444)',
                            fontWeight: 700,
                            fontSize: 14,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          ${flag.cumulativeImpact.toFixed(2)}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 600,
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: '#10b981',
                            }}
                          >
                            {flag.agenticReasoning?.confidenceScore ?? 95}% Match
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              onClick={() => setSelectedCoTFlag(flag)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: 'var(--radius, 6px)',
                                border: '1px solid var(--border, #d1d5db)',
                                background: 'var(--card, #ffffff)',
                                color: 'var(--primary, #6366f1)',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Brain02Icon size={13} />
                              <span>CoT</span>
                            </button>

                            <button
                              onClick={() => onOpenDraftNotice(flag)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius, 6px)',
                                border: 'none',
                                background: 'var(--primary, #6366f1)',
                                color: '#ffffff',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <MailSend01Icon size={13} />
                              <span>Draft Notice</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  padding: 28,
                  borderRadius: 'var(--radius, 8px)',
                  background: 'var(--card, #ffffff)',
                  border: '1px solid var(--border, #d1d5db)',
                  textAlign: 'center',
                  color: 'var(--muted-foreground, #6b7280)',
                }}
              >
                <CheckmarkBadge01Icon size={28} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground, #1e293b)' }}>
                  No Discrepancies Detected
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  All contracts, billing rates, entitlements, and telemetry match perfectly.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB VIEW 2: HISTORICAL TIMELINE & ARR SIMULATOR */}
      {clientWorkspaceView === 'timeline' && (
        <div>
          <HistoricalLeakTimeline clientName={selectedClient.name} />

          <ARRForecastSimulator
            clientName={selectedClient.name}
            currentCumulativeLoss={cumulativeRecoverable}
            monthlyLeakVelocity={monthlyLeakVelocity}
          />
        </div>
      )}

      {/* Chain-of-Thought (CoT) Modal Inspector */}
      {selectedCoTFlag && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: 680,
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              borderRadius: 'var(--radius, 12px)',
              padding: 28,
              boxShadow: 'var(--shadow-2xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--primary, #6366f1)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Dual-Stage Reasoning Breakdown
                </div>
                <h2 style={{ margin: '4px 0 0 0', fontSize: 18, color: 'var(--foreground, #1e293b)' }}>
                  {selectedCoTFlag.title}
                </h2>
                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 4 }}>
                  {selectedCoTFlag.agenticReasoning?.confidenceScore}% Confidence · Multi-Source Verified
                </div>
              </div>
              <button
                onClick={() => setSelectedCoTFlag(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer', padding: 4 }}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius, 6px)',
                  background: 'var(--accent, #e0e7ff)',
                  border: '1px solid var(--primary, #6366f1)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--primary, #6366f1)',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                  }}
                >
                  <FlashIcon size={14} />
                  <span>Stage 1 Ground-Truth Input to AI Reasoner</span>
                </div>
                <div style={{ color: 'var(--foreground, #1e293b)', fontSize: 12, lineHeight: 1.5 }}>
                  <strong>Rule Identifier:</strong> <code>{selectedCoTFlag.agenticReasoning?.stage1RuleInput.ruleId}</code>
                  <br />
                  <strong>Deterministic Finding:</strong> {selectedCoTFlag.agenticReasoning?.stage1RuleInput.detectedDelta}
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 'var(--radius, 8px)',
                  background: 'var(--muted, #f3f4f6)',
                  border: '1px solid var(--border, #d1d5db)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--foreground, #1e293b)',
                    marginBottom: 10,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Brain02Icon size={15} color="var(--primary, #6366f1)" />
                  <span>Stage 2 Multi-Wave Agentic Reasoning Trace</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedCoTFlag.agenticReasoning?.chainOfThought.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, lineHeight: 1.5, color: 'var(--foreground, #1e293b)' }}>
                      <span style={{ color: 'var(--primary, #6366f1)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        0{idx + 1}
                      </span>
                      <div>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius, 6px)',
                  background: 'var(--card, #ffffff)',
                  border: '1px solid var(--border, #d1d5db)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--primary, #6366f1)',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <File01Icon size={14} />
                  <span>Semantic Contract Interpretation</span>
                </div>
                <div style={{ color: 'var(--foreground, #1e293b)', lineHeight: 1.5 }}>
                  {selectedCoTFlag.agenticReasoning?.contractAnalysis}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius, 6px)',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#f59e0b',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Alert02Icon size={14} />
                  <span>Root Cause Drift Diagnosis</span>
                </div>
                <div style={{ color: 'var(--foreground, #1e293b)', lineHeight: 1.5 }}>
                  {selectedCoTFlag.agenticReasoning?.driftDiagnosis}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius, 6px)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#10b981',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <CheckmarkCircle01Icon size={14} />
                  <span>Actionable Resolution</span>
                </div>
                <div style={{ color: 'var(--foreground, #1e293b)', fontWeight: 600, lineHeight: 1.5 }}>
                  {selectedCoTFlag.agenticReasoning?.recommendedAction}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 10 }}>
              <button
                onClick={() => {
                  const flagToDraft = selectedCoTFlag;
                  setSelectedCoTFlag(null);
                  onOpenDraftNotice(flagToDraft);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius, 6px)',
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--muted, #f3f4f6)',
                  color: 'var(--foreground, #1e293b)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Draft Resolution Notice
              </button>
              <button
                onClick={() => setSelectedCoTFlag(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius, 6px)',
                  border: 'none',
                  background: 'var(--primary, #6366f1)',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
