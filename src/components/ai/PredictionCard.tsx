import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';
import type { SpendingPrediction } from '../../types/ai';

interface PredictionCardProps {
  prediction: SpendingPrediction;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const trendIcons = {
    increasing: ArrowTrendingUpIcon,
    decreasing: ArrowTrendingDownIcon,
    stable: MinusIcon,
  };

  const trendColors = {
    increasing: 'text-error',
    decreasing: 'text-success',
    stable: 'text-text-secondary',
  };

  const TrendIcon = trendIcons[prediction.trend];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-xl bg-glass border border-glass-border"
    >
      <div className="flex items-center space-x-3 mb-4">
        <ChartBarIcon className="w-6 h-6 text-accent-purple" />
        <h3 className="font-semibold text-text-primary">{prediction.category} Prediction</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Predicted Amount</span>
          <span className="font-semibold text-text-primary">${prediction.predictedAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Confidence</span>
          <span className="font-semibold text-text-primary">{(prediction.confidence * 100).toFixed(0)}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Trend</span>
          <div className="flex items-center space-x-1">
            <TrendIcon className={`w-4 h-4 ${trendColors[prediction.trend]}`} />
            <span className="capitalize text-text-primary">{prediction.trend}</span>
          </div>
        </div>

        {prediction.warnings.length > 0 && (
          <div>
            <h4 className="text-text-secondary mb-2">Warnings</h4>
            <ul className="space-y-1">
              {prediction.warnings.map((warning, i) => (
                <li key={i} className="text-sm text-warning">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {prediction.recommendations.length > 0 && (
          <div>
            <h4 className="text-text-secondary mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {prediction.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-accent-teal">• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};
