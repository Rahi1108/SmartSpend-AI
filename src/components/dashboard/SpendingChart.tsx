import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpendingChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 bg-background-secondary rounded-xl flex items-center justify-center text-text-secondary">
        No cashflow activity yet. Add transactions to view the chart.
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
          <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
          <Line type="monotone" dataKey="net" stroke="#3B82F6" name="Net" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
