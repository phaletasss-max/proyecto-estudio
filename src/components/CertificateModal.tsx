import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Printer, ShieldCheck, CheckCircle2, Sparkles, User, Calendar } from 'lucide-react';
import type { UserProfile } from '@/types/auth';
import { useTheme } from '@/context/ThemeContext';
import { RANKS } from '@/types/auth';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, user }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const rankInfo = RANKS[user.rank] || RANKS['Script Kiddie'];
  const certId = `SB-CERT-2026-${user.id.slice(0, 8).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl rounded-3xl border p-6 sm:p-10 shadow-2xl my-auto text-center overflow-hidden ${
            isDark ? 'bg-slate-950 border-purple-500/30 text-white' : 'bg-white border-purple-200 text-slate-900'
          }`}
        >
          {/* Certificate Ambient Border Glow */}
          <div className="absolute inset-2 rounded-[22px] border-2 border-dashed border-purple-500/20 pointer-events-none" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white bg-slate-900 z-10 print:hidden"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Certificate Content */}
          <div className="py-4 relative z-10">
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-purple-500/30 shadow">
                <img src="/logo-shadowbytes.png" alt="ShadowBytes" className="w-full h-full object-cover" />
              </div>
              <span className="font-[Orbitron] font-extrabold text-xl tracking-wider">
                SHADOW<span className="text-purple-500">BYTES</span>
              </span>
            </div>

            <p className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold mb-6">
              COMUNIDAD DE CIBERSEGURIDAD • SENATI 4.º CICLO
            </p>

            <h2 className="text-xl sm:text-2xl font-extrabold font-[Orbitron] tracking-tight mb-2 uppercase text-cyan-400">
              Certificado de Acreditación Práctica
            </h2>

            <p className="text-xs font-mono text-slate-400 mb-6">
              Se certifica que el estudiante y miembro activo
            </p>

            {/* Student Name */}
            <div className="mb-6 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide">
                {user.fullName || user.username}
              </h3>
              <p className="text-xs font-mono text-purple-300 mt-1">
                Alias: @{user.username} • Especialidad: {user.specialty}
              </p>
            </div>

            <p className={`text-xs max-w-lg mx-auto leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Ha demostrado competencias técnicas avanzadas en la resolución de laboratorios de seguridad ofensiva, análisis forense de redes, auditoría de aplicaciones web y administración de infraestructura.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Rango Obtenido</span>
                <span className="font-bold text-amber-400">{rankInfo.icon} {user.rank}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Puntos Acumulados</span>
                <span className="font-bold text-cyan-400">{user.points.toLocaleString()} PTS</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Labs Conquistados</span>
                <span className="font-bold text-emerald-400">{user.solvedLabs.length} Labs</span>
              </div>
            </div>

            {/* Signatures & Accreditation */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800 text-center text-xs font-mono">
              <div>
                <div className="w-32 h-0.5 bg-slate-700 mx-auto mb-2" />
                <p className="font-bold text-slate-200">Victor Kenky Rodriguez Lopez</p>
                <p className="text-[10px] text-slate-500">Instructor del Curso • SENATI</p>
              </div>

              <div>
                <div className="w-32 h-0.5 bg-slate-700 mx-auto mb-2" />
                <p className="font-bold text-purple-400">ShadowBytes Council</p>
                <p className="text-[10px] text-slate-500">{issueDate}</p>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED ACCREDITATION: {certId}</span>
              </span>
              <span>shadowbytes.vercel.app</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-mono font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
