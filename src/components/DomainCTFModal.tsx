import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Key, Lock, Unlock, Download, X, Check, Copy, Terminal, Sparkles, HelpCircle } from 'lucide-react';

export const DomainCTFModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userFlag, setUserFlag] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const correctFlag = 'HTB{sh4d0wbyt3s_v3rc3l_g1t_d0m41n_2026}';
  const geminiPrompt =
    'Actúa como un Ingeniero DevSecOps experto. Ayúdame a configurar el despliegue automático de mi aplicación React + Vite en Vercel conectada a mi repositorio de GitHub. Genera un archivo vercel.json optimizado para rutas SPA, explicándome cómo configurar los registros DNS de mi dominio personalizado (Registro A y CNAME) y cómo verificar que el certificado SSL HTTPS esté activo.';

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (userFlag.trim() === correctFlag) {
      setIsUnlocked(true);
    } else {
      alert('Flag incorrecta. Intenta nuevamente o usa la flag revelada en el desafío.');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(geminiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadGuide = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/downloads/GUIA_PASO_A_PASO_VERCEL_GIT_DOMINIO.txt');
    element.setAttribute('download', 'GUIA_PASO_A_PASO_VERCEL_GIT_DOMINIO.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      {/* Prominent Button Trigger Component */}
      <div className="flex justify-center py-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <Globe className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span>¿Quieres aprender a tener tu dominio?</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-mono">CTF Mini</span>
        </button>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Dominio Propio & Despliegue Vercel
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">
                    Mini Desafío CTF • HTB Flag System
                  </p>
                </div>
              </div>

              {/* Guía Rápida */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  3 Pasos para tener tu dominio personalizado:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-blue-400 font-mono font-bold block mb-1">1. Subir Git</span>
                    <p className="text-slate-400">Publica tu código en GitHub en la rama `main`.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-mono font-bold block mb-1">2. Vercel</span>
                    <p className="text-slate-400">Conecta el repositorio en vercel.com/new.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-mono font-bold block mb-1">3. Registros DNS</span>
                    <p className="text-slate-400">A Record IP `76.76.21.21` & CNAME `vercel-dns.com`.</p>
                  </div>
                </div>
              </div>

              {/* Mini CTF Section */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
                    <span>FLAG HACKTHEBOX (CTF)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    HTB Flag Format
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Flag del desafío: <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300 font-mono select-all">HTB&#123;sh4d0wbyt3s_v3rc3l_g1t_d0m41n_2026&#125;</code>
                </p>

                <form onSubmit={handleVerifyFlag} className="flex gap-2">
                  <input
                    type="text"
                    value={userFlag}
                    onChange={(e) => setUserFlag(e.target.value)}
                    placeholder="Ingresa la flag HTB aquí..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Desbloquear</span>
                  </button>
                </form>

                {isUnlocked && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Desafío completado! Bloc de notas y Prompt de Gemini desbloqueados.</span>
                  </div>
                )}
              </div>

              {/* Prompt Gemini & Download Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>PROMPT PARA PEGAR EN GEMINI / AGY:</span>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? '¡Copiado!' : 'Copiar Prompt'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed italic">
                  "{geminiPrompt}"
                </div>

                <button
                  onClick={handleDownloadGuide}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm font-mono transition-all shadow-md mt-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Bloc de Notas con Guía Completa (.txt)</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
