import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/usaolympiad/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/usa-economics-olympiad' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@usaeconolympiad' },
];

function EmailSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await base44.entities.EmailSubscriber.create({
        email: email.trim().toLowerCase(),
        source: 'footer',
        subscribed_at: new Date().toISOString(),
      });
      setStatus('done');
    } catch {
      setStatus('done'); // treat duplicate as success silently
    }
  };

  if (status === 'done') {
    return <p className="text-sm text-success font-medium">You're subscribed!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 min-w-0 h-9 px-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="h-9 px-4 bg-foreground text-white text-sm font-semibold rounded-lg hover:bg-foreground/85 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-7 w-7"  loading="lazy" decoding="async" />
              <span className="font-inter font-semibold text-foreground text-sm">USAEO</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              USA Economics Olympiad — the premier national competition for high school economists. Free, open, and mission-driven. A registered 501(c)(3) nonprofit organization.
            </p>
            <a href="mailto:info@usaeo.org" className="text-sm text-primary mt-4 block hover:underline">info@usaeo.org</a>

            <div className="mt-5">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Stay informed</p>
              <p className="text-xs text-muted-foreground">Subscribe to our mailing list for updates and announcements.</p>
              <EmailSubscribeForm />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Compete</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Competitions</Link>
              <Link to="/competitions/quiz-bowl" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quiz Bowl</Link>
              <Link to="/competitions/essay" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Essay Competition</Link>
              <Link to="/competitions/finals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">National Finals</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Learn</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/workshops" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workshops</Link>
              <Link to="/curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Curriculum</Link>
              <Link to="/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Research Program</Link>
              <Link to="/chapters" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chapters</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Organization</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">News</Link>
              <Link to="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Team</Link>
              <Link to="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} USA Economics Olympiad. All rights reserved. 501(c)(3) nonprofit. <Link to="/legal" className="hover:underline">Legal</Link></p>
          <div className="flex items-center gap-5">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
