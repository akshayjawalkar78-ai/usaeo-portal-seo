import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useNotification } from '@/lib/NotificationContext';
import { base44 } from '@/api/base44Client';

export function AnnouncementNotifBar() {
  const { showNotifBar, dismissNotifBar } = useNotification();
  if (!showNotifBar) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-primary text-white flex items-center justify-center gap-4 text-sm px-10">
      <span className="font-medium hidden sm:inline">Quiz Bowl &amp; Essay Challenge are now open —</span>
      <span className="font-medium sm:hidden">Competitions open —</span>
      <div className="flex items-center gap-3">
        <Link to="/register/quiz-bowl" className="flex items-center gap-1 font-semibold hover:underline whitespace-nowrap">
          Quiz Bowl <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <span className="opacity-50">·</span>
        <Link to="/register/essay" className="flex items-center gap-1 font-semibold hover:underline whitespace-nowrap">
          Essay <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <button onClick={dismissNotifBar} className="absolute right-3 p-1.5 hover:bg-white/20 rounded-md transition-colors" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function EmailSubBar() {
  const { showEmailBar, dismissEmailBar } = useNotification();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!showEmailBar) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await base44.entities.EmailSubscriber.create({
        email: email.trim().toLowerCase(),
        source: 'notification-bar',
        subscribed_at: new Date().toISOString(),
      });
      setSubmitted(true);
      setTimeout(dismissEmailBar, 2500);
    } catch {
      // silently dismiss on error (duplicate email etc)
      setSubmitted(true);
      setTimeout(dismissEmailBar, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-foreground text-white flex items-center justify-center gap-3 text-sm px-10">
      {submitted ? (
        <span className="font-medium">You're subscribed!</span>
      ) : (
        <>
          <span className="font-medium hidden sm:inline">Stay informed —</span>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-6 px-2.5 rounded text-xs text-foreground bg-white border-0 focus:outline-none focus:ring-1 focus:ring-white/50 w-44 sm:w-52"
            />
            <button type="submit" disabled={loading}
              className="h-6 px-3 bg-primary text-white text-xs font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-60">
              Subscribe
            </button>
          </form>
        </>
      )}
      <button onClick={dismissEmailBar} className="absolute right-3 p-1.5 hover:bg-white/20 rounded-md transition-colors" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
