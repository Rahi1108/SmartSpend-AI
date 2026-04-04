import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AlertBannerProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, onClose }) => {
  const colors = {
    success: 'bg-success/20 border-success/30 text-success',
    warning: 'bg-warning/20 border-warning/30 text-warning',
    error: 'bg-error/20 border-error/30 text-error',
    info: 'bg-accent-blue/20 border-accent-blue/30 text-accent-blue',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg border ${colors[type]} flex items-center justify-between`}
    >
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-4 hover:opacity-70">
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};
