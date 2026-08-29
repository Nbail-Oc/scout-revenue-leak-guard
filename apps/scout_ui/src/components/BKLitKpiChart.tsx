// =============================================================================
// BKLitKpiChart.tsx — Simple Chart Visualizations using Recharts
// =============================================================================

import React from 'react';
import { SimpleAreaChart } from './simple-charts/SimpleAreaChart';
import { SimpleBarChart } from './simple-charts/SimpleBarChart';
import { SimpleRadialChart } from './simple-charts/SimpleRadialChart';

// Re-export for backward compatibility
export { SimpleRadialChart as ConcentricRingGauge } from './simple-charts/SimpleRadialChart';

export type BKLitChartType =
  | 'cumulative_arr_area'
  | 'monthly_velocity_bars'
  | 'health_rate_radial'
  | 'portfolio_client_comparison'
  | 'root_cause_breakdown';

export interface RingDataItem {
  label: string;
  value: number;
  color: string;
}

interface BKLitKpiChartProps {
  type: BKLitChartType;
  height?: number;
  data?: any[];
  centerValue?: string;
  centerLabel?: string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

// 30-Day Dual-Layer ARR Curve Data
const defaultArrTrajectoryData = [
  { date: 'Aug 1', expected: 82000, invoiced: 82000 },
  { date: 'Aug 5', expected: 82000, invoiced: 80500 },
  { date: 'Aug 9', expected: 83500, invoiced: 80500 },
  { date: 'Aug 13', expected: 86000, invoiced: 80500 },
  { date: 'Aug 17', expected: 89500, invoiced: 80500 },
  { date: 'Aug 21', expected: 94000, invoiced: 80500 },
  { date: 'Aug 25', expected: 98500, invoiced: 80500 },
  { date: 'Aug 29', expected: 102166.66, invoiced: 80500 },
];

// 6-Month Compounding Leak Velocity Data
const defaultMonthlyVelocityData = [
  { month: 'Mar', velocity: 2100 },
  { month: 'Apr', velocity: 2900 },
  { month: 'May', velocity: 3400 },
  { month: 'Jun', velocity: 3800 },
  { month: 'Jul', velocity: 4166.66 },
  { month: 'Aug', velocity: 4166.66 },
];

// Half-Ring Chart Data
const defaultRingData: RingDataItem[] = [
  { label: 'Reconciled', value: 50, color: '#10b981' },
  { label: 'Discount Drift', value: 27, color: '#ef4444' },
  { label: 'Unbilled Overage', value: 23, color: '#f59e0b' },
];

export const BKLitKpiChart: React.FC<BKLitKpiChartProps> = ({
  type,
  height = 180,
  data,
  centerValue,
  centerLabel,
}) => {
  // 1. Dual-Layer Area Chart
  if (type === 'cumulative_arr_area') {
    const chartData = data || defaultArrTrajectoryData;
    return (
      <div style={{ width: '100%', minHeight: height, marginTop: 4 }}>
        <SimpleAreaChart
          data={chartData}
          xDataKey="date"
          areaKeys={[
            { key: 'expected', color: '#ef4444', fillOpacity: 0.3 },
            { key: 'invoiced', color: '#6366f1', fillOpacity: 0.2 },
          ]}
          height={height}
        />
      </div>
    );
  }

  // 2. Bar Chart - Monthly Velocity
  if (type === 'monthly_velocity_bars') {
    const chartData = data || defaultMonthlyVelocityData;
    return (
      <div style={{ width: '100%', minHeight: height, marginTop: 4 }}>
        <SimpleBarChart
          data={chartData}
          xDataKey="month"
          barKey="velocity"
          barColor="#6366f1"
          height={height}
        />
      </div>
    );
  }

  // 3. Half-Ring Radial Chart
  if (type === 'health_rate_radial') {
    return (
      <div
        style={{
          width: '100%',
          height,
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SimpleRadialChart
          data={data || defaultRingData}
          centerValue={centerValue || '50%'}
          centerLabel={centerLabel || 'Leak-Free SLA'}
          size={Math.min(230, height + 50)}
        />
      </div>
    );
  }

  // 4. Portfolio Client Comparison
  if (type === 'portfolio_client_comparison') {
    const clientData = data || [
      { client: 'Yojit FZE', leakage: 21666.66 },
      { client: 'Zenith Labs', leakage: 17000 },
      { client: 'Nexis Systems', leakage: 15000 },
      { client: 'Acme Cloud', leakage: 4200 },
    ];

    return (
      <div style={{ width: '100%', minHeight: height, marginTop: 4 }}>
        <SimpleBarChart
          data={clientData}
          xDataKey="client"
          barKey="leakage"
          barColor="#ef4444"
          height={height}
        />
      </div>
    );
  }

  // 5. Root Cause Breakdown
  if (type === 'root_cause_breakdown') {
    const breakdownData = data || [
      { category: 'Discount Drift', amount: 5833.33 },
      { category: 'Unbilled Overage', amount: 7500.0 },
      { category: 'Add-on Features', amount: 8333.33 },
    ];

    return (
      <div style={{ width: '100%', minHeight: height, marginTop: 4 }}>
        <SimpleBarChart
          data={breakdownData}
          xDataKey="category"
          barKey="amount"
          barColor="#f59e0b"
          height={height}
        />
      </div>
    );
  }

  return null;
};
