// =============================================================================
// bklit/RingChart.tsx — Bklit UI Half-Ring & Concentric Radial Gauge Component
// Features: Arc sweep draw animation, rounded stroke caps, interactive glowing
// highlights, centered SLA/percentage indicators, and interactive legend.
// =============================================================================

import React, { useState, useEffect } from 'react';

export interface RingDataItem {
  label: string;
  value: number; // percentage (0-100) or count
  color: string;
  formatted?: string;
  subtext?: string;
}

export interface RingChartProps {
  data: RingDataItem[];
  size?: number;
  startAngle?: number; // e.g. -Math.PI for half-ring
  endAngle?: number;   // e.g. 0 for half-ring
  centerValue?: string;
  centerLabel?: string;
  showLegend?: boolean;
}

export const RingChart: React.FC<RingChartProps> = ({
  data,
  size = 210,
  startAngle = -Math.PI,
  endAngle = 0,
  centerValue,
  centerLabel,
  showLegend = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  const isHalfRing = Math.abs(endAngle - startAngle - Math.PI) < 0.05;
  const viewBoxWidth = size;
  const viewBoxHeight = isHalfRing ? size * 0.58 : size;
  const cx = size / 2;
  const cy = isHalfRing ? size * 0.52 : size / 2;

  const strokeWidth = 10;
  const ringSpacing = 14;
  const maxRadius = size / 2 - 16;

  const activeItem = hoveredIdx !== null ? data[hoveredIdx] : data[0];

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: size, height: viewBoxHeight }}>
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {data.map((item, i) => (
              <linearGradient
                key={`bklit-ring-grad-${i}`}
                id={`bklit-ring-grad-${i}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={item.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={item.color} stopOpacity={1} />
              </linearGradient>
            ))}

            <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {data.map((item, index) => {
            const r = maxRadius - index * ringSpacing;
            if (r <= 0) return null;

            const isHovered = hoveredIdx === index;
            const isDimmed = hoveredIdx !== null && !isHovered;
            const fraction = Math.min(1, Math.max(0, item.value / 100));

            if (isHalfRing) {
              const arcLength = Math.PI * r;
              const fillLength = isMounted ? arcLength * fraction : 0;
              const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

              return (
                <g
                  key={item.label}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isDimmed ? 0.35 : 1,
                  }}
                  onMouseEnter={() => setHoveredIdx(index)}
                >
                  {/* Background Track */}
                  <path
                    d={bgPath}
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.14)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />
                  {/* Animated Value Arc */}
                  <path
                    d={bgPath}
                    fill="none"
                    stroke={`url(#bklit-ring-grad-${index})`}
                    strokeWidth={isHovered ? strokeWidth + 2.5 : strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${fillLength} ${arcLength}`}
                    style={{
                      transition:
                        'stroke-dasharray 1.1s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.2s ease, filter 0.2s ease',
                      filter: isHovered ? `drop-shadow(0 0 8px ${item.color}99)` : 'none',
                    }}
                  />
                </g>
              );
            }

            // Full circle
            const circumference = 2 * Math.PI * r;
            const fillLength = isMounted ? circumference * fraction : 0;

            return (
              <g
                key={item.label}
                style={{
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={() => setHoveredIdx(index)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.14)"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={`url(#bklit-ring-grad-${index})`}
                  strokeWidth={isHovered ? strokeWidth + 2.5 : strokeWidth}
                  strokeDasharray={`${fillLength} ${circumference}`}
                  strokeDashoffset={circumference * 0.25}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dasharray 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: isHovered ? `drop-shadow(0 0 8px ${item.color}99)` : 'none',
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Centered Indicator Value */}
        {isHalfRing && (
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: activeItem ? activeItem.color : '#10b981',
                fontFamily: 'var(--font-mono, monospace)',
                lineHeight: 1,
                transition: 'color 0.2s ease',
              }}
            >
              {centerValue || (activeItem ? `${activeItem.value}%` : '50%')}
            </div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: 'var(--muted-foreground, #64748b)',
                marginTop: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {centerLabel || (activeItem ? activeItem.label : 'SLA Status')}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Legend Below Rings */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            marginTop: 8,
            width: '100%',
          }}
        >
          {data.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isDimmed = hoveredIdx !== null && !isHovered;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: isHovered ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  border: isHovered ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.4 : 1,
                  transition: 'all 0.18s ease',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: isHovered ? `0 0 6px ${item.color}` : 'none',
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--foreground, #1e293b)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: item.color }}>
                  {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Ring: React.FC<{ index: number }> = () => null;
