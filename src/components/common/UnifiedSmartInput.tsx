import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { useSmartInput } from '../../hooks/useSmartInput';
import { LoadingSpinner } from './LoadingSpinner';

interface UnifiedSmartInputProps {
  onTransactionAdd?: (data: any) => void;
  onBudgetAdd?: (data: any) => void;
  onGoalAdd?: (data: any) => void;
  onClose: () => void;
}

export const UnifiedSmartInput: React.FC<UnifiedSmartInputProps> = ({
  onTransactionAdd,
  onBudgetAdd,
  onGoalAdd,
  onClose,
}) => {
  const [textInput, setTextInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { isClassifying, classifiedData, error, classify, getTransactionData, getBudgetData, getGoalData, reset } = useSmartInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    
    setSubmitted(true);
    await classify(textInput);
  };

  const handleConfirm = () => {
    if (!classifiedData) return;

    switch (classifiedData.type) {
      case 'transaction': {
        const data = getTransactionData();
        if (data && onTransactionAdd) {
          onTransactionAdd(data);
        }
        break;
      }
      case 'budget': {
        const data = getBudgetData();
        if (data && onBudgetAdd) {
          onBudgetAdd(data);
        }
        break;
      }
      case 'goal': {
        const data = getGoalData();
        if (data && onGoalAdd) {
          onGoalAdd(data);
        }	
        break;
      }
    }
    
    onClose();
  };

  const handleEdit = () => {
    setSubmitted(false);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-background p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-accent-purple" />
            <h2 className="text-xl font-semibold text-text-primary">
              Smart Entry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {!submitted ? (
          // Input stage
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Describe your entry
              </label>
              <p className="text-xs text-text-secondary mb-2">
                Example: "Spent ₹500 on groceries yesterday" or "Set budget of ₹10000 for food monthly"
              </p>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter transaction, budget, or goal details..."
                className="w-full px-4 py-3 bg-background-secondary border border-glass-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!textInput.trim() || isClassifying}
                className="flex-1"
              >
                {isClassifying ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Analyzing...</span>
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </form>
        ) : classifiedData ? (
          // Classification result stage
          <div className="space-y-4">
            {/* Type Badge */}
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg border border-glass-border">
              <div>
                <p className="text-xs text-text-muted mb-1">Detected Type</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    classifiedData.type === 'transaction' ? 'bg-accent-blue/20 text-accent-blue' :
                    classifiedData.type === 'budget' ? 'bg-accent-purple/20 text-accent-purple' :
                    'bg-accent-green/20 text-accent-green'
                  }`}>
                    {classifiedData.type.charAt(0).toUpperCase() + classifiedData.type.slice(1)}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {Math.round(classifiedData.confidence * 100)}% confident
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Data Preview */}
            <div className="space-y-3 p-3 bg-background-secondary rounded-lg border border-glass-border">
              <p className="text-sm font-medium text-text-primary">Extracted Information</p>
              
              {classifiedData.data.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Amount</span>
                  <span className="text-text-primary font-medium">₹{classifiedData.data.amount.toLocaleString()}</span>
                </div>
              )}
              
              {classifiedData.data.category && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Category</span>
                  <span className="text-text-primary font-medium">{classifiedData.data.category}</span>
                </div>
              )}
              
              {classifiedData.data.description && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Description</span>
                  <span className="text-text-primary font-medium truncate">{classifiedData.data.description}</span>
                </div>
              )}

              {classifiedData.type === 'transaction' && classifiedData.data.transactionType && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Type</span>
                  <span className={`font-medium ${
                    classifiedData.data.transactionType === 'income' ? 'text-accent-green' : 'text-error'
                  }`}>
                    {classifiedData.data.transactionType === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>
              )}

              {classifiedData.type === 'budget' && classifiedData.data.period && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Period</span>
                  <span className="text-text-primary font-medium capitalize">{classifiedData.data.period}</span>
                </div>
              )}

              {classifiedData.type === 'goal' && classifiedData.data.priority && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Priority</span>
                  <span className={`font-medium capitalize ${
                    classifiedData.data.priority === 'high' ? 'text-error' :
                    classifiedData.data.priority === 'medium' ? 'text-warning' :
                    'text-accent-green'
                  }`}>
                    {classifiedData.data.priority}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleConfirm}
              >
                Confirm & Save
              </Button>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="space-y-4">
            <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleEdit}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
