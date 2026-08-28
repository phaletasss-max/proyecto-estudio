import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCw, Copy, Check, Clock, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MachineSpawnerProps {
  labSlug: string;
  defaultIp?: string;
}

export const MachineSpawner: React.FC<MachineSpawnerProps> = ({ labSlug, defaultIp = '10.10.184.72' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isRunning, setIsRunning] = useState(false);
  const [targetIp, setTargetIp] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(7200); // 2 hours
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Storage key for persistence
  const storageKey = `sb_machine_${labSlug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.expiresAt > Date.now()) {
          setIsRunning(true);
          setTargetIp(data.ip);
          setSecondsRemaining(Math.floor((data.expiresAt - Date.now()) / 1000));
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setTargetIp(null);
          localStorage.removeItem(storageKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, storageKey]);

  const handleStartMachine = () => {
    setIsStarting(true);
    setTimeout(() => {
      const ip = defaultIp || `10.10.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 250 + 2)}`;
      const expiresAt = Date.now() + 7200 * 1000;
      localStorage.setItem(storageKey, JSON.stringify({ ip, expiresAt }));
      setTargetIp(ip);
      setSecondsRemaining(7200);
      setIsRunning(true);
      setIsStarting(false);
    }, 1500);
  };

  const handleStopMachine = () => {
    setIsRunning(false);
    setTargetIp(null);
    localStorage.removeItem(storageKey);
  };

  const handleExtend = () => {
    setSecondsRemaining((prev) => prev + 3600); // +1 hour
  };

  const handleCopyIp = () => {
    if (targetIp) {
      navigator.clipboard.writeText(targetIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-lg ${
        isDark ? 'bg-slate-950/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              isRunning
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-purple-500/15 text-purple-400 border-purple-500/20'
            }`}
          >
            <Terminal className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-mono">Instancia de Laboratorio (Target)</h3>
              <span
                className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isRunning
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                {isRunning ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {isRunning
                ? 'Máquina virtual desplegada en la subred de entrenamiento'
                : 'Inicia la máquina para obtener una IP objetivo y realizar pentesting'}
            </p>
          </div>
        </div>

        {/* Right Side: Actions & IP */}
        <div className="flex items-center gap-3 shrink-0">
          {isRunning && targetIp ? (
            <div className="flex flex-wrap items-center gap-2">
              {/* Target IP Pill */}
              <div
                onClick={handleCopyIp}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer font-mono text-xs font-bold transition-all ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : isDark
                      ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-500'
                      : 'bg-slate-100 border-slate-300 text-cyan-700 hover:border-cyan-500'
                }`}
                title="Copiar IP objetivo"
              >
                <span>IP: {targetIp}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs ${
                  secondsRemaining < 600
                    ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                    : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              {/* Extend time */}
              <button
                onClick={handleExtend}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs"
                title="+1 hora de laboratorio"
              >
                +1h
              </button>

              {/* Stop Button */}
              <button
                onClick={handleStopMachine}
                className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold"
                title="Terminar máquina"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartMachine}
              disabled={isStarting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/25 active:scale-95 disabled:opacity-50"
            >
              {isStarting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Desplegando...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Iniciar Máquina</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
