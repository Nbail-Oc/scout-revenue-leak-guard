// =============================================================================
// ARRForecastSimulator.tsx — Dynamic Compounding ARR Loss & ROI Simulator
// Interactive slider projecting unmitigated financial risk at 3, 6, and 12 months
// =============================================================================

import React, { useState } from 'react';
import {
  FlashIcon,
  Alert02Icon,
  CheckmarkBadge01Icon,
  ArrowRight01Icon,
  Analytics01Icon,
  Clock01Icon,
} from 'hugeicons-react';

interface ARRForecastSimulatorProps {
  clientName: string;
  currentCumulativeLoss: number;
  monthlyLeakVelocity: number;
}

export const ARRForecastSimulator: React.FC<ARRForecastSimulatorProps> = ({
  clientName,
  currentCumulativeLoss,
  monthlyLeakVelocity,
}) => {
  const [forecastMonths, setForecastMonths] = useState<number>(6);

  const projectedAdditionalLoss = monthlyLeakVelocity * forecastMonths;
  const totalProjectedLoss = currentCumulativeLoss + projectedAdditionalLoss;
  const annualProtectionValue = currentCumulativeLoss + monthlyLeakVelocity * 12;

  // ROI multiplier based on typical enterprise tooling cost (~$2,000/yr)
  const estimatedToolCost = 2000;
  const roiMultiplier = (annualProtectionValue / estimatedToolCost).toFixed(1);

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
            Predictive ARR Loss Forecasting
          </div>
          <h3 style={{ margin: '2px 0 0 0', fontSize: 16, color: 'var(--foreground, #1e293b)' }}>
            Compounding Leakage Velocity & Remediation ROI Simulator
          </h3>
        </div>

        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary, #6366f1)', background: 'var(--accent, #e0e7ff)', padding: '4px 10px', borderRadius: 12 }}>
          {roiMultiplier}x Protected ARR Multiplier
        </span>
      </div>

      {/* Interactive Time Horizon Slider */}
      <div style={{ padding: 18, borderRadius: 8, background: 'var(--muted, #f3f4f6)', border: '1px solid var(--border, #d1d5db)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock01Icon size={15} color="var(--primary, #6366f1)" />
            <span>Unmitigated Forecast Horizon:</span>
            <span style={{ color: 'var(--primary, #6366f1)', fontFamily: 'var(--font-mono)' }}>+{forecastMonths} Months Ahead</span>
          </label>

          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 3, 6, 9, 12].map((m) => (
              <button
                key={m}
                onClick={() => setForecastMonths(m)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 4,
                  border: '1px solid var(--border, #d1d5db)',
                  background: forecastMonths === m ? 'var(--primary, #6366f1)' : 'var(--card, #ffffff)',
                  color: forecastMonths === m ? '#ffffff' : 'var(--foreground, #1e293b)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {m === 0 ? 'Today' : `+${m}m`}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="12"
          step="1"
          value={forecastMonths}
          onChange={(e) => setForecastMonths(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary, #6366f1)' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
          <span>Current (Today)</span>
          <span>+3 Months (Q+1)</span>
          <span>+6 Months (Mid-Year)</span>
          <span>+9 Months (Q+3)</span>
          <span>+12 Months (Year-End)</span>
        </div>
      </div>

      {/* Comparative Scenario Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Scenario 1: Unmitigated Leakage */}
        <div style={{ padding: 18, borderRadius: 8, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--destructive, #ef4444)', textTransform: 'uppercase' }}>
            Unmitigated Loss (Do Nothing)
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--destructive, #ef4444)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            ${totalProjectedLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, lineHeight: 1.4 }}>
            Loss accumulates at <strong>${monthlyLeakVelocity.toFixed(2)}/mo</strong> across {forecastMonths} unaddressed months.
          </div>
        </div>

        {/* Scenario 2: Immediate Scout True-Up Recovery */}
        <div style={{ padding: 18, borderRadius: 8, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
            Recovered via Scout Guard
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            ${currentCumulativeLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, lineHeight: 1.4 }}>
            Immediate recovery invoice issued + recurring billing corrected to full contractual rate.
          </div>
        </div>

        {/* Scenario 3: 12-Month Net ARR Protected */}
        <div style={{ padding: 18, borderRadius: 8, background: 'var(--card, #ffffff)', border: '1px solid var(--border, #d1d5db)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase' }}>
            12-Month Net Protected ARR
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary, #6366f1)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            ${annualProtectionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 4, lineHeight: 1.4 }}>
            Total revenue protected across past 12 months of retroactive recovery + next 12 months run-rate.
          </div>
        </div>
      </div>
    </div>
  );
};
