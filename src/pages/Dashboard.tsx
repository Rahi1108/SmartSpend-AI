import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useTransactions } from '../hooks/useTransactions';
import { useInsights, usePredictions } from '../hooks/useAI';
import { useBudgets } from '../hooks/useBudgets';
import { useGoals } from '../hooks/useGoals';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { UnifiedSmartInput } from '../components/common/UnifiedSmartInput';
import { AIInsightsPanel } from '../components/dashboard/AIInsightsPanel';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { BalanceCard } from '../components/dashboard/BalanceCard';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuthStore();
  const { transactions, createTransaction } = useTransactions();
  const { insights, isLoading: isLoadingInsights, fetchInsights } = useInsights();
  const { prediction, fetchPredictions } = usePredictions();
  const { budgets, createBudget } = useBudgets();
  const { createGoal } = useGoals();

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [showSmartInput, setShowSmartInput] = useState(false);

  const navigate = useNavigate();

  const handleOpenAddTransaction = () => {
    setIsAddTransactionOpen(true);
  };

  const handleCloseAddTransaction = () => {
    setIsAddTransactionOpen(false);
  };

  const handleSubmitTransaction = (data: { amount: number; description: string; category: string; date: Date; type: 'income' | 'expense'; tags?: string[] }) => {
    createTransaction({
      user_id: 'user1',
      amount: data.amount,
      type: data.type,
      category_id: null,
      category_name: data.category,
      description: data.description,
      vendor: null,
      date: data.date.toISOString(),
      time: null,
      notes: null,
      tags: data.tags || null,
      is_recurring: false,
      recurring_frequency: null,
      ai_parsed: false,
      ai_confidence: 1,
      original_input: null,
    });
    setIsAddTransactionOpen(false);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const formattedTransactions = transactions.map((t) => ({
        id: t.id,
        user_id: t.user_id,
        amount: t.amount,
        type: t.type,
        category_id: t.category_id,
        category_name: t.category_name,
        description: t.description,
        vendor: t.vendor,
        date: t.date,
        time: t.time,
        notes: t.notes,
        tags: t.tags,
        is_recurring: t.is_recurring,
        recurring_frequency: t.recurring_frequency,
        ai_parsed: t.ai_parsed,
        ai_confidence: t.ai_confidence,
        original_input: t.original_input,
        created_at: t.created_at,
        updated_at: t.updated_at,
      }));
      fetchInsights(formattedTransactions, budgets);
      fetchPredictions(formattedTransactions);
    }
  }, [transactions, budgets, fetchInsights, fetchPredictions]);

  const handleSmartInputTransaction = (data: any) => {
    createTransaction({
      user_id: 'user1',
      amount: data.amount,
      type: data.type,
      category_id: null,
      category_name: data.category,
      description: data.description,
      vendor: null,
      date: data.date.toISOString(),
      time: null,
      notes: null,
      tags: data.tags || null,
      is_recurring: false,
      recurring_frequency: null,
      ai_parsed: true,
      ai_confidence: 1,
      original_input: null,
    });
  };

  const handleSmartInputBudget = (data: any) => {
    createBudget({
      user_id: 'user1',
      category_name: data.category,
      amount: data.amount,
      period: data.period,
      start_date: new Date().toISOString().split('T')[0],
      alert_threshold: 80,
      is_active: true,
      category_id: null,
      end_date: null,
    });
  };

  const handleSmartInputGoal = (data: any) => {
    createGoal({
      user_id: 'user1',
      name: data.name,
      target_amount: data.targetAmount,
      description: data.description,
      current_amount: 0,
      deadline: data.deadline.toISOString(),
      category: data.category,
      priority: data.priority,
      status: 'active',
    });
  };

  // Calculate balance and ensure non-negative for friendly dashboard display
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const rawBalance = totalIncome - totalExpenses;
  const balance = rawBalance >= 0 ? rawBalance : 0;

  const monthlyMap = new Map<string, { month: string; date: Date; income: number; expenses: number }>();
  const categoryMap = new Map<string, { category: string; amount: number; color: string }>();
  const colorPalette = ['#FF4D8A', '#00C2A8', '#3B82F6', '#8B5CF6', '#FBBF24', '#14B8A6'];

  transactions.forEach((t) => {
    const parsedDate = new Date(t.date);
    if (Number.isNaN(parsedDate.getTime())) return;

    const monthLabel = `${parsedDate.toLocaleString('default', { month: 'short' })} ${parsedDate.getFullYear()}`;

    const existingMonth = monthlyMap.get(monthLabel);
    if (existingMonth) {
      if (t.type === 'income') {
        existingMonth.income += t.amount;
      } else {
        existingMonth.expenses += t.amount;
      }
    } else {
      monthlyMap.set(monthLabel, {
        month: monthLabel,
        date: parsedDate,
        income: t.type === 'income' ? t.amount : 0,
        expenses: t.type === 'expense' ? t.amount : 0,
      });
    }

    if (t.type === 'expense') {
      const categoryKey = t.category_name || 'Uncategorized';
      const existingCategory = categoryMap.get(categoryKey);
      if (existingCategory) {
        existingCategory.amount += t.amount;
      } else {
        const colorIndex = categoryMap.size % colorPalette.length;
        categoryMap.set(categoryKey, {
          category: categoryKey,
          amount: t.amount,
          color: colorPalette[colorIndex],
        });
      }
    }
  });

  const chartData = Array.from(monthlyMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((item) => ({
      month: item.month,
      income: item.income,
      expenses: item.expenses,
      net: item.income - item.expenses,
    }));

  const categoryData = Array.from(categoryMap.values());

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-text-secondary mt-1">Here's your financial overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              className="btn-gradient flex items-center gap-2"
              onClick={() => setShowSmartInput(!showSmartInput)}
            >
              <MicrophoneIcon className="h-5 w-5" />
              {showSmartInput ? 'Hide AI Input' : 'Quick Entry (AI)'}
            </Button>
            <button
              onClick={handleOpenAddTransaction}
              className="bg-background-secondary text-text-primary border border-glass-border px-5 py-2.5 rounded-xl font-medium hover:bg-glass transition-all duration-300"
            >
              Manual Entry
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-background-secondary text-text-primary border border-glass-border px-5 py-2.5 rounded-xl font-medium hover:bg-glass transition-all duration-300"
            >
              Go to Transactions
            </button>
            <button
              onClick={() => navigate('/goals')}
              className="bg-background-secondary text-text-primary border border-glass-border px-5 py-2.5 rounded-xl font-medium hover:bg-glass transition-all duration-300"
            >
              Goals Page
            </button>
          </div>
        </motion.div>

        {/* AI Smart Input Section */}
        {showSmartInput && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border-accent-purple/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <MicrophoneIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">AI-Powered Quick Entry</h3>
                  <p className="text-xs text-text-secondary">Say or type: "Spent ₹300 on Zomato yesterday"</p>
                </div>
              </div>
              <UnifiedSmartInput
                onTransactionAdd={handleSmartInputTransaction}
                onBudgetAdd={handleSmartInputBudget}
                onGoalAdd={handleSmartInputGoal}
                onClose={() => setShowSmartInput(false)}
              />
            </Card>
          </motion.div>
        )}

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          income={totalIncome}
          expenses={totalExpenses}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Chart */}
            <Card>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Spending Trends</h2>
              <SpendingChart data={chartData} />
            </Card>

            {/* Category Breakdown (below spending chart) */}
            <Card>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Category Breakdown</h2>
              <CategoryBreakdown data={categoryData} />
            </Card>

            {/* Recent Transactions */}
            <Card>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Transactions</h2>
              <RecentTransactions transactions={transactions} />
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Insights */}
            <AIInsightsPanel
              insights={insights}
              prediction={prediction}
              isLoadingInsights={isLoadingInsights}
              isLoadingPrediction={false}
              onRefresh={() => {
                if (transactions.length > 0) {
                  const formattedTransactions = transactions.map((t) => ({
                    id: t.id,
                    user_id: t.user_id,
                    amount: t.amount,
                    type: t.type,
                    category_id: t.category_id,
                    category_name: t.category_name,
                    description: t.description,
                    vendor: t.vendor,
                    date: t.date,
                    time: t.time,
                    notes: t.notes,
                    tags: t.tags,
                    is_recurring: t.is_recurring,
                    recurring_frequency: t.recurring_frequency,
                    ai_parsed: t.ai_parsed,
                    ai_confidence: t.ai_confidence,
                    original_input: t.original_input,
                    created_at: t.created_at,
                    updated_at: t.updated_at,
                  }));
                  fetchInsights(formattedTransactions, budgets);
                  fetchPredictions(formattedTransactions);
                }
              }}
            />
          </div>
        </div>

        {/* Transaction Form Modal */}
        <Modal isOpen={isAddTransactionOpen} onClose={handleCloseAddTransaction} title="Add Transaction">
          <TransactionForm
            onSubmit={handleSubmitTransaction}
            onCancel={handleCloseAddTransaction}
          />
        </Modal>
      </div>
    </div>
  );
};

