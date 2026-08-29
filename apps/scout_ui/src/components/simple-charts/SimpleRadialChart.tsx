// Simple Radial/Ring Chart - Basic SVG implementation
import React, { useState } from 'react';

export interface RingDataItem {
  label: string;
  value: number;
  color: string;
}

interface SimpleRadialChartProps {
  data: RingDataItem[];
  centerValue?: string;
  centerLabel?: string;
  size?: number;
}

export const SimpleRadialChart: React.FC<SimpleRadialChartProps> = ({
  data,
  centerValue = '50%',
  centerLabel = 'Overall',
  size = 180,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((acc, d) => acc + d.value, 0);

  // Half-ring geometry
  const radius = 70;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div style={{ position: 'relative', width: size, height: size * 0.58, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <svg viewBox="0 0 180 105" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Background Track */}
          <path
            d="M 15 95 A 70 70 0 0 1 165 95"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Data Slices */}
          {data.map((item, idx) => {
            const fraction = item.value / total;
            const dashLength = fraction * circumference;
            const dashOffset = -(cumulativePercent * circumference);
            cumulativePercent += fraction;

            const isHovered = hoveredIndex === idx;

            return (
              <path
                key={idx}
                d="M 15 95 A 70 70 0 0 1 165 95"
                fill="none"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap={idx === 0 || idx === data.length - 1 ? 'round' : 'butt'}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  filter: isHovered ? `drop-shadow(0 0 6px ${item.color})` : 'none',
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Value */}
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {hoveredIndex !== null ? `${data[hoveredIndex].value}%` : centerValue}
          </div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#64748b', marginTop: '0.2rem' }}>
            {hoveredIndex !== null ? data[hoveredIndex].label : centerLabel}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.6875rem',
              color: hoveredIndex === idx ? '#0f172a' : '#64748b',
              fontWeight: hoveredIndex === idx ? 700 : 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                backgroundColor: item.color,
              }}
            />
            <span>{item.label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', color: '#94a3b8' }}>({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
