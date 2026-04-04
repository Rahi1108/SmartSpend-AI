import React from 'react';
import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { SpendingInsight, SpendingPrediction } from '../../services/ai';

interface AIInsightsPanelProps {
  insights: SpendingInsight[];
  prediction: SpendingPrediction | null;
  isLoadingInsights: boolean;
  isLoadingPrediction: boolean;
  onRefresh: () => void;
}

const insightIcons: Record<SpendingInsight['type'], React.ComponentType<{ className?: string }>> = {
  behavioral: LightBulbIcon,
  predictive: ChartBarIcon,
  anomaly: ExclamationTriangleIcon,
  recommendation: CheckCircleIcon,
};

const priorityStyles: Record<SpendingInsight['priority'], string> = {
  low: 'border-l-text-muted',
  medium: 'border-l-warning',
  high: 'border-l-error',
};

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  prediction,
  isLoadingInsights,
  isLoadingPrediction,
  onRefresh,
}) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <LightBulbIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-text-primary">AI Insights</h3>
            <p className="text-xs text-text-muted">Powered by your spending patterns</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoadingInsights || isLoadingPrediction}
          className="text-xs text-accent-purple hover:text-accent-pink transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Prediction Card */}
      {(isLoadingPrediction || prediction) && (
        <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20">
          {isLoadingPrediction ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-text-secondary">Analyzing trends...</span>
            </div>
          ) : prediction ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-text-secondary">Projected Monthly Spending</p>
                {prediction.trend === 'increasing' ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-error" />
                ) : prediction.trend === 'decreasing' ? (
                  <ArrowTrendingDownIcon className="h-5 w-5 text-success" />
                ) : null}
              </div>
              <p className="text-2xl font-bold text-text-primary">
                ₹{prediction.projectedMonthlySpending.toLocaleString()}
              </p>
              {prediction.warnings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-glass-border">
                  {prediction.warnings.map((warning: string, i: number) => (
                    <p key={i} className="text-xs text-warning flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-3 w-3" />
                      {warning}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-3">
        {isLoadingInsights ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-8">
            <LightBulbIcon className="h-12 w-12 mx-auto text-text-muted mb-3" />
            <p className="text-text-secondary">Add more transactions to get personalized insights</p>
          </div>
        ) : (
          insights.map((insight, index) => {
            const Icon = insightIcons[insight.type];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg bg-glass border-l-4 ${priorityStyles[insight.priority]}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-text-secondary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{insight.title}</h4>
                    <p className="text-xs text-text-secondary mt-1">{insight.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
};
