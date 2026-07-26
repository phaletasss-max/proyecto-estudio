import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle2, Globe, Server, Trophy } from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dev' | 'infra' | 'ctf'>('dev');

  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white text-slate-900">
      
      {/* Background Subtle Gradient Mesh for White Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-50/60 via-cyan-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Chip / Badge */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs sm:text-sm font-mono text-slate-700">
              SENATI 4.º Ciclo • Instructor: <span className="text-blue-600 font-semibold">Victor Kenky Rodriguez Lopez</span>
            </span>
          </motion.div>

          {/* Motivational Quote Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8 max-w-2xl mx-auto px-5 py-2.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center shadow-xs"
          >
            <p className="text-xs sm:text-sm font-medium text-blue-950 italic">
              "No tengas miedo de no saber nada y unirte; ten miedo de saber que no sabes nada y quedarte sin practicar."
            </p>
          </motion.div>

          {/* Large Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 max-w-4xl leading-[1.08]"
          >
            Construyamos el mejor grupo de estudio del{' '}
            <span className="gradient-text-blue inline-block">4.º ciclo</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
              <span>Quiero unirme</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Button */}
            <a
              href="#proyectos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-base hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>Ver proyectos</span>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </a>
          </motion.div>

          {/* Key Features Quick Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Desarrollo Web & Dominio Propio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Servidores Windows Server 2022</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>CTFs & Hackatones</span>
            </div>
          </motion.div>
        </div>

        {/* Liquid Glass Frosted SaaS Card (Wandor-inspired UI) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-16 relative max-w-4xl mx-auto"
        >
          {/* Ambient Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-[36px] blur-xl opacity-30" />

          {/* Liquid Glass Card Container */}
          <div className="relative rounded-[32px] bg-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-8">
            
            {/* Header Tabs */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-full border border-slate-800">
                <button
                  onClick={() => setActiveTab('dev')}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                    activeTab === 'dev'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌐 Web & Dominio
                </button>
                <button
                  onClick={() => setActiveTab('infra')}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                    activeTab === 'infra'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🖥️ Windows Server
                </button>
                <button
                  onClick={() => setActiveTab('ctf')}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                    activeTab === 'ctf'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏆 CTFs & Hackatones
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ShadowBytes • 4.º Ciclo
              </div>
            </div>

            {/* Tab Content Display */}
            <div className="pt-6">
              {activeTab === 'dev' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      Despliega tu propio sitio web con tu dominio
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Aprende a configurar tu propio dominio personalizado, automatizar despliegues en Vercel o la nube y dominar tecnologías modernas como React y TypeScript.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-cyan-300">Dominio Personal</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-blue-300">Vercel & Git</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-emerald-300">React + Vite</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-200">
                    <div className="text-slate-500 mb-1">// vercel.json</div>
                    <div className="text-cyan-400">"rewrites": [</div>
                    <div className="pl-3 text-slate-300">&#123; "source": "/(.*)" &#125;</div>
                    <div className="text-cyan-400">]</div>
                    <div className="mt-2 text-emerald-400">✓ Domain SSL Active</div>
                  </div>
                </div>
              )}

              {activeTab === 'infra' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-cyan-400" />
                      Infraestructura Enterprise en Windows Server 2022
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Configuración práctica de DNS, DHCP, Active Directory, Roles de Usuario, File Server y máquinas virtuales en VirtualBox para laboratorios reales del ciclo.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-cyan-300">Active Directory</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-blue-300">DNS / DHCP</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-purple-300">VirtualBox</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-200">
                    <div className="text-slate-500 mb-1">// Domain Controller</div>
                    <div className="text-emerald-400">Status: ONLINE</div>
                    <div className="text-slate-300">Domain: senati.local</div>
                    <div className="text-slate-300">IP: 192.168.1.100</div>
                  </div>
                </div>
              )}

              {activeTab === 'ctf' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      Entrenamiento para CTFs & Hackatones
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Resolver desafíos de Capture The Flag (CTF), análisis de vulnerabilidades en Kali Linux, pentesting ético y trabajo en equipo para hackatones académicas.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-amber-300">Hackatones</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-indigo-300">Kali Linux</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-emerald-300">Pentesting Labs</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-200">
                    <div className="text-slate-500 mb-1">// CTF Challenge</div>
                    <div className="text-amber-400">FLAG&#123;shadowbytes_ctf_2026&#125;</div>
                    <div className="text-emerald-400">Score: +500 pts</div>
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
