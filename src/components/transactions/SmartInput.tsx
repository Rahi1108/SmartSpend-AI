import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useExpenseParser } from '../../hooks/useAI';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { Button } from '../common/Button';
import type { ParsedExpense } from '../../services/ai';

interface SmartInputProps {
  onExpenseParsed: (expense: ParsedExpense) => void;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  onExpenseParsed,
}) => {
  const [input, setInput] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ParsedExpense | null>(null);
  
  const { parseExpense, isLoading: isParsing, error: parseError } = useExpenseParser();
  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  // Update input when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleParse = async () => {
    if (!input.trim()) return;
    
    const result = await parseExpense(input);
    if (result) {
      setParsedPreview(result);
    }
  };

  const handleConfirm = () => {
    if (parsedPreview) {
      onExpenseParsed(parsedPreview);
      setInput('');
      setParsedPreview(null);
      resetTranscript();
    }
  };

  const handleReset = () => {
    setInput('');
    setParsedPreview(null);
    resetTranscript();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (parsedPreview) {
        handleConfirm();
      } else {
        handleParse();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Input */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <SparklesIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-purple" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Try: 'Spent ₹300 on Zomato yesterday' or 'Got ₹50000 salary'"
              className="smart-input pl-12 pr-24"
              disabled={isParsing}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-error/20 text-error animate-pulse'
                      : 'bg-glass hover:bg-glass-hover text-text-secondary'
                  }`}
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
              )}
              {input && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-glass hover:bg-glass-hover text-text-secondary"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <Button
            onClick={parsedPreview ? handleConfirm : handleParse}
            disabled={!input.trim() || isParsing}
            isLoading={isParsing}
          >
            {parsedPreview ? 'Add' : 'Parse'}
          </Button>
        </div>
        
        {/* Voice indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-8 left-0 text-sm text-accent-purple flex items-center gap-2"
          >
            <span className="h-2 w-2 bg-error rounded-full animate-pulse" />
            Listening...
          </motion.div>
        )}
      </div>

      {/* Error */}
      {parseError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-error"
        >
          {parseError}
        </motion.p>
      )}

      {/* Parsed Preview */}
      <AnimatePresence>
        {parsedPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-text-secondary">Parsed Result</h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  parsedPreview.confidence >= 0.8
                    ? 'bg-success/20 text-success'
                    : parsedPreview.confidence >= 0.5
                    ? 'bg-warning/20 text-warning'
                    : 'bg-error/20 text-error'
                }`}
              >
                {Math.round(parsedPreview.confidence * 100)}% confident
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Amount</p>
                <p className={`font-semibold ${
                  parsedPreview.type === 'expense' ? 'text-error' : 'text-success'
                }`}>
                  {parsedPreview.type === 'expense' ? '-' : '+'}₹{parsedPreview.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Category</p>
                <p className="text-text-primary">{parsedPreview.category}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Vendor</p>
                <p className="text-text-primary">{parsedPreview.vendor || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Date</p>
                <p className="text-text-primary">
                  {new Date(parsedPreview.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            
            {parsedPreview.description && (
              <div className="mt-3 pt-3 border-t border-glass-border">
                <p className="text-xs text-text-muted mb-1">Description</p>
                <p className="text-text-secondary text-sm">{parsedPreview.description}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Examples */}
      {!parsedPreview && !input && (
        <div className="flex flex-wrap gap-2">
          <p className="text-xs text-text-muted">Try:</p>
          {[
            'Spent ₹250 on groceries',
            'Paid ₹1500 electricity bill',
            'Got ₹50000 salary today',
            'Coffee at Starbucks ₹450',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setInput(example)}
              className="text-xs px-3 py-1 rounded-full bg-glass border border-glass-border text-text-secondary hover:border-accent-purple/50 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
