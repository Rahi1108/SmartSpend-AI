import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { checkOllamaHealth, getStatusMessage, getOllamaStatus } from '../../services/ollama';
import type { OllamaStatus } from '../../services/ollama';

export const OllamaStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<OllamaStatus | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Initial check
    checkOllamaHealth().then(setStatus);

    // Check every 30 seconds
    const interval = setInterval(() => {
      checkOllamaHealth().then(setStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return null;
  }

  const isOnline = status.isOnline;
  const message = getStatusMessage();

  return (
    <motion.div
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className="relative"
    >
      {/* Status Button */}
      <button
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-300
          ${isOnline
            ? 'bg-accent-green/10 text-accent-green border border-accent-green/30 hover:bg-accent-green/20'
            : 'bg-accent-orange/10 text-accent-orange border border-accent-orange/30 hover:bg-accent-orange/20'
          }
        `}
        title={message}
      >
        {/* Status Dot */}
        <motion.div
          animate={{ scale: isOnline ? 1 : 1 }}
          className={`
            w-2 h-2 rounded-full
            ${isOnline ? 'bg-accent-green' : 'bg-accent-orange'}
          `}
        />
        
        {/* Status Text */}
        <span className="hidden sm:inline whitespace-nowrap">
          {isOnline ? 'Ollama Online' : 'Ollama Offline'}
        </span>
      </button>

      {/* Tooltip */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`
            absolute top-full mt-2 right-0 z-50
            bg-background-secondary border border-glass-border rounded-lg p-3
            text-xs text-text-secondary whitespace-nowrap
            shadow-lg backdrop-blur-sm
          `}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-accent-green' : 'bg-accent-orange'}`} />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Simpler inline status for dashboard corners
 */
export const OllamaStatusBadge: React.FC = () => {
  const status = getOllamaStatus();
  
  if (!status) {
    return null;
  }

  return (
    <div
      className={`
        text-xs font-medium px-2 py-1 rounded-full
        ${status.isOnline
          ? 'bg-accent-green/20 text-accent-green'
          : 'bg-accent-orange/20 text-accent-orange'
        }
      `}
      title={getStatusMessage()}
    >
      {status.isOnline ? '🟢 Ready' : '🔴 Offline'}
    </div>
  );
};
