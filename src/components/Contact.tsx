import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Copy, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const phoneDisplay = '921 378 349';
  const whatsappUrl = 'https://wa.me/51921378349?text=Hola,%20quisiera%20unirme%20a%20Plan%20Estudios%20SENATI.';
  const defaultMessage = 'Hola, quisiera unirme a Plan Estudios SENATI.';

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('921378349');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contacto" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ÚNETE HOY AL GRUPO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ¿Quieres unirte?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Envíame un mensaje por WhatsApp indicando que deseas formar parte del grupo de estudio. Posteriormente recibirás el enlace al servidor de Discord y al grupo oficial.
          </p>
        </div>

        {/* Large Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto relative rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Subtle Green Ambient Lighting */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            
            {/* Status & Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-8 border-b border-slate-800/80 text-center sm:text-left">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Coordinación de Grupo
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Plan Estudios SENATI
                </h3>
                <p className="text-slate-400 text-sm mt-0.5">
                  Comunidad Abierta para el 4.º Ciclo
                </p>
              </div>
            </div>

            {/* Info Box: WhatsApp Number */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider block mb-1">
                  Contacto de WhatsApp
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono">
                  {phoneDisplay}
                </span>
              </div>
              <button
                onClick={handleCopyPhone}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800 flex items-center gap-2 text-xs font-mono"
                title="Copiar número"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Message Preview Box */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 font-semibold block mb-1">💬 Mensaje listo para enviar:</span>
              <p className="italic text-slate-200 text-sm">"{defaultMessage}"</p>
            </div>

            {/* Large Green WhatsApp Button */}
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 group"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
                <span>Enviar mensaje</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Respuesta rápida e ingreso al servidor oficial de Discord</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
