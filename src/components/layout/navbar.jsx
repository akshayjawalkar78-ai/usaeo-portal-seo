import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const competitionsLinks = [
  { label: 'Overview', to: '/competitions' },
  { label: 'National Qualifiers', to: '/competitions/qualifiers' },
  { label: 'National Finals', to: '/competitions/finals' },
  { label: 'International Economics Olympiad', to: '/competitions/ieo' },
];

const programsLinks = [
  { label: 'Workshops', to: '/workshops' },
  { label: 'Curriculum', to: '/curriculum' },
  { label: 'Research Program', to: '/research' },
  { label: 'Chapter Program', to: '/chapters' },
];

function DropdownMenu({ links, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
      style={{ marginTop: '-4px', paddingTop: '4px' }}
    >
      <div className="rounded-xl overflow-hidden border border-border">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={onClose}
            className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="https://www.usaeo.org/USAEOlogo.png" alt="USAEO" className="h-7 w-7" />
            <span className="font-inter font-semibold text-foreground text-sm tracking-tight">USAEO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/about" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>

            {/* Competitions Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('competitions')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Competitions <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'competitions' && (
                  <DropdownMenu links={competitionsLinks} onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>
            </div>

            {/* Programs Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('programs')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Programs <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'programs' && (
                  <DropdownMenu links={programsLinks} onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>
            </div>

            <Link to="/team" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Team</Link>
            <Link to="/partners" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
              className="px-4 py-1.5 text-sm bg-foreground text-white rounded-full font-medium hover:bg-foreground/85 transition-colors">
              Register
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-14"
          >
            <div className="p-5 flex flex-col gap-1 divide-y divide-border">
              {[
                { label: 'About', to: '/about' },
                { label: 'Competitions', to: '/competitions' },
                { label: 'IEO', to: '/competitions/ieo' },
                { label: 'Workshops', to: '/workshops' },
                { label: 'Curriculum', to: '/curriculum' },
                { label: 'Research', to: '/research' },
                { label: 'Chapters', to: '/chapters' },
                { label: 'Team', to: '/team' },
                { label: 'Partners', to: '/partners' },
              ].map((link) => (
                <Link key={link.label} to={link.to} className="py-3 text-base text-foreground font-medium">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
                  className="w-full text-center py-3 bg-primary text-white rounded-full font-medium">
                  Register Now — Free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
