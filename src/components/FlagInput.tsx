import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, XCircle } from 'lucide-react';
import { checkHoneypot } from '@/utils/honeypot';
import { cyberAudio } from '@/utils/audio';
import { useTheme } from '@/context/ThemeContext';

interface FlagInputProps {
  onSubmit: (flag: string) => Promise<{ accepted: boolean; alreadySolved: boolean; message?: string }>;
  onUnlocked?: () => void;
  disabled?: boolean;
}

export const FlagInput: React.FC<FlagInputProps> = ({ onSubmit, onUnlocked, disabled = false }) => {
  const { theme } = useTheme();
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isChecking, setIsChecking] = useState(false);
  const [isHoneypot, setIsHoneypot] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim() || disabled || isChecking || status === 'success') return;

    setIsChecking(true);
    setStatus('idle');
    setIsHoneypot(false);
    setFeedback('');

    try {
      const isTrap = await checkHoneypot(flag);
      if (isTrap) {
        setIsHoneypot(true);
        setFeedback('La entrada activó una protección del reto. Usa únicamente la flag encontrada.');
        setStatus('error');
        setIsChecking(false);
        return;
      }

      const result = await onSubmit(flag);
      const isValid = result.accepted;
      
      if (isValid) {
        setStatus('success');
        setFeedback(result.alreadySolved ? 'Esta flag ya estaba acreditada en tu perfil.' : '¡Flag correcta! Progreso acreditado.');
        cyberAudio.playSuccessChirp();
        if (onUnlocked) onUnlocked();
      } else {
        setStatus('error');
        setFeedback(result.message || 'Flag incorrecta. Sigue intentando.');
        cyberAudio.playErrorGlitch();
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error al verificar la flag:', error);
      setStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto rounded-xl overflow-hidden border ${
      theme === 'dark' ? 'bg-[#0d1117] border-gray-800' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className={`px-4 py-2 border-b flex items-center gap-2 ${
        theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-100'
      }`}>
        <Terminal className={`w-4 h-4 ${theme === 'dark' ? 'text-green-500' : 'text-gray-500'}`} />
        <span className={`text-xs font-mono font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          FLAG_SUBMISSION_TERMINAL
        </span>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="relative">
          <motion.div
            animate={status === 'error' ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex relative"
          >
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold ${
              theme === 'dark' ? 'text-green-500' : 'text-blue-600'
            }`}>
              {'>'}
            </div>
            
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              disabled={disabled || isChecking || status === 'success'}
              placeholder="HTB{...}"
              aria-label="Flag encontrada"
              aria-describedby="flag-format flag-feedback"
              className={`w-full pl-10 pr-32 py-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                theme === 'dark'
                  ? 'bg-gray-900/50 text-green-400 placeholder-gray-600 border-gray-700 focus:ring-green-500 focus:border-transparent'
                  : 'bg-white text-gray-800 placeholder-gray-400 border-gray-300 focus:ring-blue-500 focus:border-transparent'
              } border ${status === 'error' ? 'border-red-500 ring-1 ring-red-500' : ''} ${
                status === 'success' ? 'border-green-500 ring-1 ring-green-500' : ''
              }`}
              autoComplete="off"
              spellCheck="false"
            />
            
            <button
              type="submit"
              disabled={disabled || isChecking || !flag.trim() || status === 'success'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md font-mono text-sm font-bold transition-all ${
                status === 'success'
                  ? 'bg-green-500 text-white'
                  : status === 'error'
                  ? 'bg-red-500 text-white'
                  : theme === 'dark'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:hover:bg-green-500/20 disabled:hover:text-green-400'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-blue-100 disabled:hover:text-blue-700'
              }`}
            >
              {isChecking ? 'Verificando…' : status === 'success' ? 'Resuelto' : 'Enviar'}
            </button>
          </motion.div>
          <p id="flag-format" className={`mt-3 text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Pega la flag en el formato indicado por el reto. Se validará de forma segura y tu avance quedará registrado.
          </p>
        </form>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              id="flag-feedback"
              role="status"
              className="mt-4 flex items-center gap-2 text-green-500 font-mono text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{feedback || '¡Flag correcta! Máquina pwned.'}</span>
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              id="flag-feedback"
              role="alert"
              className="mt-4 flex items-center gap-2 text-red-500 font-mono text-sm"
            >
              <XCircle className="w-4 h-4" />
              <span>{feedback || (isHoneypot ? '¡Intento de ataque detectado! (Honeypot)' : 'Flag incorrecta. Sigue intentando.')}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
