import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/common/Card';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { UnifiedSmartInput } from '../components/common/UnifiedSmartInput';
import { Button } from '../components/common/Button';

export const TransactionsPage: React.FC = () => {
  const { transactions, createTransaction } = useTransactions();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [showSmartInput, setShowSmartInput] = useState(false);

  const openAddTransaction = () => setIsAddTransactionOpen(true);
  const closeAddTransaction = () => setIsAddTransactionOpen(false);

  const handleSubmit = (data: { amount: number; description: string; category: string; date: Date; type: 'income' | 'expense'; tags?: string[] }) => {
    createTransaction({
      user_id: 'user1',
      amount: data.amount,
      type: data.type,
      category_id: null,
      category_name: data.category,
      description: data.description,
      vendor: null,
      date: data.date.toISOString(),
      time: null,
      notes: null,
      tags: data.tags || null,
      is_recurring: false,
      recurring_frequency: null,
      ai_parsed: false,
      ai_confidence: 1,
      original_input: null,
    });
    closeAddTransaction();
  };

  const handleSmartInputTransaction = (data: any) => {
    createTransaction({
      user_id: 'user1',
      amount: data.amount,
      type: data.type,
      category_id: null,
      category_name: data.category,
      description: data.description,
      vendor: null,
      date: data.date.toISOString(),
      time: null,
      notes: null,
      tags: data.tags || null,
      is_recurring: false,
      recurring_frequency: null,
      ai_parsed: true,
      ai_confidence: 1,
      original_input: null,
    });
    setShowSmartInput(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Transactions</h1>
          <p className="text-text-secondary">All your spendings and incomes in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="btn-gradient flex items-center gap-2"
            onClick={() => setShowSmartInput(!showSmartInput)}
          >
            <MicrophoneIcon className="h-5 w-5" />
            Quick Entry (AI)
          </Button>
          <Button variant="secondary" onClick={openAddTransaction}>Manual Entry</Button>
          <Button variant="secondary" onClick={() => window.print()}>Download</Button>
        </div>
      </div>

      {/* AI Smart Input Card */}
      {showSmartInput && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border-accent-purple/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <MicrophoneIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">Quick Entry - AI Powered</h3>
                <p className="text-xs text-text-secondary">Example: "Spent ₹500 on lunch at Chipotle yesterday"</p>
              </div>
              <button 
                onClick={() => setShowSmartInput(false)}
                className="text-text-secondary hover:text-text-primary text-xl"
              >
                ✕
              </button>
            </div>
            <UnifiedSmartInput
              onTransactionAdd={handleSmartInputTransaction}
              onBudgetAdd={() => {}}
              onGoalAdd={() => {}}
              onClose={() => setShowSmartInput(false)}
            />
          </Card>
        </motion.div>
      )}

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-glass">
              <tr>
                <th className="p-4 text-text-muted font-medium">Date</th>
                <th className="p-4 text-text-muted font-medium">Vendor</th>
                <th className="p-4 text-text-muted font-medium">Category</th>
                <th className="p-4 text-text-muted font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                  <td className="p-4 text-text-secondary">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{t.vendor || 'Personal'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-glass-border text-xs">{t.category_name}</span>
                  </td>
                  <td className={`p-4 text-right font-bold ${t.type === 'expense' ? 'text-error' : 'text-success'}`}>
                    {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isAddTransactionOpen} onClose={closeAddTransaction} title="Add Transaction">
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={closeAddTransaction}
        />
      </Modal>
    </div>
  );
};