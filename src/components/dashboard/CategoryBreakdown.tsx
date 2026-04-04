import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface CategoryBreakdownProps {
  data: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 bg-background-secondary rounded-xl flex items-center justify-center text-text-secondary">
        No category data yet. Add transactions to see spending breakdown.
      </div>
    );
  }

  // Calculate totals and percentages
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(1),
  }));

  // Sort by amount descending to show top categories
  const topCategories = [...dataWithPercentage].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const otherTotal = data.slice(5).reduce((sum, item) => sum + item.amount, 0);

  const customLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          fill="currentColor"
          textAnchor="middle"
          className="font-bold text-text-primary"
          fontSize={18}
        >
          ₹{(total / 1000).toFixed(1)}K
        </text>
        <text
          x={cx}
          y={cy + 15}
          fill="currentColor"
          textAnchor="middle"
          className="text-text-secondary"
          fontSize={12}
        >
          Total Spent
        </text>
      </g>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Chart Section */}
      <div className="bg-background-secondary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Spending by Category</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-purple">₹{total.toLocaleString('en-IN')}</p>
            <p className="text-xs text-text-secondary">Total Expenses</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Pie Chart */}
          <div className="flex-1 h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercentage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={false}
                >
                  {dataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  labelFormatter={(label: string) => label}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute text-center pointer-events-none">
              <p className="text-2xl font-bold text-accent-purple">₹{(total / 1000).toFixed(1)}K</p>
              <p className="text-xs text-text-secondary">Total</p>
            </div>
          </div>

          {/* Legend & Details */}
          <div className="flex-1 space-y-3">
            <h4 className="text-sm font-semibold text-text-primary mb-4">Breakdown</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {topCategories.map((item, idx) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-glass rounded-lg p-3 hover:bg-glass-hover transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {item.category}
                        </p>
                        <div className="w-full bg-background-secondary rounded-full h-1.5 mt-1">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-sm font-semibold text-text-primary text-nowrap">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-text-secondary">{item.percentage}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {otherTotal > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-glass rounded-lg p-3 text-xs text-text-secondary border border-glass-border"
                >
                  <p>+ {data.length - 5} more categories</p>
                  <p className="font-semibold text-text-primary">₹{otherTotal.toLocaleString('en-IN')}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-1">Top Spending</p>
              <p className="text-lg font-bold text-text-primary">{topCategories[0]?.category || 'N/A'}</p>
              <p className="text-sm text-accent-purple font-semibold mt-1">
                ₹{topCategories[0]?.amount?.toLocaleString('en-IN') || 0}
              </p>
            </div>
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <ArrowTrendingUpIcon className="w-5 h-5 text-accent-purple" />
            </div>
          </div>
        </motion.div>

        {/* Average per Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-accent-green/10 to-accent-cyan/10 border border-accent-green/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-1">Average</p>
              <p className="text-lg font-bold text-text-primary">
                ₹{(total / data.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-text-secondary mt-1">per category</p>
            </div>
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <svg
                className="w-5 h-5 text-accent-green"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Categories Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-accent-orange/10 to-accent-pink/10 border border-accent-orange/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-1">Categories</p>
              <p className="text-lg font-bold text-text-primary">{data.length}</p>
              <p className="text-sm text-text-secondary mt-1">active categories</p>
            </div>
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <svg
                className="w-5 h-5 text-accent-orange"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
