import { useState } from 'react';
import { signUp } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    const { error } = await signUp(
      form.email,
      form.password,
      form.fullName
    );

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Account created! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">Create Account</h2>

        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(value) =>
            setForm({ ...form, fullName: value })
          }
        />

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

        <Button onClick={handleRegister} isLoading={loading}>
          Register
        </Button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <span
            className="text-accent-purple cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};
