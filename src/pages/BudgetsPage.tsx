import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
import { useUIStore } from '../stores/uiStore';
import { BudgetList } from '../components/budgets/BudgetList';
import { BudgetForm } from '../components/budgets/BudgetForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import type { Budget } from '../types/database';

export const BudgetsPage: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { budgets, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();
  const { isBudgetModalOpen, openBudgetModal, closeBudgetModal } = useUIStore();

  // Calculate budget progress and alerts
  const budgetsWithProgress = budgets.map(budget => {
    const categoryTransactions = transactions.filter(
      t => t.category_name === budget.category_name && t.type === 'expense'
    );

    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const progress = (spent / budget.amount) * 100;
    const isOverBudget = spent > budget.amount;
    const isNearLimit = progress >= budget.alert_threshold;

    return {
      ...budget,
      spent,
      progress,
      isOverBudget,
      isNearLimit,
    };
  });

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetsWithProgress.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgetsWithProgress.filter(b => b.isOverBudget).length;
  const nearLimitCount = budgetsWithProgress.filter(b => b.isNearLimit && !b.isOverBudget).length;

  const handleCreateBudget = (data: Partial<Budget> & { category_name: string; amount: number; period: 'weekly' | 'monthly' | 'yearly'; start_date: string }) => {
    createBudget({
      category_name: data.category_name,
      amount: data.amount,
      period: data.period,
      start_date: data.start_date,
      alert_threshold: data.alert_threshold ?? 80,
      is_active: true,
      category_id: null,
      end_date: null,
    });
    closeBudgetModal();
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditMode(true);
    openBudgetModal();
  };

  const handleUpdateBudget = (data: Partial<Budget>) => {
    if (selectedBudget) {
      updateBudget({ id: selectedBudget.id, updates: data });
      setSelectedBudget(null);
      setIsEditMode(false);
      closeBudgetModal();
    }
  };

  const handleDeleteBudget = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleCloseModal = () => {
    setSelectedBudget(null);
    setIsEditMode(false);
    closeBudgetModal();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Budgets</h1>
          <p className="text-text-secondary mt-1">Track your spending limits and goals</p>
        </div>
        <Button onClick={openBudgetModal} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">Total Budgeted</h3>
          <p className="text-2xl font-bold text-accent-purple">{formatCurrency(totalBudgeted)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">Total Spent</h3>
          <p className="text-2xl font-bold text-text-secondary">{formatCurrency(totalSpent)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">Over Budget</h3>
          <p className={`text-2xl font-bold ${overBudgetCount > 0 ? 'text-error' : 'text-success'}`}>
            {overBudgetCount}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">Near Limit</h3>
          <p className={`text-2xl font-bold ${nearLimitCount > 0 ? 'text-warning' : 'text-success'}`}>
            {nearLimitCount}
          </p>
        </motion.div>
      </div>

      {/* Alerts */}
      {(overBudgetCount > 0 || nearLimitCount > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 border-l-4 border-warning"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <h4 className="font-semibold text-text-primary">Budget Alerts</h4>
              <p className="text-text-secondary text-sm">
                {overBudgetCount > 0 && `${overBudgetCount} budget${overBudgetCount > 1 ? 's' : ''} exceeded`}
                {overBudgetCount > 0 && nearLimitCount > 0 && ', '}
                {nearLimitCount > 0 && `${nearLimitCount} near${nearLimitCount > 1 ? '' : 'ing'} limit`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Budget List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <BudgetList
          budgets={budgetsWithProgress}
          onEdit={handleEditBudget}
          onDelete={handleDeleteBudget}
        />
      </motion.div>

      {/* Budget Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? 'Edit Budget' : 'Create Budget'}
      >
        <BudgetForm
          initialData={selectedBudget || undefined}
          onSubmit={isEditMode ? handleUpdateBudget : handleCreateBudget}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
