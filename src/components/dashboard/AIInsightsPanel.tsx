// Enhanced AI Insights Panel with Comprehensive AI Integration
// Displays behavioral insights, predictive analytics, and smart recommendations

import React from 'react';
import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CpuChipIcon,
  EyeIcon,
  ArrowUpIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  useBehavioralInsights,
  usePredictiveInsights,
  useComprehensiveSummary
} from '../../hooks/useEnhancedAI';

interface AIInsightsPanelProps {
  onRefresh?: () => void;
}

const insightTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  behavioral: LightBulbIcon,
  predictive: ChartBarIcon,
  anomaly: ExclamationTriangleIcon,
  recommendation: CheckCircleIcon,
  risk: ShieldCheckIcon,
  opportunity: ArrowUpIcon,
  learning: CpuChipIcon,
  insight: EyeIcon,
};

const priorityStyles: Record<string, string> = {
  low: 'border-l-text-muted',
  medium: 'border-l-warning',
  high: 'border-l-error',
  critical: 'border-l-red-500',
};

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ onRefresh }) => {
  const { patterns, isAnalyzing: isAnalyzingPatterns, error: patternsError } = useBehavioralInsights();
  const { insights, isGenerating: isGeneratingInsights, error: insightsError } = usePredictiveInsights();
  const { summary, isGenerating: isGeneratingSummary, error: summaryError } = useComprehensiveSummary();

  const isLoading = isAnalyzingPatterns || isGeneratingInsights || isGeneratingSummary;
  const error = patternsError || insightsError || summaryError;

  const handleRefresh = () => {
    // Force refresh all AI analyses
    window.location.reload(); // Simple refresh for now
    onRefresh?.();
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <CpuChipIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-text-primary">AI Insights</h3>
            <p className="text-xs text-text-muted">Advanced behavioral analysis & predictions</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-xs text-accent-purple hover:text-accent-pink transition-colors disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Comprehensive Summary */}
      {(isGeneratingSummary || summary) && (
        <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20">
          {isGeneratingSummary ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-text-secondary">Generating comprehensive analysis...</span>
            </div>
          ) : summary ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-text-secondary">Financial Overview</p>
                <EyeIcon className="h-5 w-5 text-accent-purple" />
              </div>
              <p className="text-sm text-text-primary mb-3">{summary.overview}</p>

              {summary.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-glass-border">
                  <p className="text-xs font-medium text-text-primary mb-2">Key Recommendations:</p>
                  {summary.recommendations.slice(0, 2).map((rec, i) => (
                    <p key={i} className="text-xs text-text-secondary flex items-center gap-1 mb-1">
                      <CheckCircleIcon className="h-3 w-3 text-success" />
                      {rec}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-glass-border">
                <p className="text-xs text-text-secondary">
                  <span className="font-medium">Risk Assessment:</span> {summary.riskAssessment}
                </p>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Predictive Insights */}
      {(isGeneratingInsights || insights.length > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
            <ArrowUpIcon className="h-4 w-4" />
            Predictive Insights
          </h4>
          {isGeneratingInsights ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-text-secondary">Analyzing predictions...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => {
                const Icon = insightTypeIcons[insight.type] || LightBulbIcon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg bg-glass border-l-4 ${priorityStyles[insight.impact === 'positive' ? 'low' : insight.impact === 'negative' ? 'high' : 'medium'] || 'border-l-text-muted'}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-4 w-4 text-text-secondary mt-0.5" />
                      <div>
                        <h5 className="text-sm font-medium text-text-primary">{insight.title}</h5>
                        <p className="text-xs text-text-secondary mt-1">{insight.description}</p>
                        {insight.confidence && (
                          <p className="text-xs text-text-muted mt-1">
                            Confidence: {Math.round(insight.confidence * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Behavioral Patterns */}
      {(isAnalyzingPatterns || patterns.length > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
            <LightBulbIcon className="h-4 w-4" />
            Behavioral Patterns
          </h4>
          {isAnalyzingPatterns ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-text-secondary">Analyzing your spending patterns...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {patterns.slice(0, 2).map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-glass border border-glass-border"
                >
                  <div className="flex items-start gap-3">
                    <ChartBarIcon className="h-4 w-4 text-text-secondary mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-text-primary">{pattern.category}</h5>
                      <p className="text-xs text-text-secondary mt-1">
                        Daily: ₹{pattern.averageDaily.toFixed(0)}, Weekly: ₹{pattern.averageWeekly.toFixed(0)}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Peak days: {pattern.peakDays.join(', ')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State for Empty Data */}
      {!isLoading && !summary && insights.length === 0 && patterns.length === 0 && (
        <div className="text-center py-8">
          <CpuChipIcon className="h-12 w-12 mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary mb-2">AI Analysis in Progress</p>
          <p className="text-xs text-text-muted">Add more transactions to unlock advanced insights</p>
        </div>
      )}
    </Card>
  );
};
