import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email, password, fullName);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Confirmation link sent to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <Link to="/login" className="text-sm text-primary font-medium hover:underline">Back to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Create account</h1>
        <p className="text-sm text-muted-foreground mb-6">Join USAEO — free.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Full name</label>
            <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Password</label>
            <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            <p className="text-xs text-muted-foreground">8+ characters.</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-foreground text-white rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors disabled:opacity-60">
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already registered? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
