import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MessageSquare, Users, Copy, Check, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const phoneDisplay = '921 378 349';
  const whatsappGroupUrl = 'https://chat.whatsapp.com/GQLxp8a8dVh3c3Z6POW1CU';
  const discordInviteUrl = 'https://discord.gg/MPRzx6UHM';

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('921378349');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contacto"
      className={`py-20 relative z-10 transition-colors duration-300 ${
        isDark ? 'border-b border-slate-800/80' : 'border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-4 shadow-md ${
            isDark
              ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>ÚNETE HOY AL GRUPO</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ¿Quieres unirte a <span className="gradient-text-blue">ShadowBytes</span>?
          </h2>
          <p className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Súmate directamente a nuestra comunidad en WhatsApp y Discord para acceder a las salas de voz, material de estudio, retos CTF y foros de noticias.
          </p>
        </div>

        {/* Large Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`max-w-2xl mx-auto relative rounded-3xl border p-8 sm:p-12 shadow-2xl overflow-hidden ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">

            {/* Status & Header */}
            <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-8 border-b text-center sm:text-left ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 p-1 shadow-lg shadow-emerald-500/20">
                  <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                    isDark ? 'bg-slate-950' : 'bg-white'
                  }`}>
                    <Users className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className={`relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 ${isDark ? 'border-slate-950' : 'border-white'}`} />
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Comunidad Oficial 24/7
                </div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ShadowBytes SENATI
                </h3>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Grupo de Estudio Abierto & Ciberseguridad
                </p>
              </div>
            </div>

            {/* Info Box: WhatsApp Number */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isDark
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`text-[11px] font-mono uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Contacto Directo WhatsApp
                </span>
                <span className="text-xl font-bold text-emerald-500 font-mono">
                  +51 {phoneDisplay}
                </span>
              </div>
              <button
                onClick={handleCopyPhone}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono transition-colors ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Copiar número"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Button */}
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Grupo WhatsApp</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Discord Button */}
              <a
                href={discordInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Servidor Discord</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Security Note */}
            <div className={`flex items-center justify-center gap-2 text-xs font-mono text-center pt-2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Acceso directo sin necesidad de aprobación previa</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
