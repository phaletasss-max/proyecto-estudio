import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: 'Inicio', href: '#inicio' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Metodología', href: '#metodologia' },
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? isDark
            ? 'bg-slate-950/95 border-b border-slate-800 shadow-lg py-3'
            : 'bg-white/95 border-b border-slate-200 shadow-md py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo: ShadowBytes Official Emblem */}
          <a
            href="#inicio"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo-shadowbytes.png"
                alt="ShadowBytes Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center font-bold tracking-tight text-xl sm:text-2xl select-none">
                <span className={isDark ? 'text-white font-[Orbitron]' : 'text-slate-950 font-[Orbitron]'}>SHADOW</span>
                <span className="text-purple-500 font-[Orbitron]">BYTES</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase font-semibold -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                APRENDER • COMPARTIR • CREAR • PROTEGER
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions: Theme Toggle + Join Button */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50 shadow-md'
                  : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-100 hover:border-indigo-300 shadow-sm'
              }`}
              title={isDark ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="#contacto"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white text-sm font-medium tracking-wide hover:bg-purple-500 transition-all shadow-md hover:shadow-purple-500/30 active:scale-95 group"
            >
              <span>Únete</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          {/* Mobile Menu Button + Mobile Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border text-sm ${
                isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-indigo-600'
              }`}
              aria-label="Toggle Theme Mobile"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 border-b border-slate-200 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-5 pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-medium text-base shadow-md"
                >
                  <span>Únete al Grupo</span>
                  <ArrowUpRight className="w-5 h-5 text-cyan-400" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
