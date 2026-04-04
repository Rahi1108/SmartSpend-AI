import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { BudgetFormData } from '../../types/budget';

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<BudgetFormData>({
    category_name: initialData?.category_name || '',
    amount: initialData?.amount || 0,
    period: initialData?.period || 'monthly',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    alert_threshold: initialData?.alert_threshold || 80,
    color: initialData?.color || '#5D3FD3',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const colors = [
    '#5D3FD3', '#FF4D8A', '#00C2A8', '#3B82F6', '#F59E0B', '#EF4444', '#10B981'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-background p-6 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            {initialData ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-primary">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category"
            value={form.category_name}
            onChange={(value) => setForm({ ...form, category_name: value })}
            placeholder="e.g., Food & Dining"
            required
          />

          <Input
            label="Budget Amount"
            type="number"
            value={form.amount.toString()}
            onChange={(value) => setForm({ ...form, amount: parseFloat(value) || 0 })}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Period</label>
            <select
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value as any })}
              className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-purple"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    form.color === color ? 'border-accent-purple' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
