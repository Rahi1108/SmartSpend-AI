import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Database, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../stores/uiStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'data'>('profile');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { user, updateProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useUIStore();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  const handleProfileUpdate = (data: { name?: string; email?: string }) => {
    updateProfile(data);
  };

  const handleSignOut = () => {
    signOut();
    setIsConfirmModalOpen(false);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            defaultValue={user?.user_metadata?.name || ''}
            placeholder="Enter your full name"
            onChange={(value) => handleProfileUpdate({ name: value })}
          />
          <Input
            label="Email"
            type="email"
            defaultValue={user?.email || ''}
            placeholder="Enter your email"
            disabled
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Account Created</p>
              <p className="text-sm text-text-secondary">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Last Sign In</p>
              <p className="text-sm text-text-secondary">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Budget Alerts</p>
              <p className="text-sm text-text-secondary">Get notified when you exceed budget limits</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Goal Milestones</p>
              <p className="text-sm text-text-secondary">Celebrate when you reach goal milestones</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Weekly Reports</p>
              <p className="text-sm text-text-secondary">Receive weekly spending summaries</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">AI Insights</p>
              <p className="text-sm text-text-secondary">Get personalized financial insights</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Password & Security</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Enable Two-Factor Authentication
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Login Sessions</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Current Session</p>
              <p className="text-sm text-text-secondary">Active now</p>
            </div>
            <span className="text-sm text-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Theme</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => toggleTheme()}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-accent-purple bg-accent-purple/10'
                : 'border-border bg-surface-secondary'
            }`}
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-white border border-border rounded mx-auto mb-2"></div>
              <p className="font-medium text-text-primary">Light</p>
            </div>
          </button>
          <button
            onClick={() => toggleTheme()}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-accent-purple bg-accent-purple/10'
                : 'border-border bg-surface-secondary'
            }`}
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-900 border border-border rounded mx-auto mb-2"></div>
              <p className="font-medium text-text-primary">Dark</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Display Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Compact Mode</p>
              <p className="text-sm text-text-secondary">Show more content in less space</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Animations</p>
              <p className="text-sm text-text-secondary">Enable smooth transitions and animations</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Data Management</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Import Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-error hover:bg-error/10">
            Clear All Data
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Privacy</h3>
        <div className="space-y-4">
          <div className="p-4 bg-surface-secondary rounded-lg">
            <p className="text-sm text-text-secondary mb-2">
              Your data is encrypted and stored securely. We never share your personal information with third parties.
            </p>
            <Button variant="outline" size="sm">
              View Privacy Policy
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-error">Danger Zone</h3>
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <h4 className="font-medium text-error mb-2">Delete Account</h4>
          <p className="text-sm text-text-secondary mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'data':
        return renderDataTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            <p className="text-text-secondary mt-1">Manage your account and preferences</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsConfirmModalOpen(true)}
            className="text-error hover:bg-error/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-accent-purple/20 text-accent-purple'
                          : 'text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                {renderTabContent()}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Sign Out"
      >
        <div className="space-y-4">
          <p className="text-text-primary">
            Are you sure you want to sign out of your account?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
