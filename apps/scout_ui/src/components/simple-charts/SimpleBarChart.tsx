// Simple Bar Chart using Recharts - No complexity, just works
import React from 'react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SimpleBarChartProps {
  data: Array<Record<string, any>>;
  xDataKey: string;
  barKey: string;
  barColor: string;
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  xDataKey,
  barKey,
  barColor,
  height = 180,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
        />
        <Bar dataKey={barKey} radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColor} />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
};
