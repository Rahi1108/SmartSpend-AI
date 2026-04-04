import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { OllamaStatusIndicator } from '../ai/OllamaStatusIndicator';
import { ThemeToggle } from '../common/ThemeToggle';

export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-40 border-b border-glass-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-glass-hover transition-all duration-300"
          >
            <Menu className="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary">SmartSpend AI</h1>
            <p className="text-xs text-text-secondary">Track smarter, spend better</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Ollama Status Indicator */}
          <OllamaStatusIndicator />

          {/* Theme Toggle */}
          <ThemeToggle />

          <button className="p-2 rounded-lg hover:bg-glass-hover transition-all duration-300">
            <Bell className="h-5 w-5 text-text-secondary hover:text-text-primary" />
          </button>
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-glass-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-text-primary">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-xs text-text-secondary">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
