import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { GoalFormData } from '../../types/goal';

interface GoalFormProps {
  initialData?: Partial<GoalFormData>;
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<GoalFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    target_amount: initialData?.target_amount || 0,
    current_amount: initialData?.current_amount || 0,
    deadline: initialData?.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: initialData?.category || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'active',
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
            {initialData ? 'Edit Goal' : 'Create Goal'}
          </h2>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-primary">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal Name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
            placeholder="e.g., Emergency Fund"
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
              className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/50 transition-all duration-300 resize-none"
              rows={3}
            />
          </div>

          <Input
            label="Target Amount"
            type="number"
            value={form.target_amount.toString()}
            onChange={(value) => setForm({ ...form, target_amount: parseFloat(value) || 0 })}
            placeholder="0.00"
            required
          />

          <Input
            label="Current Amount"
            type="number"
            value={form.current_amount.toString()}
            onChange={(value) => setForm({ ...form, current_amount: parseFloat(value) || 0 })}
            placeholder="0.00"
            required
          />

          <Input
            label="Category"
            value={form.category || ''}
            onChange={(value) => setForm({ ...form, category: value })}
            placeholder="e.g., Savings"
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
              className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-purple"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input
            label="Deadline"
            type="date"
            value={typeof form.deadline === 'string' ? form.deadline : new Date(form.deadline).toISOString().split('T')[0]}
            onChange={(value) => setForm({ ...form, deadline: value })}
            required
          />

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
