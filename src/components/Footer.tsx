import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`relative z-10 border-t py-12 transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 border-slate-800 text-white'
        : 'bg-slate-100 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>

          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/logo-shadowbytes.webp"
                  width="36"
                  height="36"
                  alt="ShadowBytes Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-2xl font-bold tracking-tight font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                SHADOW<span className="text-purple-500">BYTES</span>
              </span>
            </div>
            <p className="text-xs font-mono text-purple-500 tracking-wider font-semibold">
              APRENDER • COMPARTIR • CREAR • PROTEGER
            </p>
            <p className={`text-xs max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Comunidad de ciberseguridad. Laboratorios, CTF y conocimiento técnico compartido.
            </p>
          </div>

          {/* Social Links & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href="https://chat.whatsapp.com/GQLxp8a8dVh3c3Z6POW1CU"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-500 text-xs font-mono font-semibold transition-all"
            >
              WhatsApp
            </a>
            <a
              href="https://discord.gg/MPRzx6UHM"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-500 text-xs font-mono font-semibold transition-all"
            >
              Discord
            </a>
            <button
              onClick={scrollToTop}
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
              title="Volver arriba"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4 text-center sm:text-left ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <p className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ShadowBytes. Todos los derechos reservados.</span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] border border-purple-500/20">
              Hub de CTF Writeups & Labs
            </span>
          </p>
          <p className={`flex items-center justify-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Seguridad · Práctica · Comunidad</span>

          </p>
        </div>

      </div>
    </footer>
  );
};
