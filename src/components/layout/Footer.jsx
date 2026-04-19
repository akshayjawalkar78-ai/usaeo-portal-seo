import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16 flex flex-col items-center text-center gap-10">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://www.usaeo.org/USAEOlogo.png" alt="USAEO" className="h-7 w-7" />
            <span className="font-inter font-semibold text-foreground text-sm">USAEO</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            The United States Economics Olympiad — the premier national competition for high school economists. Free, open, and mission-driven.
          </p>
          <a href="mailto:info@usaeo.org" className="text-sm text-primary hover:underline">info@usaeo.org</a>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <Link to="/competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Competitions</Link>
          <Link to="/competitions/ieo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">IEO</Link>
          <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Register</a>
          <Link to="/workshops" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workshops</Link>
          <Link to="/curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Curriculum</Link>
          <Link to="/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Research</Link>
          <Link to="/chapters" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chapters</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Team</Link>
          <Link to="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-5">
            {['Instagram', 'LinkedIn', 'TikTok'].map((s) => (
              <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{s}</a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} United States Economics Olympiad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
