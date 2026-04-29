import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const redirectTo = `${import.meta.env.VITE_APP_URL || window.location.origin}/auth/reset-password`;
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
    setSubmitting(false);
    // Always show success — never reveal whether email exists
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, a password reset link has been sent. Check your spam folder if you don't see it.
          </p>
          <Link to="/login" className="text-sm text-primary font-medium hover:underline">Back to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send a reset link.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-foreground text-white rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Remembered it? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
