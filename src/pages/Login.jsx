import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → go straight to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Log in</h1>
        <p className="text-sm text-muted-foreground mb-6">Welcome back to USAEO.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-foreground text-white rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          No account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
