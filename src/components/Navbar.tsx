import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Trophy, Compass, Award, Upload, BookOpen, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { UserNavbarBadge } from '@/components/UserNavbarBadge';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Admisión', href: '/admission', icon: ShieldCheck },
    { name: 'Labs', href: '/labs', icon: Trophy },
    { name: 'Rutas', href: '/paths', icon: Compass },
    { name: 'Cheatsheets', href: '/cheatsheets', icon: BookOpen },
    { name: 'Ranking', href: '/leaderboard', icon: Trophy },
    { name: 'Logros', href: '/achievements', icon: Award },
    { name: 'Subir', href: '/upload', icon: Upload },
  ];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const primaryLinks = navLinks.slice(0, 4);
  const secondaryLinks = navLinks.slice(4);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? isDark
            ? 'bg-slate-950/95 border-b border-slate-800 shadow-lg py-2.5'
            : 'bg-white/95 border-b border-slate-200 shadow-md py-2.5'
          : 'bg-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo: ShadowBytes Official Emblem */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform border border-purple-500/30">
              <img
                src="/logo-shadowbytes.png"
                alt="ShadowBytes Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center font-bold tracking-tight text-lg sm:text-xl select-none">
                <span className={isDark ? 'text-white font-[Orbitron]' : 'text-slate-950 font-[Orbitron]'}>SHADOW</span>
                <span className="text-purple-500 font-[Orbitron]">BYTES</span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-purple-400 uppercase font-semibold -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                CTF & LABS PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full border ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
          }`}>
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? isDark
                      ? 'bg-purple-600/25 text-purple-300 font-bold shadow-sm'
                      : 'bg-purple-100 text-purple-700 font-bold'
                    : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-white'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen((open) => !open)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="menu"
                className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 ${
                  secondaryLinks.some((link) => isActive(link.href))
                    ? isDark ? 'bg-purple-600/25 text-purple-300 font-bold shadow-sm' : 'bg-purple-100 text-purple-700 font-bold'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-white hover:text-slate-950'
                }`}
              >
                Más
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreMenuOpen && (
                <div role="menu" className={`absolute right-0 top-full mt-2 w-44 rounded-2xl border p-1.5 shadow-xl ${
                  isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
                }`}>
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      role="menuitem"
                      onClick={() => setMoreMenuOpen(false)}
                      className={`flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-mono font-medium transition-colors ${
                        isActive(link.href)
                          ? isDark ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                          : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      {link.icon && <link.icon className="h-3.5 w-3.5 text-purple-400" />}
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions: Theme Toggle + User Badge */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50 shadow-md'
                  : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-100 hover:border-indigo-300 shadow-sm'
              }`}
              title={isDark ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Navbar Badge */}
            <UserNavbarBadge />
          </div>

          {/* Mobile Menu Button + Mobile User / Theme Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <UserNavbarBadge />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`lg:hidden border-b backdrop-blur-2xl overflow-hidden ${
              isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'
            }`}
          >
            <div className="px-5 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-mono font-medium transition-colors ${
                    isActive(link.href)
                      ? isDark
                        ? 'bg-purple-600/20 text-purple-300 font-bold'
                        : 'bg-purple-100 text-purple-700 font-bold'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-900'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400">Modo de Pantalla:</span>
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono ${
                    isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-indigo-600'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? 'Claro' : 'Oscuro'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
