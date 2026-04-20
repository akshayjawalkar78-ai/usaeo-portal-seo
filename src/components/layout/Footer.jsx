import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="https://www.usaeo.org/USAEOlogo.png" alt="USAEO" className="h-7 w-7" />
              <span className="font-inter font-semibold text-foreground text-sm">USAEO</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The United States Economics Olympiad — the premier national competition for high school economists. Free, open, and mission-driven.
            </p>
            <a href="mailto:info@usaeo.org" className="text-sm text-primary mt-4 block hover:underline">info@usaeo.org</a>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Compete</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Competitions</Link>
              <Link to="/competitions/ieo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">IEO</Link>
              <a href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Register</a>
              <a href="https://usaeo.org/testing" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testing Portal</a>
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
              <Link to="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Team</Link>
              <Link to="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} United States Economics Olympiad. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {['Instagram', 'LinkedIn', 'TikTok'].map((s) => (
              <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
