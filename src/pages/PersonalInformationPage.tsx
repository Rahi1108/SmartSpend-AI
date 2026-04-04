import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const PersonalInformationPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();

  const handleProfileUpdate = (data: { full_name?: string; email?: string }) => {
    updateProfile(data);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Personal Information</h1>
            <p className="text-text-secondary mt-1">Manage your personal details and account information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Avatar Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {profile?.full_name || user?.user_metadata?.full_name || 'User'}
              </h3>
              <p className="text-text-secondary">{user?.email}</p>
            </Card>
          </div>

          {/* Personal Information Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      defaultValue={profile?.full_name || user?.user_metadata?.full_name || ''}
                      placeholder="Enter your full name"
                      onChange={(value) => handleProfileUpdate({ full_name: value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      defaultValue={user?.email || ''}
                      placeholder="Enter your email"
                      disabled
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-text-secondary" />
                        <div>
                          <p className="font-medium text-text-primary">Account Created</p>
                          <p className="text-sm text-text-secondary">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-text-secondary" />
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

                <div className="flex justify-end">
                  <Button variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};