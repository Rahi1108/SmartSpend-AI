import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useGoals } from '../hooks/useGoals';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { getCategoryColor } from '../utils/categoryUtils';
import { getDateRange, getMonthName } from '../utils/dateUtils';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { goals } = useGoals();

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = getDateRange(selectedPeriod, selectedYear);

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  }, [transactions, selectedPeriod, selectedYear]);

  // Calculate financial metrics
  const metrics = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpenses;

    // Category breakdown
    const categoryExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category_name] = (acc[t.category_name] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Monthly trend (12 months of selected year)
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(selectedYear, i, 1);
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === i && tDate.getFullYear() === selectedYear;
      });

      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        period: getMonthName(i),
        income: monthIncome,
        expenses: monthExpenses,
        net: monthIncome - monthExpenses,
      });
    }

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      categoryExpenses,
      monthlyData,
    };
  }, [filteredTransactions, transactions]);

  // Budget vs actual comparison
  const budgetComparison = useMemo(() => {
    return budgets.map(budget => {
      const actualSpent = filteredTransactions
        .filter(t => t.type === 'expense' && t.category_name === budget.category_name)
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0;
      const remaining = budget.amount - actualSpent;

      return {
        ...budget,
        actualSpent,
        percentage,
        remaining,
        isOverBudget: actualSpent > budget.amount,
      };
    });
  }, [budgets, filteredTransactions]);

  // Goal progress
  const goalProgress = useMemo(() => {
    return goals.map(goal => {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      return {
        ...goal,
        progress,
        isCompleted: goal.current_amount >= goal.target_amount,
      };
    });
  }, [goals]);

  const periodOptions: { value: ReportPeriod; label: string }[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
          <p className="text-text-secondary mt-1">Analyze your financial performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
            className="px-3 py-2 bg-surface-secondary border border-border rounded-lg text-text-primary"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-surface-secondary border border-border rounded-lg text-text-primary"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-success" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Total Income</h3>
              <p className="text-2xl font-bold text-success">{formatCurrency(metrics.totalIncome)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-error" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Total Expenses</h3>
              <p className="text-2xl font-bold text-error">{formatCurrency(metrics.totalExpenses)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3">
            <DollarSign className={`w-6 h-6 ${metrics.netIncome >= 0 ? 'text-success' : 'text-error'}`} />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Net Income</h3>
              <p className={`text-2xl font-bold ${metrics.netIncome >= 0 ? 'text-success' : 'text-error'}`}>
                {formatCurrency(metrics.netIncome)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-text-primary mb-4">Monthly Trend</h3>
          <SpendingChart data={metrics.monthlyData} />
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-text-primary mb-4">Spending by Category</h3>
          <CategoryBreakdown data={Object.entries(metrics.categoryExpenses).map(([category, amount]) => ({
            category,
            amount: amount as number,
            color: getCategoryColor(category),
          }))} />
        </motion.div>
      </div>

      {/* Budget vs Actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-text-primary mb-4">Budget vs Actual</h3>
        <div className="space-y-4">
          {budgetComparison.map(budget => (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-text-primary">{budget.category_name}</span>
                <span className="text-sm text-text-secondary">
                  {formatCurrency(budget.actualSpent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <div className="w-full bg-surface-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    budget.isOverBudget ? 'bg-error' : 'bg-accent-teal'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className={budget.isOverBudget ? 'text-error' : 'text-text-secondary'}>
                  {formatPercentage(budget.percentage)}
                </span>
                <span className={`font-medium ${budget.remaining >= 0 ? 'text-success' : 'text-error'}`}>
                  {budget.remaining >= 0 ? 'Remaining' : 'Over'} {formatCurrency(Math.abs(budget.remaining))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-text-primary mb-4">Goal Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalProgress.map(goal => (
            <div key={goal.id} className="p-4 bg-surface-secondary rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-text-primary">{goal.name}</h4>
                <span className={`text-sm px-2 py-1 rounded ${
                  goal.isCompleted ? 'bg-success/20 text-success' : 'bg-accent-purple/20 text-accent-purple'
                }`}>
                  {goal.isCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <div className="text-sm text-text-secondary mb-2">
                {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
              </div>
              <div className="w-full bg-surface rounded-full h-2 mb-1">
                <div
                  className="h-2 bg-accent-purple rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                />
              </div>
              <div className="text-right text-sm text-text-secondary">
                {formatPercentage(goal.progress)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
