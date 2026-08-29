// =============================================================================
// bklit/AreaChart.tsx — Bklit UI Dual & Multi-Layer Animated Area/Line Chart
// Features: Monotone Bézier interpolation, SVG stroke-reveal animation,
// layered gradient fills, interactive magnetic crosshair, active glowing points,
// and glassmorphic floating tooltips.
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';

export interface AreaSeriesConfig {
  key: string;
  label: string;
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  isDashed?: boolean;
}

export interface BklitAreaChartProps {
  data: Array<Record<string, any>>;
  series?: AreaSeriesConfig[];
  xKey?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  valueFormatter?: (val: number) => string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
}

export const AreaChart: React.FC<BklitAreaChartProps> = ({
  data,
  series,
  xKey = 'day',
  height = 165,
  valuePrefix = '$',
  valueSuffix = '',
  valueFormatter,
  showGrid = true,
  showXAxis = true,
  showLegend = true,
  emptyMessage = 'No chart data available',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [svgWidth, setSvgWidth] = useState<number>(420);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize observer to ensure responsive SVG width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50) {
          setSvgWidth(Math.floor(entry.contentRect.width));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground, #6b7280)', fontSize: 12 }}>
        {emptyMessage}
      </div>
    );
  }

  // Default series fallback if none specified
  const effectiveSeries: AreaSeriesConfig[] = series || [
    {
      key: 'expected' in data[0] ? 'expected' : 'revenue',
      label: 'Expected / Legal Contract',
      color: '#ef4444',
      fillOpacity: 0.28,
      strokeWidth: 2.5,
    },
    {
      key: 'invoiced' in data[0] ? 'invoiced' : 'costs',
      label: 'Billed / Invoiced Baseline',
      color: '#6366f1',
      fillOpacity: 0.14,
      strokeWidth: 2,
      isDashed: true,
    },
  ];

  const paddingLeft = 36;
  const paddingRight = 18;
  const paddingTop = 16;
  const paddingBottom = showXAxis ? 26 : 12;

  const innerWidth = Math.max(10, svgWidth - paddingLeft - paddingRight);
  const innerHeight = Math.max(10, height - paddingTop - paddingBottom);

  // Calculate global min/max across all configured series
  let allValues: number[] = [];
  data.forEach((d) => {
    effectiveSeries.forEach((s) => {
      if (d[s.key] !== undefined && d[s.key] !== null) {
        allValues.push(Number(d[s.key]));
      }
    });
  });

  if (allValues.length === 0) allValues = [0, 100];
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues) * 0.96;
  const valRange = maxVal - minVal || 1;

  const getY = (val: number) => {
    return paddingTop + innerHeight - ((val - minVal) / valRange) * innerHeight;
  };

  const getX = (idx: number) => {
    return paddingLeft + (idx / Math.max(1, data.length - 1)) * innerWidth;
  };

  // Generate Smooth Monotone Bézier Spline
  const generateSmoothPath = (key: string) => {
    const points = data.map((d, i) => ({
      x: getX(i),
      y: getY(Number(d[key] || 0)),
    }));

    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const formatValue = (val: number) => {
    if (valueFormatter) return valueFormatter(val);
    return `${valuePrefix}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${valueSuffix}`;
  };

  const handlePointerMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relX = clientX - rect.left - paddingLeft;
    const fraction = Math.max(0, Math.min(1, relX / innerWidth));
    const closestIdx = Math.round(fraction * (data.length - 1));
    setHoveredIdx(closestIdx);
  };

  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        position: 'relative',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '100%', height, position: 'relative' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {effectiveSeries.map((s, i) => (
              <linearGradient
                key={`bklit-area-grad-${i}`}
                id={`bklit-area-grad-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={s.fillOpacity || 0.3} />
                <stop offset="85%" stopColor={s.color} stopOpacity={0.03} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.0} />
              </linearGradient>
            ))}

            <filter id="bklit-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines & Y-Labels */}
          {showGrid &&
            [0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = paddingTop + innerHeight * ratio;
              const valueAtRatio = maxVal - ratio * valRange;
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="rgba(148, 163, 184, 0.16)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  <text
                    x={paddingLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="var(--muted-foreground, #94a3b8)"
                    fontSize="9.5"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {valueAtRatio >= 1000 ? `$${(valueAtRatio / 1000).toFixed(0)}k` : `$${valueAtRatio.toFixed(0)}`}
                  </text>
                </g>
              );
            })}

          {/* Render Area Fills */}
          {effectiveSeries.map((s, i) => {
            const linePath = generateSmoothPath(s.key);
            const areaPath = `${linePath} L ${getX(data.length - 1)} ${paddingTop + innerHeight} L ${getX(0)} ${paddingTop + innerHeight} Z`;
            return (
              <path
                key={`area-${s.key}`}
                d={areaPath}
                fill={`url(#bklit-area-grad-${i})`}
                className="bklit-fade-area"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* Render Spline Strokes */}
          {effectiveSeries.map((s, i) => {
            const linePath = generateSmoothPath(s.key);
            return (
              <path
                key={`line-${s.key}`}
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth={s.strokeWidth || 2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={s.isDashed ? '5 4' : undefined}
                className="bklit-draw-line"
                style={{
                  filter: `drop-shadow(0 2px 4px ${s.color}33)`,
                  pointerEvents: 'none',
                }}
              />
            );
          })}

          {/* Interactive Crosshair Tracking */}
          {hoveredIdx !== null && hoveredData && (
            <g style={{ pointerEvents: 'none' }}>
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoveredIdx)}
                y1={paddingTop}
                x2={getX(hoveredIdx)}
                y2={paddingTop + innerHeight}
                stroke="var(--foreground, #334155)"
                strokeWidth={1.2}
                strokeDasharray="2 2"
                opacity={0.65}
              />

              {/* Glowing active point markers for each series */}
              {effectiveSeries.map((s, i) => {
                const val = Number(hoveredData[s.key] || 0);
                const cy = getY(val);
                const cx = getX(hoveredIdx);

                return (
                  <g key={`marker-${s.key}`}>
                    {/* Outer glow ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={s.color}
                      opacity={0.25}
                      style={{ animation: 'bklitPulseCrosshair 1.5s infinite' }}
                    />
                    {/* Center point */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="#ffffff"
                      stroke={s.color}
                      strokeWidth={2.5}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* XAxis Labels */}
          {showXAxis && (
            <g>
              {data.map((d, idx) => {
                // Show every Nth label to prevent clutter on small screens
                const step = data.length > 8 ? Math.ceil(data.length / 5) : 1;
                if (idx % step !== 0 && idx !== data.length - 1) return null;

                const label = d[xKey] || `Day ${idx + 1}`;
                return (
                  <text
                    key={`x-${idx}`}
                    x={getX(idx)}
                    y={height - 6}
                    textAnchor="middle"
                    fill={hoveredIdx === idx ? 'var(--foreground, #1e293b)' : 'var(--muted-foreground, #94a3b8)'}
                    fontSize="10"
                    fontWeight={hoveredIdx === idx ? '700' : '500'}
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          )}
        </svg>

        {/* Floating Glassmorphic Tooltip */}
        {hoveredIdx !== null && hoveredData && (
          <div
            className="bklit-tooltip-glass"
            style={{
              position: 'absolute',
              top: 8,
              left: Math.min(
                Math.max(10, getX(hoveredIdx) - 80),
                svgWidth - 170
              ),
              padding: '8px 12px',
              minWidth: 155,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 4, marginBottom: 6 }}>
              {hoveredData[xKey] ? `Timeline Point: ${hoveredData[xKey]}` : `Day ${hoveredIdx + 1}`}
            </div>

            {effectiveSeries.map((s) => {
              const val = Number(hoveredData[s.key] || 0);
              return (
                <div
                  key={`tooltip-${s.key}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    marginTop: 3,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255, 255, 255, 0.85)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                    <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}:</span>
                  </span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#ffffff' }}>
                    {formatValue(val)}
                  </span>
                </div>
              );
            })}

            {/* If 2 series, show discrepancy gap */}
            {effectiveSeries.length >= 2 && hoveredData[effectiveSeries[0].key] !== undefined && hoveredData[effectiveSeries[1].key] !== undefined && (
              <div
                style={{
                  marginTop: 6,
                  paddingTop: 5,
                  borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: Number(hoveredData[effectiveSeries[0].key]) > Number(hoveredData[effectiveSeries[1].key]) ? '#ef4444' : '#10b981',
                }}
              >
                <span>Drift Delta:</span>
                <span>
                  {Number(hoveredData[effectiveSeries[0].key]) > Number(hoveredData[effectiveSeries[1].key]) ? '+' : ''}
                  {formatValue(Math.abs(Number(hoveredData[effectiveSeries[0].key]) - Number(hoveredData[effectiveSeries[1].key])))}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Legend */}
      {showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 6, paddingLeft: paddingLeft }}>
          {effectiveSeries.map((s) => (
            <div key={`legend-${s.key}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>
              <span style={{ width: 14, height: 3, borderRadius: 2, background: s.color, borderTop: s.isDashed ? '1px dashed #ffffff' : 'none' }} />
              <span style={{ fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
