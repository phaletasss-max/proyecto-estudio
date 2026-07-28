import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle2, Globe, Server, Trophy } from 'lucide-react';
import { DomainCTFModal } from '@/components/DomainCTFModal';
import { TerminalBackground } from '@/components/TerminalBackground';
import { useTheme } from '@/context/ThemeContext';

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dev' | 'infra' | 'ctf'>('dev');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="inicio" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-transparent transform-gpu">

      {/* Terminal Background (subtle, only shows in dark well) */}
      <TerminalBackground />

      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-900/15 via-cyan-900/10 to-transparent blur-2xl pointer-events-none -z-10 transform-gpu" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Chip / Badge */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-6 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white/90 border-slate-200 shadow-md'
            }`}
          >
            <span className={`text-xs sm:text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              SENATI 4.º Ciclo • Instructor:{' '}
              <span className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                Victor Kenky Rodriguez Lopez
              </span>
            </span>
          </motion.div>

          {/* Motivational Quote Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mb-8 max-w-2xl mx-auto px-6 py-3 rounded-2xl border text-center shadow-lg ${
              isDark
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-white/90 border-slate-200'
            }`}
          >
            <p className={`text-xs sm:text-sm font-medium italic leading-relaxed ${
              isDark ? 'text-purple-200' : 'text-slate-600'
            }`}>
              "No tengas miedo de empezar sin saber; ten miedo de saber que no sabes y aun así no hacer nada para aprender."
            </p>
          </motion.div>

          {/* Large Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.08] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Construyamos el mejor grupo de estudio del{' '}
            <span className="gradient-text-blue inline-block">4.º ciclo</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`mt-6 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            No solo buscamos terminar los proyectos del curso. Queremos crear una comunidad donde todos aprendamos, compartamos conocimientos y ayudemos a otros estudiantes de SENATI.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <a
              href="https://wa.me/51921378349?text=Hola,%20quisiera%20unirme%20a%20ShadowBytes%20SENATI."
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group ${
                isDark
                  ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30'
                  : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-600/30'
              }`}
            >
              <span>Quiero unirme</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Button */}
            <a
              href="#proyectos"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-700'
                  : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>Ver proyectos</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </a>
          </motion.div>

          {/* CTA Interactive Button */}
          <div className="mt-4">
            <DomainCTFModal />
          </div>

          {/* Key Features Quick Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium"
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Desarrollo Web & Dominio Propio</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Servidores Windows Server 2022</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              <span>CTFs & Hackatones</span>
            </div>
          </motion.div>
        </div>

        {/* Liquid Glass SaaS Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-12 relative max-w-4xl mx-auto"
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-[36px] blur-xl opacity-20" />

          {/* Card Container */}
          <div className={`relative rounded-[32px] border shadow-2xl p-6 sm:p-8 ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>

            {/* Header Tabs */}
            <div className={`flex items-center justify-between pb-6 border-b flex-wrap gap-4 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className={`flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl sm:rounded-full border w-full sm:w-auto overflow-x-auto scrollbar-none shrink-0 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setActiveTab('dev')}
                  className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                    activeTab === 'dev'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  🌐 Web & Dominio
                </button>
                <button
                  onClick={() => setActiveTab('infra')}
                  className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                    activeTab === 'infra'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  🖥️ Windows Server
                </button>
                <button
                  onClick={() => setActiveTab('ctf')}
                  className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                    activeTab === 'ctf'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  🏆 CTFs & Hackatones
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ShadowBytes • 4.º Ciclo
              </div>
            </div>

            {/* Tab Content */}
            <div className="pt-6">
              {activeTab === 'dev' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Globe className="w-5 h-5 text-blue-500" />
                      Despliega tu propio sitio web con tu dominio
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Aprende a configurar tu propio dominio personalizado, automatizar despliegues en Vercel o la nube y dominar tecnologías modernas como React y TypeScript.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-cyan-300' : 'bg-slate-100 border-slate-200 text-blue-700'}`}>Dominio Personal</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-blue-300' : 'bg-slate-100 border-slate-200 text-blue-700'}`}>Vercel & Git</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-emerald-300' : 'bg-slate-100 border-slate-200 text-emerald-700'}`}>React + Vite</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border font-mono text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-blue-200' : 'bg-slate-100 border-slate-200 text-blue-800'}`}>
                    <div className={`mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>// vercel.json</div>
                    <div className="text-cyan-500">"rewrites": [</div>
                    <div className={`pl-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>&#123; "source": "/(.*)" &#125;</div>
                    <div className="text-cyan-500">]</div>
                    <div className="mt-2 text-emerald-500">✓ Domain SSL Active</div>
                  </div>
                </div>
              )}

              {activeTab === 'infra' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Server className="w-5 h-5 text-cyan-500" />
                      Infraestructura Enterprise en Windows Server 2022
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Configuración práctica de DNS, DHCP, Active Directory, Roles de Usuario, File Server y máquinas virtuales en VirtualBox para laboratorios reales del ciclo.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-cyan-300' : 'bg-slate-100 border-slate-200 text-cyan-700'}`}>Active Directory</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-blue-300' : 'bg-slate-100 border-slate-200 text-blue-700'}`}>DNS / DHCP</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-purple-300' : 'bg-slate-100 border-slate-200 text-purple-700'}`}>VirtualBox</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border font-mono text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-cyan-200' : 'bg-slate-100 border-slate-200 text-cyan-800'}`}>
                    <div className={`mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>// Domain Controller</div>
                    <div className="text-emerald-500">Status: ONLINE</div>
                    <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>Domain: senati.local</div>
                    <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>IP: 192.168.1.100</div>
                  </div>
                </div>
              )}

              {activeTab === 'ctf' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Entrenamiento para CTFs & Hackatones
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Resolver desafíos de Capture The Flag (CTF), análisis de vulnerabilidades en Kali Linux, pentesting ético y trabajo en equipo para hackatones académicas.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-amber-300' : 'bg-slate-100 border-slate-200 text-amber-700'}`}>Hackatones</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-100 border-slate-200 text-indigo-700'}`}>Kali Linux</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${isDark ? 'bg-slate-900 border-slate-800 text-emerald-300' : 'bg-slate-100 border-slate-200 text-emerald-700'}`}>Pentesting Labs</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border font-mono text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-indigo-200' : 'bg-slate-100 border-slate-200 text-indigo-800'}`}>
                    <div className={`mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>// CTF Challenge</div>
                    <div className="text-amber-500">FLAG&#123;shadowbytes_ctf_2026&#125;</div>
                    <div className="text-emerald-500">Score: +500 pts</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
