import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, CheckCircle2, Mail, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { isDemoModeEnabled, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { authErrorMessage } from '@/lib/authErrors';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [resendAfter, setResendAfter] = useState(0);
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const { login, register, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const online = isSupabaseConfigured();
  const demo = isDemoModeEnabled();
  const enabled = online || demo;
  const dark = theme === 'dark';

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => { dialog.current?.close(); previous?.focus(); };
  }, [isOpen]);
  useEffect(() => { if (isOpen && isAuthenticated) close.current(); }, [isOpen, isAuthenticated]);
  useEffect(() => {
    if (resendAfter <= 0) return;
    const timer = setTimeout(() => setResendAfter(resendAfter - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendAfter]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); setNotice(''); setSubmitting(true);
    try {
      const result = mode === 'login'
        ? await login(email.trim(), password)
        : await register(username, email.trim(), password, fullName.trim());
      if (result.error) setError(authErrorMessage(result.error));
      else if ('requiresEmailConfirmation' in result && result.requiresEmailConfirmation) {
        setConfirmationEmail(email.trim()); setPassword(''); setResendAfter(60);
      } else onClose();
    } catch { setError('No pudimos conectar. Comprueba tu conexión e inténtalo de nuevo.'); }
    finally { setSubmitting(false); }
  };

  const resend = async () => {
    if (resendAfter || submitting) return;
    setSubmitting(true); setError(''); setNotice('');
    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: confirmationEmail, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
      if (resendError) setError(authErrorMessage(resendError.message));
      else { setNotice('Solicitud enviada. Revisa también Spam y Promociones.'); setResendAfter(60); }
    } catch { setError('No se pudo reenviar el correo. Inténtalo de nuevo.'); }
    finally { setSubmitting(false); }
  };

  const field = `mt-1 min-h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 ${dark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`;
  if (!isOpen) return null;
  return createPortal(<dialog ref={dialog} aria-labelledby="auth-title" onCancel={() => close.current()} className={`m-auto w-[calc(100%_-_2rem)] max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl border p-6 shadow-2xl backdrop:bg-black/75 ${dark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
    <button type="button" aria-label="Cerrar acceso" onClick={onClose} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-500/15"><X size={20} /></button>
    <p className="mb-3 text-xs font-bold tracking-widest text-violet-400">SHADOWBYTES</p>
    <h2 id="auth-title" className="pr-8 text-2xl font-bold">{confirmationEmail ? 'Confirma tu correo' : mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
    {confirmationEmail ? <div className="mt-5 space-y-4">
      <Mail className="h-9 w-9 text-violet-400" />
      <p className="text-sm leading-6">Revisa <strong className="break-all">{confirmationEmail}</strong> y abre el enlace de confirmación de ShadowBytes. Después podrás guardar tus laboratorios resueltos.</p>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6"><li>Busca el correo de confirmación; revisa también Spam.</li><li>Abre el enlace una sola vez. Volverás a tu panel.</li><li>Si lo abres en otro navegador, regresa aquí e inicia sesión.</li></ol>
      <button type="button" onClick={() => { setMode('login'); setConfirmationEmail(''); setError(''); setNotice(''); }} className="min-h-11 w-full rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white">Ya confirmé: iniciar sesión</button>
      <button type="button" onClick={resend} disabled={submitting || resendAfter > 0} className="min-h-11 w-full rounded-lg border border-slate-500 text-sm disabled:opacity-50">{submitting ? 'Enviando…' : resendAfter ? `Reenviar en ${resendAfter} s` : 'Reenviar confirmación'}</button>
      <button type="button" onClick={() => { setConfirmationEmail(''); setError(''); }} className="min-h-11 w-full text-sm underline">Corregir dirección de correo</button>
    </div> : <>
      <p className="mt-2 text-sm leading-6 text-slate-400">{mode === 'login' ? 'Accede con el correo que usaste al registrarte.' : 'Empieza con las rutas abiertas. Tus puntos CTF se guardan al validar respuestas.'}</p>
      <div className="my-5 grid grid-cols-2 gap-2" aria-label="Tipo de acceso">{(['login','register'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setError(''); }} className={`min-h-10 rounded-lg text-sm ${mode === value ? 'bg-violet-600 text-white' : 'border border-slate-500'}`}>{value === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>)}</div>
      {!enabled && <p role="alert" className="mb-4 rounded-lg border border-amber-500/40 p-3 text-sm">El acceso no está disponible temporalmente. Puedes seguir leyendo las rutas abiertas.</p>}
      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && <><div><label htmlFor="auth-name" className="text-sm">Nombre para mostrar <span className="text-slate-400">(opcional)</span></label><input id="auth-name" value={fullName} onChange={e=>setFullName(e.target.value)} maxLength={80} autoComplete="nickname" className={field} /></div>
        <div><label htmlFor="auth-username" className="text-sm">Nombre de usuario</label><input id="auth-username" value={username} onChange={e=>setUsername(e.target.value)} pattern="[a-zA-Z0-9_]{3,28}" minLength={3} maxLength={28} required autoComplete="username" aria-describedby="username-help" className={field} /><p id="username-help" className="mt-1 text-xs text-slate-400">Entre 3 y 28 letras, números o guion bajo. Será público.</p></div></>}
        <div><label htmlFor="auth-email" className="text-sm">Correo electrónico</label><input autoFocus id="auth-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" className={field} /></div>
        <div><label htmlFor="auth-password" className="text-sm">Contraseña</label><input id="auth-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required={online} minLength={mode === 'register' && online ? 8 : undefined} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} aria-describedby={mode === 'register' ? 'password-help' : undefined} className={field} />{mode === 'register' && <p id="password-help" className="mt-1 text-xs text-slate-400">Usa al menos 8 caracteres y una contraseña exclusiva para esta cuenta.</p>}</div>
        <button type="submit" disabled={submitting || !enabled} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-50">{submitting ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta y confirmar correo'}<ArrowRight size={16} /></button>
      </form>
    </>}
    {error && <p role="alert" className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">{error}</p>}
    {notice && <p role="status" className="mt-4 flex gap-2 text-sm"><CheckCircle2 size={18} />{notice}</p>}
  </dialog>, document.body);
}
