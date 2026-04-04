import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { useBudgets } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
import { useUIStore } from '../stores/uiStore';
import { GoalsList } from '../components/goals/GoalsList';
import { GoalForm } from '../components/goals/GoalForm';
import { Modal } from '../components/common/Modal';
import { UnifiedSmartInput } from '../components/common/UnifiedSmartInput';
import { Button } from '../components/common/Button';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import type { Goal } from '../types/database';
import type { GoalFormData } from '../types/goal';

const VALID_GOAL_CATEGORIES = new Set([
  'savings',
  'debt',
  'investment',
  'purchase',
  'emergency',
  'other',
]);

const normalizeGoalCategory = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return VALID_GOAL_CATEGORIES.has(normalized) ? normalized : 'other';
};

export const GoalsPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSmartInput, setShowSmartInput] = useState(false);

  const { user } = useAuth();
  const userId = user?.id || 'user1';
  const { goals, createGoal, updateGoal, deleteGoal } = useGoals();
  const { createBudget } = useBudgets();
  const { createTransaction } = useTransactions();
  const { isGoalModalOpen, openGoalModal, closeGoalModal } = useUIStore();

  // Calculate goal progress
  const goalsWithProgress = goals.map(goal => {
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const isCompleted = goal.current_amount >= goal.target_amount;
    const isActive = goal.status === 'active';

    return {
      ...goal,
      progress,
      isCompleted,
      isActive,
    };
  });

  const activeGoals = goalsWithProgress.filter(g => g.isActive);
  const completedGoals = goalsWithProgress.filter(g => g.isCompleted);
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const handleCreateGoal = async (data: GoalFormData) => {
    try {
      await createGoal({
        user_id: userId,
        name: data.name,
        target_amount: data.target_amount,
        description: data.description ?? null,
        current_amount: data.current_amount ?? 0,
        deadline: data.deadline || null,
        category: normalizeGoalCategory(data.category),
        priority: data.priority || 'medium',
        status: data.status ?? 'active',
      });
      closeGoalModal();
    } catch (error) {
      console.error('Goal save failed:', error);
      alert('Unable to save goal. Check the console for details.');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditMode(true);
    openGoalModal();
  };

  const handleUpdateGoal = (data: Partial<Goal>) => {
    if (selectedGoal) {
      updateGoal({ id: selectedGoal.id, updates: data });
      setSelectedGoal(null);
      setIsEditMode(false);
      closeGoalModal();
    }
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleSmartInputTransaction = async (data: any) => {
    try {
      await createTransaction({
        user_id: userId,
        amount: data.amount,
        type: data.type,
        category_id: null,
        category_name: data.category,
        description: data.description,
        vendor: null,
        date: data.date?.toISOString?.() || new Date().toISOString(),
        time: null,
        notes: null,
        tags: data.tags || null,
        is_recurring: false,
        recurring_frequency: null,
        ai_parsed: true,
        ai_confidence: 1,
        original_input: data.description || null,
      });
      setShowSmartInput(false);
    } catch (error) {
      console.error('Goal page transaction save failed:', error);
      alert('Unable to save transaction. Check the console for details.');
    }
  };

  const handleSmartInputBudget = async (data: any) => {
    try {
      await createBudget({
        user_id: userId,
        category_name: data.category,
        amount: data.amount,
        period: data.period,
        start_date: new Date().toISOString().split('T')[0],
        alert_threshold: 0.8,
        is_active: true,
        category_id: null,
        end_date: null,
      });
      setShowSmartInput(false);
    } catch (error) {
      console.error('Goal page budget save failed:', error);
      alert('Unable to save budget. Check the console for details.');
    }
  };

  const handleSmartInputGoal = async (data: any) => {
    try {
      await createGoal({
        user_id: userId,
        name: data.goalName || data.description || 'New Goal',
        target_amount: data.amount,
        description: data.description || null,
        current_amount: 0,
        deadline: data.deadline ? data.deadline.toISOString?.() : null,
        category: data.category || null,
        priority: data.priority || 'medium',
        status: 'active',
      });
      setShowSmartInput(false);
    } catch (error) {
      console.error('Goal smart save failed:', error);
      alert('Unable to save goal. Check the console for details.');
    }
  };

  const handleCloseModal = () => {
    setSelectedGoal(null);
    setIsEditMode(false);
    closeGoalModal();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Goals</h1>
          <p className="text-text-secondary mt-1">Set and track your financial goals</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowSmartInput(!showSmartInput)} variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            {showSmartInput ? 'Hide AI Input' : 'Quick Entry (AI)'}
          </Button>
          <Button onClick={openGoalModal} className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </div>

      {/* AI Smart Input Section */}
      {showSmartInput && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">AI-Powered Quick Entry</h3>
                <p className="text-xs text-text-secondary">Say or type: "Save ₹50000 for emergency fund by next year"</p>
              </div>
            </div>
            <UnifiedSmartInput
              onTransactionAdd={handleSmartInputTransaction}
              onBudgetAdd={handleSmartInputBudget}
              onGoalAdd={handleSmartInputGoal}
              onClose={() => setShowSmartInput(false)}
            />
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-accent-purple" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Active Goals</h3>
              <p className="text-2xl font-bold text-accent-purple">{activeGoals.length}</p>
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
            <CheckCircle className="w-6 h-6 text-success" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Completed</h3>
              <p className="text-2xl font-bold text-success">{completedGoals.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">Total Target</h3>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalTargetAmount)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">Overall Progress</h3>
          <p className="text-2xl font-bold text-accent-teal">{formatPercentage(overallProgress)}</p>
        </motion.div>
      </div>

      {/* Goals List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <GoalsList
          goals={goalsWithProgress}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
        />
      </motion.div>

      {/* Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? 'Edit Goal' : 'Create Goal'}
      >
        <GoalForm
          initialData={selectedGoal ? {
            name: selectedGoal.name,
            description: selectedGoal.description || '',
            target_amount: selectedGoal.target_amount,
            current_amount: selectedGoal.current_amount,
            deadline: selectedGoal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: selectedGoal.category || '',
            priority: selectedGoal.priority,
            status: selectedGoal.status,
          } : undefined}
          onSubmit={isEditMode ? handleUpdateGoal : handleCreateGoal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
