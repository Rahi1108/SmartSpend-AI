import React from 'react';
import { motion } from 'framer-motion';
import { BudgetCard } from './BudgetCard';
import type { Budget } from '../../types/database';

interface BudgetListProps {
  budgets: Array<Budget & { spent?: number; progress?: number; isOverBudget?: boolean; isNearLimit?: boolean }>;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete }) => {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No budgets created yet.</p>
        <p className="text-text-muted text-sm mt-2">Create your first budget to start tracking your spending.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((budget, index) => (
        <motion.div
          key={budget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <BudgetCard
            budget={budget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
};
