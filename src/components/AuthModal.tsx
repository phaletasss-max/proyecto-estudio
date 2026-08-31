import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Shield, Terminal, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isOnline = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(username || email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onClose();
        }
      } else {
        if (!username || !email) {
          setErrorMsg('Por favor ingresa tu usuario y correo');
          setIsSubmitting(false);
          return;
        }
        if (isOnline && !password) {
          setErrorMsg('Ingresa una contraseña para crear tu cuenta.');
          setIsSubmitting(false);
          return;
        }
        const res = await register(username, email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onClose();
        }
      }
    } catch {
      setErrorMsg('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickGuest = async (demoName: string) => {
    setIsSubmitting(true);
    await login(demoName);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Ambient Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-indigo-500 rounded-b-full blur-sm" />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-xl border transition-colors ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white bg-slate-900' : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-[Orbitron] tracking-wide flex items-center gap-2">
                SHADOW<span className="text-purple-500">AUTH</span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {mode === 'login' ? 'Acceso al Hub de Ciberseguridad' : 'Registro de Nuevo Hacker'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className={`grid grid-cols-2 p-1 rounded-2xl border mb-6 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono mb-1 text-slate-400">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Manuel Phaletass"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border font-mono focus:outline-none transition-colors ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono mb-1 text-slate-400">
                {mode === 'login' ? 'Usuario o Correo' : 'Username / Alias Hacker *'}
              </label>
              <div className="relative">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={mode === 'login' ? 'phaletas_max o tu@correo.pe' : 'ej: cyber_hacker_22'}
                  required
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border font-mono focus:outline-none transition-colors ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono mb-1 text-slate-400">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alumno@senati.pe"
                    required
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border font-mono focus:outline-none transition-colors ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono mb-1 text-slate-400">
                Contraseña {isOnline ? '*' : '(opcional en demo)'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required={isOnline}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border font-mono focus:outline-none transition-colors ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/25 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar a ShadowBytes' : 'Crear mi Perfil Hacker'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {!isOnline && (
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] font-mono text-slate-500 mb-2">⚡ Acceso rápido para la demo local:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickGuest('phaletas_max')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                >
                  👤 Manuel (demo)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGuest('mrpacay')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                >
                  👤 mrpacay
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
