import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await login(form.email, form.password);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">Welcome Back</h2>

        <Input
          label="Email"
          value={form.email}
          onChange={(value) =>
            setForm({ ...form, email: value })
          }
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) =>
            setForm({ ...form, password: value })
          }
        />

        <Button onClick={handleLogin} isLoading={loading}>
          Login
        </Button>

        <p className="text-sm text-center">
          Don’t have an account?{' '}
          <span
            className="text-accent-purple cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};
