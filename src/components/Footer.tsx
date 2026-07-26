import React from 'react';
import { ArrowUp, UserCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-200 bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ShadowBytes
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-mono border border-blue-500/30">
                4.º ciclo
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Comunidad colaborativa de estudiantes de SENATI enfocados en desarrollo web, servidores DNS, Active Directory, CTFs y ciberseguridad.
            </p>
          </div>

          {/* Instructor Credit */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Instructor del Curso
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Victor Kenky Rodriguez Lopez
              </span>
            </div>
          </div>

          {/* Back to top */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Volver arriba"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-4 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} ShadowBytes SENATI. Todos los derechos reservados.
          </p>
          <p className="flex items-center justify-center gap-1 text-slate-400">
            <span>Desarrollado con</span>
            <span className="text-rose-500">♥</span>
            <span>para el 4.º ciclo de SENATI</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
