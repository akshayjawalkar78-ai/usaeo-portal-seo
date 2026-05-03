import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { easeOut, easeDrawer } from '@/lib/motion';

const competitionsLinks = [
  { label: 'Overview', to: '/competitions' },
  { label: 'Quiz Bowl', to: '/competitions/quiz-bowl' },
  { label: 'Essay Competition', to: '/competitions/essay' },
  { label: 'National Finals', to: '/competitions/finals' },
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
      initial={{ opacity: 0, transform: 'translate3d(0,-4px,0) scale(0.97)' }}
      animate={{ opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }}
      exit={{ opacity: 0, transform: 'translate3d(0,-4px,0) scale(0.97)' }}
      transition={{ duration: 0.18, ease: easeOut }}
      style={{ transformOrigin: 'top left', marginTop: '4px' }}
      className="absolute top-full left-0 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
    >
      {links.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors duration-fast ease-out duration-fast ease-out"
        >
          {link.label}
        </Link>
      ))}
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-base ease-out ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-white/80 backdrop-blur-sm border-b border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-7 w-7" />
            <span className="font-inter font-semibold text-foreground text-sm tracking-tight">USAEO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/about" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">About</Link>

            {/* Competitions Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('competitions')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">
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
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">
                Programs <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'programs' && (
                  <DropdownMenu links={programsLinks} onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>
            </div>

            <Link to="/team" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">Team</Link>
            <Link to="/partners" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">Partners</Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin"
                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">
                    Admin
                  </Link>
                )}
                <span className="px-2 text-sm text-muted-foreground hidden lg:inline">
                  {profile?.full_name || profile?.email}
                </span>
                <button onClick={handleLogout}
                  className="px-4 py-1.5 text-sm bg-foreground text-white rounded-full font-medium hover:bg-foreground/85 transition-colors duration-fast ease-out">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast ease-out">
                  Log in
                </Link>
                <Link to="/register"
                  className="px-4 py-1.5 text-sm bg-foreground text-white rounded-full font-medium hover:bg-foreground/85 transition-colors duration-fast ease-out">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-3 text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, transform: 'translate3d(0,-8px,0)' }}
            animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            exit={{ opacity: 0, transform: 'translate3d(0,-8px,0)' }}
            transition={{ duration: 0.32, ease: easeDrawer }}
            className="fixed inset-0 z-40 bg-white pt-14 overflow-y-auto"
          >
            <div className="p-5 flex flex-col divide-y divide-border">
              <Link to="/about" className="py-3.5 text-base text-foreground font-medium">About</Link>

              {/* Competitions collapsible */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'competitions' ? null : 'competitions')}
                  className="w-full flex items-center justify-between py-3.5 text-base text-foreground font-medium"
                >
                  Competitions
                  <motion.span animate={{ rotate: mobileExpanded === 'competitions' ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'competitions' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-4 flex flex-col gap-0.5">
                        {competitionsLinks.map((link) => (
                          <Link key={link.label} to={link.to} className="py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-fast ease-out">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Programs collapsible */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'programs' ? null : 'programs')}
                  className="w-full flex items-center justify-between py-3.5 text-base text-foreground font-medium"
                >
                  Programs
                  <motion.span animate={{ rotate: mobileExpanded === 'programs' ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'programs' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-4 flex flex-col gap-0.5">
                        {programsLinks.map((link) => (
                          <Link key={link.label} to={link.to} className="py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-fast ease-out">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/team" className="py-3.5 text-base text-foreground font-medium">Team</Link>
              <Link to="/partners" className="py-3.5 text-base text-foreground font-medium">Partners</Link>

              <div className="pt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="w-full text-center py-3 border border-border rounded-full font-medium text-foreground">
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="w-full text-center py-3 border border-border rounded-full font-medium text-foreground">
                        Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-center py-3 bg-foreground text-white rounded-full font-medium">
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full text-center py-3 border border-border rounded-full font-medium text-foreground">
                      Log in
                    </Link>
                    <Link to="/register" className="w-full text-center py-3 bg-primary text-white rounded-full font-medium">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
