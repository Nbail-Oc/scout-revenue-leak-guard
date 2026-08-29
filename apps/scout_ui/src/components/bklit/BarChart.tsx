// =============================================================================
// bklit/BarChart.tsx — Bklit UI Rounded Animated Bar Spectrum Component
// Features: Staggered upward grow animation, rounded capsule caps,
// interactive hover columns, glowing accents, and glassmorphic tooltips.
// =============================================================================

import React, { useState } from 'react';

export interface BklitBarChartProps {
  data: Array<Record<string, any>>;
  xDataKey?: string;
  yDataKey?: string;
  height?: number;
  barColor?: string;
  activeColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  valueFormatter?: (val: number) => string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showTooltips?: boolean;
}

export const BarChart: React.FC<BklitBarChartProps> = ({
  data,
  xDataKey = 'month',
  yDataKey = 'velocity',
  height = 165,
  barColor = 'var(--primary, #6366f1)',
  activeColor = 'var(--destructive, #ef4444)',
  valuePrefix = '$',
  valueSuffix = '',
  valueFormatter,
  showGrid = true,
  showXAxis = true,
  showTooltips = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground, #6b7280)', fontSize: 12 }}>
        No bar chart data available
      </div>
    );
  }

  const values = data.map((d) => Number(d[yDataKey] ?? d.value ?? d.desktop ?? 0));
  const maxValue = Math.max(...values, 1000);
  const chartHeight = height - (showXAxis ? 30 : 10);

  const formatValue = (val: number) => {
    if (valueFormatter) return valueFormatter(val);
    return `${valuePrefix}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${valueSuffix}`;
  };

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Background Horizontal Dashed Grid */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 0,
            right: 0,
            height: chartHeight,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '100%',
                borderBottom: '1px dashed rgba(148, 163, 184, 0.16)',
              }}
            />
          ))}
        </div>
      )}

      {/* Main Bars Column Container */}
      <div
        style={{
          height: chartHeight,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 8px',
          zIndex: 1,
          position: 'relative',
        }}
      >
        {data.map((d, idx) => {
          const val = Number(d[yDataKey] ?? d.value ?? d.desktop ?? 0);
          const barHeightPercent = Math.max(6, Math.min(100, (val / maxValue) * 100));
          const isHovered = hoveredIdx === idx;
          const isPeak = val === Math.max(...values);

          const currentColor = isHovered ? activeColor : isPeak ? 'var(--primary, #6366f1)' : 'var(--chart-1, #818cf8)';

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flex: 1,
                maxWidth: 48,
                margin: '0 3px',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Highlight Column on Hover */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: -2,
                    right: -2,
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: 6,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Animated Rounded Capsule Bar */}
              <div
                className="bklit-bar-grow"
                style={{
                  width: '100%',
                  height: `${barHeightPercent}%`,
                  borderRadius: '6px 6px 2px 2px',
                  background: isHovered
                    ? `linear-gradient(180deg, ${activeColor} 0%, rgba(239, 68, 68, 0.75) 100%)`
                    : `linear-gradient(180deg, ${currentColor} 0%, rgba(99, 102, 241, 0.45) 100%)`,
                  boxShadow: isHovered
                    ? `0 0 12px ${activeColor}66`
                    : isPeak
                    ? '0 0 8px rgba(99, 102, 241, 0.3)'
                    : 'none',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  animationDelay: `${idx * 50}ms`,
                  position: 'relative',
                }}
              >
                {/* Top Glowing Edge Highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: '#ffffff',
                    borderRadius: '6px 6px 0 0',
                    opacity: isHovered ? 0.9 : 0.4,
                  }}
                />
              </div>

              {/* Tooltip on Hover */}
              {showTooltips && isHovered && (
                <div
                  className="bklit-tooltip-glass"
                  style={{
                    position: 'absolute',
                    bottom: `calc(${barHeightPercent}% + 8px)`,
                    padding: '6px 10px',
                    whiteSpace: 'nowrap',
                    fontSize: 11,
                    textAlign: 'center',
                    transform: 'translateX(-50%)',
                    left: '50%',
                  }}
                >
                  <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {d[xDataKey] || `Item ${idx + 1}`}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#ffffff', marginTop: 1 }}>
                    {formatValue(val)}
                  </div>
                  {d.subtext && (
                    <div style={{ fontSize: 9.5, color: '#f87171', marginTop: 2 }}>
                      {d.subtext}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* XAxis Labels */}
      {showXAxis && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 8px 0 8px',
            borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          }}
        >
          {data.map((d, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 10.5,
                  fontWeight: isHovered ? 700 : 500,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: isHovered ? 'var(--foreground, #1e293b)' : 'var(--muted-foreground, #94a3b8)',
                  transition: 'color 0.15s ease',
                }}
              >
                {d[xDataKey] || `M${idx + 1}`}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
