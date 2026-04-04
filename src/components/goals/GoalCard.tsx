import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, StarIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters';
import type { Goal } from '../../types/database';

interface GoalCardProps {
  goal: Goal & { progress?: number }; 
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const progress = (goal.current_amount / goal.target_amount) * 100;
  const isCompleted = goal.status === 'completed';
  const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
  const isOverdue = deadlineDate ? new Date() > deadlineDate && !isCompleted : false;

  const priorityColors = {
    low: 'text-accent-teal',
    medium: 'text-warning',
    high: 'text-error',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl bg-glass border border-glass-border hover:bg-glass-hover transition-all duration-300 ${
        isCompleted ? 'border-success/30 bg-success/5' : isOverdue ? 'border-error/30 bg-error/5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <StarIcon className={`w-6 h-6 ${priorityColors[goal.priority]}`} />
          <h3 className="font-semibold text-text-primary">{goal.name}</h3>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
          goal.status === 'completed' ? 'bg-success/20 text-success' :
          goal.status === 'paused' ? 'bg-warning/20 text-warning' :
          'bg-accent-purple/20 text-accent-purple'
        }`}>
          {goal.status}
        </span>
      </div>

      {goal.description && (
        <p className="text-text-secondary text-sm mb-4">{goal.description}</p>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Progress</span>
          <span className="text-text-primary">{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
        </div>

        <div className="w-full bg-background-secondary rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-success' : 'bg-accent-purple'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={`font-medium ${isCompleted ? 'text-success' : 'text-text-secondary'}`}>
            {progress.toFixed(1)}% complete
          </span>
          <div className="flex items-center space-x-1 text-text-muted">
            <CalendarIcon className="w-4 h-4" />
            <span>{deadlineDate ? deadlineDate.toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex space-x-2 mt-4">
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="flex-1 px-3 py-2 text-sm bg-accent-purple/20 text-accent-purple rounded-lg hover:bg-accent-purple/30 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
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
