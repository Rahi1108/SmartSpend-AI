import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Settings, Shield, Database, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../common/ThemeToggle';

export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Refs for click outside detection
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settingsMenuItems = [
    { label: 'Notifications', icon: Bell, path: '/settings', tab: 'notifications' },
    { label: 'Security', icon: Shield, path: '/settings', tab: 'security' },
    { label: 'Data & Privacy', icon: Database, path: '/settings', tab: 'data' },
  ];

  const profileMenuItems = [
    { label: 'Personal Information', icon: UserIcon, path: '/personal-information' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Sign Out', icon: LogOut, action: 'signout' },
  ];

  const handleMenuClick = (item: typeof settingsMenuItems[0] | typeof profileMenuItems[0]) => {
    if ('action' in item && item.action === 'signout') {
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
    setIsSettingsOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-glass-border/50 bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        {/* Left Section - Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-xl hover:bg-glass-hover transition-all duration-200 hover:scale-105"
          >
            <Menu className="h-5 w-5 text-text-secondary" />
          </button>

          {/* Brand - Leftmost */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">SmartSpend AI</h1>
          </div>
        </div>

        {/* Right Section - Controls & Profile */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <div className="p-1">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/settings?tab=notifications')}
            className="p-2 rounded-xl hover:bg-glass-hover transition-all duration-200 hover:scale-105 relative"
          >
            <Bell className="h-5 w-5 text-text-secondary hover:text-text-primary" />
            {/* Notification dot - can be made dynamic */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-pink rounded-full"></div>
          </button>

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-xl hover:bg-glass-hover transition-all duration-200 hover:scale-105"
            >
              <Settings className="h-5 w-5 text-text-secondary hover:text-text-primary" />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-background border border-glass-border rounded-xl shadow-xl z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Settings
                  </div>
                  {settingsMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMenuClick(item)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-glass-hover transition-colors rounded-lg"
                    >
                      <item.icon className="w-4 h-4 text-text-muted" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-glass-border/50" ref={profileRef}>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-text-primary">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-text-muted">
                {user?.email?.split('@')[1] || 'Welcome'}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsSettingsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-glass-hover transition-all duration-200 hover:scale-105"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-lg border-2 border-white/20">
                  <span className="text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-text-secondary" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background border border-glass-border rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-glass-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-white text-lg font-bold">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-text-muted">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {profileMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleMenuClick(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-glass-hover transition-colors rounded-lg"
                      >
                        <item.icon className="w-4 h-4 text-text-muted" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
