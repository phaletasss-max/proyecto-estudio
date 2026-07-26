import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Key, Lock, Unlock, Download, X, Check, Copy, Sparkles, Terminal, FileText, Search } from 'lucide-react';

export const DomainCTFModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userFlag, setUserFlag] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const correctFlag1 = 'HTB{200.48.225.14}';
  const correctFlag2 = '200.48.225.14';
  const geminiPrompt =
    'Actúa como un Ingeniero DevSecOps experto. Ayúdame a configurar el despliegue automático de mi aplicación React + Vite en Vercel conectada a mi repositorio de GitHub. Genera un archivo vercel.json optimizado para rutas SPA y la guía de configuración DNS de mi dominio personalizado (Registro A e IP 76.76.21.21).';

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = userFlag.trim();
    if (cleanInput === correctFlag1 || cleanInput === correctFlag2) {
      setIsUnlocked(true);
    } else {
      alert('Flag incorrecta. Analiza el archivo 03_LOGS_VM2_ROUTER_GATEWAY.txt o la salida de tracert en VM3 dentro del archivo ZIP.');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(geminiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadZip = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/downloads/ctf_forensics_shadowbytes.zip');
    element.setAttribute('download', 'ctf_forensics_shadowbytes.zip');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      {/* Prominent Button Trigger */}
      <div className="flex justify-center py-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <Globe className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span>¿Quieres aprender a tener tu dominio? (Descargar Reto CTF)</span>
        </button>
      </div>

      {/* Interactive CTF Forensics Modal */}
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
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Reto CTF Forense de Redes & Dominios
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">
                    ShadowBytes SENATI • Descarga el Paquete ZIP de Registro de Logs
                  </p>
                </div>
              </div>

              {/* Package Download CTA Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Paquete ZIP del Desafío Forense</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    5 Archivos TXT Incluidos
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Descarga el archivo ZIP con los registros de consola de 3 Máquinas Virtuales (Windows Server 2022, Gateway Router y Cliente Workstation) para resolver el desafío de enrutamiento y obtener tu guía de dominios.
                </p>

                <button
                  onClick={handleDownloadZip}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm font-mono transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Paquete CTF (.zip)</span>
                </button>
              </div>

              {/* CTF Challenge Question & Verification Form */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
                    <span>PREGUNTA DEL RETO FORENSE</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    Formato: HTB&#123;IP_HALLADA&#125;
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                  "Analiza las tablas de enrutamiento e interfaces de red de los archivos TXT. ¿Cuál es la dirección IP pública/WAN por la cual el Router Gateway transmite el tráfico local hacia Internet?"
                </p>

                <form onSubmit={handleVerifyFlag} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={userFlag}
                    onChange={(e) => setUserFlag(e.target.value)}
                    placeholder="Ejemplo: HTB{200.48.225.14}"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Verificar Flag</span>
                  </button>
                </form>

                {isUnlocked && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Flag Correcta! Prompt y guía técnica desbloqueados.</span>
                  </div>
                )}
              </div>

              {/* Unlocked Prompt & Notes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>PROMPT SUGERIDO PARA GEMINI / AGY:</span>
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
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
