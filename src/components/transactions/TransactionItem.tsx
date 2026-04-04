import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Transaction } from '../../types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-glass rounded-xl hover:bg-glass-hover transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${
          transaction.type === 'income'
            ? 'bg-success/20 text-success'
            : 'bg-error/20 text-error'
        }`}>
          {transaction.type === 'income' ? (
            <ArrowUpIcon className="w-5 h-5" />
          ) : (
            <ArrowDownIcon className="w-5 h-5" />
          )}
        </div>

        <div>
          <h3 className="font-medium text-text-primary">{transaction.description}</h3>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>{transaction.category}</span>
            <span>•</span>
            <span>{transaction.date.toLocaleDateString()}</span>
          </div>
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {transaction.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs bg-accent-purple/20 text-accent-purple rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className={`font-semibold ${
          transaction.type === 'income' ? 'text-success' : 'text-error'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-text-secondary hover:text-accent-purple hover:bg-accent-purple/10 rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
