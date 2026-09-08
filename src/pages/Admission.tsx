import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, KeyRound, LockKeyhole, LogIn, ShieldCheck, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLabs } from '@/hooks/useLabs';
import { useTheme } from '@/context/ThemeContext';
import { AuthModal } from '@/components/AuthModal';

export const Admission: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { labs, loading, error, refetch } = useLabs({ admissionOnly: true });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isDark = theme === 'dark';
  const admissionLab = labs[0];
  const isMember = user?.accessStatus === 'member' || user?.accessStatus === 'admin';

  return (
    <section className="min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative overflow-hidden rounded-xl border p-7 sm:p-10 ${
          isDark ? 'border-purple-500/25 bg-slate-950' : 'border-purple-200 bg-white shadow-sm'
        }`}>
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-mono font-bold text-purple-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                ACCESO DE MIEMBROS
              </div>
              <h1 className={`mt-5 text-3xl font-black tracking-tight sm:text-5xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Valida tus fundamentos. <span className="text-purple-500">Accede a nuevos desafíos.</span>
              </h1>
              <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                ShadowBytes es una comunidad de ciberseguridad con formación práctica y desafíos CTF. Puedes explorar las rutas y el catálogo sin completar este reto. Resuelve el CTF de acceso para activar la membresía y desbloquear laboratorios reservados.
              </p>

<Link to="/paths" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-purple-500">Explorar rutas <ArrowRight className="h-4 w-4" /></Link>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ['1', 'Crea tu cuenta', 'Tu progreso queda asociado a tu perfil.'],
                  ['2', 'Resuelve el CTF', 'Analiza las evidencias, no memorices respuestas.'],
                  ['3', 'Obtén acceso', 'La flag válida te acredita como miembro.'],
                ].map(([number, title, copy]) => (
                  <div key={number} className={`rounded-lg border p-4 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
                    <span className="font-mono text-xs font-black text-purple-400">0{number}</span>
                    <h2 className={`mt-2 text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className={`rounded-xl border p-6 ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'}`}>
              {!isAuthenticated ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400"><LogIn className="h-6 w-6" /></div>
                  <p className="mt-5 text-xs font-mono font-bold text-cyan-400">PASO 1 DE 3</p>
                  <h2 className={`mt-2 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Crea tu cuenta primero.</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">Así podremos guardar tus puntos, retos resueltos y el acceso que obtengas al completar la admisión.</p>
                  <button onClick={() => setAuthModalOpen(true)} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-bold text-white transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    Crear cuenta o ingresar <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">Después volverás aquí para iniciar el CTF de acceso.</p>
                </>
              ) : isMember ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400"><Check className="h-6 w-6" /></div>
                  <p className="mt-5 text-xs font-mono font-bold text-emerald-400">MEMBRESÍA ACTIVA</p>
                  <h2 className={`mt-2 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tu acceso de miembro está activo.</h2>
                  <p className="mt-2 text-sm text-slate-400">Continúa con los retos privados y comparte tus avances con el equipo.</p>
                  <Link to="/labs" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-400">
                    Ver labs de miembros <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : loading ? (
                <div className="flex min-h-64 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" /></div>
              ) : error ? (
                <div role="alert">
                  <h2 className="text-lg font-bold">No se pudo cargar el CTF de acceso</h2>
                  <p className="mt-2 text-sm text-slate-400">Inténtalo de nuevo en unos momentos. Puedes seguir explorando las rutas.</p>
                  <button type="button" onClick={() => void refetch()} className="mt-4 min-h-11 rounded-lg bg-purple-600 px-4 text-sm font-semibold text-white">Reintentar</button>
                </div>
              ) : admissionLab ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400"><Trophy className="h-6 w-6" /></div>
                  <p className="mt-5 text-xs font-mono font-bold text-amber-400">CTF DE ACCESO DISPONIBLE</p>
                  <h2 className={`mt-2 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{admissionLab.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{admissionLab.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-mono text-slate-400"><KeyRound className="h-3.5 w-3.5 text-purple-400" /> {admissionLab.points || 100} puntos • acceso automático</div>
                  <Link to={`/lab/${admissionLab.slug}`} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-bold text-white transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    Iniciar reto <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <LockKeyhole className="h-10 w-10 text-slate-500" />
                  <h2 className={`mt-5 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>CTF de acceso en preparación</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">El reto de acceso todavía no está disponible. Mientras tanto, explora las rutas y los laboratorios públicos.</p>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode="register" />
    </section>
  );
};

export default Admission;
