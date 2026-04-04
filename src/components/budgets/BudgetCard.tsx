import React from 'react';
import { motion } from 'framer-motion';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryColor } from '../../utils/categoryUtils';
import type { Budget } from '../../types/budget';

interface BudgetCardProps {
  budget: Budget & { spent?: number };
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const spent = budget.spent || 0;
  const progress = (spent / budget.amount) * 100;
  const isOverBudget = spent > budget.amount;
  const color = getCategoryColor(budget.category_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-glass border border-glass-border hover:bg-glass-hover transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-text-primary">{budget.category_name}</h3>
        </div>
        <BanknotesIcon className="w-6 h-6 text-accent-purple" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Spent</span>
          <span className={`font-medium ${isOverBudget ? 'text-error' : 'text-text-primary'}`}>
            {formatCurrency(spent)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Budget</span>
          <span className="font-medium text-text-primary">{formatCurrency(budget.amount)}</span>
        </div>

        <div className="w-full bg-surface-secondary rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-error' : 'bg-accent-teal'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-text-secondary">
          <span>{Math.round(progress)}% used</span>
          <span>{formatCurrency(budget.amount - spent)} remaining</span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="flex-1 px-3 py-2 text-sm bg-accent-purple/20 text-accent-purple rounded-lg hover:bg-accent-purple/30 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className="flex-1 px-3 py-2 text-sm bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
