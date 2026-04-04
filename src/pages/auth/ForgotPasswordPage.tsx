import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { supabase } from '../../services/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-surface-secondary p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link to="/login" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card p-8 backdrop-blur-xl space-y-6">
          {!submitted ? (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">Forgot Password?</h2>
                <p className="text-sm text-text-secondary">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  placeholder="you@example.com"
                  required
                />

                <Button type="submit" isLoading={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Check Your Email</h3>
                <p className="text-sm text-text-secondary">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm font-medium text-accent-purple">{email}</p>
              </div>

              <div className="bg-info/10 border border-info/30 rounded-lg p-4 text-sm text-text-secondary">
                <p>
                  If you don't see the email in your inbox, check your spam folder. The link will expire in 24 hours.
                </p>
              </div>

              <Button onClick={() => navigate('/login')} className="w-full">
                Return to Login
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-purple hover:text-accent-purple/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
