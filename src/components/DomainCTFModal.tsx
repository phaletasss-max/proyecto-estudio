import React, { useState } from 'react';
import { Globe, Key, Lock, Unlock, Download, X, Check, Search, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { decryptGuideWithFlag } from '@/utils/crypto';

export const DomainCTFModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userFlag, setUserFlag] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  const handleVerifyFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFlag.trim() || isVerifying) return;

    setIsVerifying(true);
    setWrongAttempt(false);

    try {
      const guideText = await decryptGuideWithFlag(userFlag);
      if (guideText) {
        setDecryptedText(guideText);
        setIsUnlocked(true);
        setWrongAttempt(false);
      } else {
        setWrongAttempt(true);
        setTimeout(() => setWrongAttempt(false), 3500);
      }
    } catch {
      setWrongAttempt(true);
      setTimeout(() => setWrongAttempt(false), 3500);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadZip = () => {
    const a = document.createElement('a');
    a.href = '/downloads/ctf_forensics_shadowbytes.zip';
    a.download = 'ctf_forensics_shadowbytes.zip';
    a.click();
  };

  const handleDownloadGuide = () => {
    if (!decryptedText) return;
    const blob = new Blob([decryptedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GUIA_TU_PRIMERA_WEB_VERCEL.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="flex justify-center py-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <Globe className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span>¿Quieres aprender a tener tu dominio?</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={() => setIsOpen(false)}>
          <div
            className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 text-white p-6 sm:p-8 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-cyan-400">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Reto CTF Forense de Redes</h3>
                  <p className="text-xs font-mono text-slate-400">Resuelve el reto → Descripta la guía de dominios</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AES-256 Protected</span>
              </div>
            </div>

            {/* STEP 1: Download CTF ZIP */}
            <div className="mb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>PASO 1 — Descarga el paquete de logs</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Contiene registros de consola de 3 VMs: Windows Server 2022 (DNS, DHCP, File Server, IIS), Gateway Router y un Cliente. Analiza las interfaces, rutas y reglas NAT.
              </p>
              <button onClick={handleDownloadZip} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors">
                <Download className="w-4 h-4" />
                <span>Descargar ctf_forensics_shadowbytes.zip</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800 my-5" />

            {/* STEP 2: Answer the Question */}
            <div className="mb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                <span>PASO 2 — Ingresa la Flag para desencriptar</span>
              </div>
              <p className="text-xs text-slate-300 mb-3 pl-3 border-l-2 border-amber-500/50 italic">
                "Analiza los logs de las 3 VMs. ¿Cuál es la dirección IPv4 pública asignada a la interfaz WAN del Router Gateway que permite la salida a Internet?"
              </p>
              <form onSubmit={handleVerifyFlag} className="flex gap-2">
                <input
                  type="text"
                  value={userFlag}
                  onChange={(e) => setUserFlag(e.target.value)}
                  placeholder="HTB{...}"
                  disabled={isUnlocked || isVerifying}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isUnlocked || isVerifying}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-emerald-600 disabled:cursor-default text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {isUnlocked ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isVerifying ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>{isUnlocked ? 'Desencriptado' : isVerifying ? 'Verificando...' : 'Desencriptar'}</span>
                </button>
              </form>

              {wrongAttempt && (
                <p className="mt-2 text-xs text-rose-400 font-mono">
                  ✗ Flag incorrecta. La desencriptación AES-256 falló. Revisa los archivos del ZIP y busca la IP pública WAN.
                </p>
              )}

              {isUnlocked && (
                <p className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  ¡Desencriptación exitosa! La clave AES-256 es válida.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800 my-5" />

            {/* STEP 3: Unlocked Guide Download */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>PASO 3 — Descarga la guía desbloqueada</span>
              </div>
              {isUnlocked ? (
                <>
                  <p className="text-xs text-slate-300 mb-3">
                    Guía paso a paso en memoria: crear cuenta en GitHub, instalar Git, subir tu página, vincular Vercel, tener tu dominio, estructura de archivos, prompts para Gemini y solución a errores de Vercel/Git.
                  </p>
                  <button onClick={handleDownloadGuide} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20">
                    <Download className="w-4 h-4" />
                    <span>Descargar Guía Completa (.txt)</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 font-mono">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span>El documento está cifrado con AES-256. Resuelve el CTF del Paso 2 para desencriptarlo.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
