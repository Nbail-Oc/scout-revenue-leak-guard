// =============================================================================
// bklit/MultiBarChart.tsx — Bklit UI Multi-Group & Comparative Bar Chart
// Features: Side-by-side comparative bars, staggered entrance animations,
// individual bar highlights, and rich multi-metric glassmorphic tooltips.
// =============================================================================

import React, { useState } from 'react';

export interface MultiBarSeriesConfig {
  key: string;
  label: string;
  color: string;
}

export interface BklitMultiBarChartProps {
  data: Array<Record<string, any>>;
  series: MultiBarSeriesConfig[];
  xKey?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  valueFormatter?: (val: number) => string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showLegend?: boolean;
}

export const MultiBarChart: React.FC<BklitMultiBarChartProps> = ({
  data,
  series,
  xKey = 'category',
  height = 180,
  valuePrefix = '$',
  valueSuffix = '',
  valueFormatter,
  showGrid = true,
  showXAxis = true,
  showLegend = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0 || !series || series.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground, #6b7280)', fontSize: 12 }}>
        No comparative data available
      </div>
    );
  }

  // Find max value across all data and series
  let allVals: number[] = [];
  data.forEach((d) => {
    series.forEach((s) => {
      allVals.push(Number(d[s.key] || 0));
    });
  });
  const maxVal = Math.max(...allVals, 1000);
  const chartHeight = height - (showXAxis ? 32 : 12);

  const formatValue = (val: number) => {
    if (valueFormatter) return valueFormatter(val);
    return `${valuePrefix}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${valueSuffix}`;
  };

  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null;

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
      {/* Background Dashed Grid */}
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

      {/* Main Groups Container */}
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
        {data.map((d, groupIdx) => {
          const isGroupHovered = hoveredIdx === groupIdx;

          return (
            <div
              key={groupIdx}
              onMouseEnter={() => setHoveredIdx(groupIdx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flex: 1,
                margin: '0 4px',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 4,
                position: 'relative',
                cursor: 'pointer',
                padding: '0 4px',
              }}
            >
              {/* Group Column Hover Highlight */}
              {isGroupHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(99, 102, 241, 0.06)',
                    borderRadius: 6,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Sub-Bars for each series */}
              {series.map((s, seriesIdx) => {
                const val = Number(d[s.key] || 0);
                const barHeightPercent = Math.max(4, Math.min(100, (val / maxVal) * 100));

                return (
                  <div
                    key={s.key}
                    className="bklit-bar-grow"
                    style={{
                      flex: 1,
                      maxWidth: 24,
                      height: `${barHeightPercent}%`,
                      borderRadius: '4px 4px 1px 1px',
                      background: `linear-gradient(180deg, ${s.color} 0%, ${s.color}99 100%)`,
                      boxShadow: isGroupHovered ? `0 0 8px ${s.color}88` : 'none',
                      animationDelay: `${groupIdx * 40 + seriesIdx * 25}ms`,
                      position: 'relative',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                );
              })}

              {/* Tooltip on Group Hover */}
              {isGroupHovered && hoveredData && (
                <div
                  className="bklit-tooltip-glass"
                  style={{
                    position: 'absolute',
                    bottom: '105%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '8px 12px',
                    minWidth: 160,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 4, marginBottom: 6 }}>
                    {hoveredData[xKey] || `Group ${groupIdx + 1}`}
                  </div>

                  {series.map((s) => {
                    const val = Number(hoveredData[s.key] || 0);
                    return (
                      <div
                        key={`tooltip-${s.key}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          fontSize: 11,
                          marginTop: 3,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255, 255, 255, 0.85)' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                          <span>{s.label}:</span>
                        </span>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#ffffff' }}>
                          {formatValue(val)}
                        </span>
                      </div>
                    );
                  })}
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
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 2px',
                }}
              >
                {d[xKey] || `G${idx + 1}`}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 8 }}>
          {series.map((s) => (
            <div key={`legend-${s.key}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
