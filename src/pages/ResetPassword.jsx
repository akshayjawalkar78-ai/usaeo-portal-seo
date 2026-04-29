import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [exchanging, setExchanging] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [exchangeError, setExchangeError] = useState(null);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (!code) {
        setExchangeError('Invalid or expired reset link. Request a new one.');
        setExchanging(false);
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setExchangeError('Reset link expired or already used. Request a new one.');
      } else {
        setSessionReady(true);
      }
      setExchanging(false);
    };
    run();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Sign out all sessions so old password can't be reused anywhere
    await supabase.auth.signOut({ scope: 'global' });
    setDone(true);
  };

  if (exchanging) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (exchangeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Link invalid</h1>
          <p className="text-sm text-muted-foreground mb-6">{exchangeError}</p>
          <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">Request new reset link</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Password updated</h1>
          <p className="text-sm text-muted-foreground mb-6">Your password has been changed. Log in with your new password.</p>
          <Link to="/login" className="text-sm text-primary font-medium hover:underline">Go to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Choose a new password</h1>
        <p className="text-sm text-muted-foreground mb-6">Must be at least 8 characters.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Confirm password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-foreground text-white rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      </div>
    </div>
  );
}
