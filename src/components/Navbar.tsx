import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-logo text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Plan Estudios
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SENATI • 4.º Ciclo
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contacto"
              className="relative group overflow-hidden rounded-full p-[1px] font-medium text-sm focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full transition-all duration-300 group-hover:opacity-100 opacity-70 animate-pulse-slow" />
              <span className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-slate-950 text-white transition-all duration-300 group-hover:bg-slate-900">
                <span>Únete</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
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
            className="md:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-5 pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-base shadow-lg shadow-blue-600/30"
                >
                  <span>Únete al Grupo</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
