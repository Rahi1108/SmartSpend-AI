import React from 'react';
import { motion } from 'framer-motion';
import { BanknotesIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  currency?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  income,
  expenses,
  currency = '$'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-linear-to-br from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Total Balance</h3>
        <BanknotesIcon className="w-6 h-6 text-accent-purple" />
      </div>

      <div className="space-y-4">
        <div className="text-3xl font-bold text-text-primary">
          {currency}{balance.toFixed(2)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <ArrowUpIcon className="w-4 h-4 text-success" />
            <div>
              <p className="text-sm text-text-secondary">Income</p>
              <p className="font-semibold text-success">{currency}{income.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ArrowDownIcon className="w-4 h-4 text-error" />
            <div>
              <p className="text-sm text-text-secondary">Expenses</p>
              <p className="font-semibold text-error">{currency}{expenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
