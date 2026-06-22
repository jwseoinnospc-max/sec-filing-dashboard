'use client';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import type { FinancialPoint } from '@/lib/sec';

export function RevenueChart({ data }: { data: FinancialPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}M`} />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Revenue" strokeWidth={3} />
        <Line type="monotone" dataKey="netIncome" name="Net Income" strokeWidth={3} />
        <Line type="monotone" dataKey="operatingCashFlow" name="Operating CF" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BalanceChart({ data }: { data: FinancialPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}M`} />
        <Legend />
        <Bar
  dataKey="assets"
  name="Assets"
  fill="#3B82F6"
/>

<Bar
  dataKey="equity"
  name="Equity"
  fill="#22C55E"
/>

<Bar
  dataKey="liabilities"
  name="Liabilities"
  fill="#EF4444"
/>
      </BarChart>
    </ResponsiveContainer>
  );
}
