import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, ClipboardList, Target, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const items = [
    { key: 'dashboard', icon: Home, label: 'Dashboard', to: '/dashboard' },
    { key: 'transactions', icon: ClipboardList, label: 'Transactions', to: '/transactions' },
    { key: 'budgets', icon: BarChart2, label: 'Budgets', to: '/budgets' },
    { key: 'goals', icon: Target, label: 'Goals', to: '/goals' },
    { key: 'settings', icon: Settings, label: 'Settings', to: '/settings' },
  ];

  const getIsActive = (to: string) => {
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border shadow-lg md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.to);

          return (
            <Link
              key={item.key}
              to={item.to}
              className={`flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                isActive ? 'text-accent-purple border-t-2 border-accent-purple' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
