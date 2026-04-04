import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { TransactionFormData } from '../../types/transaction';

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<TransactionFormData>({
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    category: initialData?.category || '',
    date: initialData?.date || new Date(),
    type: initialData?.type || 'expense',
    tags: initialData?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-background p-6 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-primary">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Type</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'income' })}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  form.type === 'income'
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-glass text-text-secondary hover:bg-glass-hover'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'expense' })}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  form.type === 'expense'
                    ? 'bg-error/20 text-error border border-error/30'
                    : 'bg-glass text-text-secondary hover:bg-glass-hover'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <Input
            label="Amount"
            type="number"
            value={form.amount.toString()}
            onChange={(value) => setForm({ ...form, amount: parseFloat(value) || 0 })}
            placeholder="0.00"
            required
          />

          <Input
            label="Description"
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
            placeholder="What was this for?"
            required
          />

          <Input
            label="Category"
            value={form.category}
            onChange={(value) => setForm({ ...form, category: value })}
            placeholder="e.g., Food, Transport"
            required
          />

          <Input
            label="Date"
            type="date"
            value={form.date.toISOString().split('T')[0]}
            onChange={(value) => setForm({ ...form, date: new Date(value) })}
            required
          />

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
