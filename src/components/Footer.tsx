import React from 'react';
import { ShieldCheck, ArrowUp, UserCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const repoUrl = 'https://github.com/phaletasss-max/proyecto-estudio';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-logo text-2xl font-bold text-white tracking-tight">
                Plan Estudios SENATI
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                4.º ciclo
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Comunidad colaborativa de estudiantes de SENATI enfocados en desarrollo web, servidores DNS, Active Directory y ciberseguridad.
            </p>
          </div>

          {/* Instructor Credit */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Instructor del Curso
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Victor Kenky Rodriguez Lopez
              </span>
            </div>
          </div>

          {/* Repository Link & Back to top */}
          <div className="flex items-center gap-4">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition-all shadow-md group"
            >
              <svg className="w-4 h-4 text-slate-300 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Repositorio GitHub</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Volver arriba"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Plan Estudios SENATI. Todos los derechos reservados.
          </p>
          <p className="flex items-center justify-center gap-1 text-slate-500">
            <span>Desarrollado con</span>
            <span className="text-rose-500">♥</span>
            <span>para el 4.º ciclo de SENATI</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
