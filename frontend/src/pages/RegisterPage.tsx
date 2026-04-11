import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'GUEST' | 'PARTNER'>('GUEST');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate(role === 'PARTNER' ? '/partner/dashboard' : '/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-apple-text">Create your account</h1>
          <p className="text-sm text-apple-text-secondary mt-2">Join StayHub today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-apple-error text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-apple-text">I want to</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('GUEST')}
                className={cn(
                  'px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                  role === 'GUEST'
                    ? 'border-apple-blue bg-apple-blue-light text-apple-blue'
                    : 'border-apple-border text-apple-text-secondary hover:border-gray-300'
                )}
              >
                Book Hotels
              </button>
              <button
                type="button"
                onClick={() => setRole('PARTNER')}
                className={cn(
                  'px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                  role === 'PARTNER'
                    ? 'border-apple-blue bg-apple-blue-light text-apple-blue'
                    : 'border-apple-border text-apple-text-secondary hover:border-gray-300'
                )}
              >
                List My Property
              </button>
            </div>
          </div>

          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-apple-text-secondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-apple-blue hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
