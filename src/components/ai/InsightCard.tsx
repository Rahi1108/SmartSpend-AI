import React from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import type { SpendingInsight } from '../../types/ai';

interface InsightCardProps {
  insight: SpendingInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const icons = {
    warning: ExclamationTriangleIcon,
    tip: LightBulbIcon,
    achievement: CheckCircleIcon,
  };

  const colors = {
    warning: 'border-warning/30 bg-warning/10',
    tip: 'border-accent-blue/30 bg-accent-blue/10',
    achievement: 'border-success/30 bg-success/10',
  };

  const Icon = icons[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border ${colors[insight.type]} flex items-start space-x-3`}
    >
      <Icon className="w-6 h-6 mt-0.5 shrink-0" />
      <div>
        <h3 className="font-semibold text-text-primary">{insight.title}</h3>
        <p className="text-text-secondary mt-1">{insight.description}</p>
        {insight.amount && (
          <p className="text-sm text-text-muted mt-2">
            Amount: ${insight.amount.toFixed(2)}
          </p>
        )}
      </div>
    </motion.div>
  );
};
