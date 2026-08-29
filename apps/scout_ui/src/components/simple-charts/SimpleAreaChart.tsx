// Simple Area Chart using Recharts - No complexity, just works
import React from 'react';
import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SimpleAreaChartProps {
  data: Array<Record<string, any>>;
  xDataKey: string;
  areaKeys: Array<{ key: string; color: string; fillOpacity?: number }>;
  height?: number;
}

export const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  xDataKey,
  areaKeys,
  height = 180,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          {areaKeys.map((area) => (
            <linearGradient key={area.key} id={`gradient-${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" strokeOpacity={0.5} />
        <XAxis
          dataKey={xDataKey}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: 12,
          }}
          formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
        />
        {areaKeys.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            stroke={area.color}
            strokeWidth={2}
            fill={`url(#gradient-${area.key})`}
            fillOpacity={1}
          />
        ))}
      </RechartsArea>
    </ResponsiveContainer>
  );
};
