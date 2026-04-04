import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ArrowsRightLeftIcon, 
  ChartPieIcon, 
  TrophyIcon, 
  DocumentChartBarIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: ArrowsRightLeftIcon },
  { name: 'Budgets', href: '/budgets', icon: ChartPieIcon },
  { name: 'Goals', href: '/goals', icon: TrophyIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-background-secondary border-r border-glass-border">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <span className="text-2xl font-heading font-bold text-gradient">SmartSpend AI</span>
        </div>
        <nav className="mt-5 flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-glass text-accent-purple border border-accent-purple/20 shadow-glow-purple' 
                  : 'text-text-secondary hover:bg-glass hover:text-text-primary'}
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};