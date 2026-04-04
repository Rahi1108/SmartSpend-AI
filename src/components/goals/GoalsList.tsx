import React from 'react';
import { motion } from 'framer-motion';
import { GoalCard } from './GoalCard';
import type { Goal } from '../../types/database';

interface GoalsListProps {
  goals: Array<Goal & { progress?: number; isCompleted?: boolean; isActive?: boolean }>;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals, onEdit, onDelete }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No goals set yet.</p>
        <p className="text-text-muted text-sm mt-2">Create your first financial goal to start saving.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal, index) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GoalCard
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
};
