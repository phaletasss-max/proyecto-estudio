import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Users, Terminal, Shield, Sparkles, CheckCircle2, ChevronRight, Server, BookOpen } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Chip / Badge */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/60 border border-blue-500/30 backdrop-blur-md shadow-lg shadow-blue-500/10 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs sm:text-sm font-mono text-blue-200">
              SENATI 4.º Ciclo • Instructor: <span className="text-cyan-300 font-semibold">Victor Kenky Rodriguez Lopez</span>
            </span>
          </motion.div>

          {/* Large Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]"
          >
            Construyamos el mejor grupo de estudio del{' '}
            <span className="gradient-text-blue inline-block">4.º ciclo</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed"
          >
            No solo buscamos terminar los proyectos del curso. Queremos crear una comunidad donde todos aprendamos, compartamos conocimientos y ayudemos a otros estudiantes de SENATI.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <a
              href="https://wa.me/51921378349"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
              <span>Quiero unirme</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Button */}
            <a
              href="#proyectos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 font-semibold text-base backdrop-blur-md hover:bg-slate-800/80 hover:border-slate-700 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>Ver proyectos</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </a>
          </motion.div>

          {/* Key Pill Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Desarrollo Web Moderno</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Servidores Windows Server 2022</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Ciberseguridad & CTFs</span>
            </div>
          </motion.div>
        </div>

        {/* Interactive Linear/Apple Style SaaS Dashboard Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
          
          <div className="relative rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Top Bar of Window */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  senati-4ciclo-workspace ~ bash
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Comunidad Activa
                </span>
              </div>
            </div>

            {/* Grid Interior Content */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: Code Terminal Preview */}
              <div className="md:col-span-2 rounded-xl bg-slate-950/90 border border-slate-800/90 p-5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-slate-500">
                  <span>main.ts — Proyecto SENATI</span>
                  <span className="text-cyan-400 font-sans text-xs font-semibold">TypeScript</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-purple-400">
                    <span className="text-blue-400">import</span> &#123; <span className="text-amber-300">Estudiante</span>, <span className="text-amber-300">Proyecto</span> &#125; <span className="text-blue-400">from</span> <span className="text-emerald-300">'@senati/4ciclo'</span>;
                  </p>
                  <p className="text-slate-500">// Definición del grupo de estudio colaborativo</p>
                  <p>
                    <span className="text-blue-400">const</span> <span className="text-cyan-300">grupoEstudio</span> = <span className="text-blue-400">new</span> <span className="text-amber-300">ComunidadSENATI</span>(&#123;
                  </p>
                  <p className="pl-4">
                    ciclo: <span className="text-amber-400">'4.º Ciclo'</span>,
                  </p>
                  <p className="pl-4">
                    instructor: <span className="text-emerald-300">'Victor Kenky Rodriguez Lopez'</span>,
                  </p>
                  <p className="pl-4">
                    meta: <span className="text-emerald-300">'Aprender juntos y destacar en cada laboratorio'</span>,
                  </p>
                  <p className="pl-4">
                    metodologia: [<span className="text-amber-400">'Discord'</span>, <span className="text-amber-400">'WhatsApp'</span>, <span className="text-amber-400">'Laboratorios'</span>]
                  </p>
                  <p>&#125;);</p>
                  <p className="text-slate-500 mt-2">// Salida de consola:</p>
                  <p className="text-emerald-400 flex items-center gap-2 pt-1">
                    <span>➜</span> <span>[SUCCESS] ¡Bienvenido al equipo de trabajo! 🚀</span>
                  </p>
                </div>
              </div>

              {/* Box 2: Quick Highlights Side Cards */}
              <div className="space-y-4 flex flex-col justify-between">
                
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Proyecto Web</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Frontend + Backend Moderno</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Proyecto DNS & AD</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Windows Server 2022</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">CE Ciberseguridad</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Redes, Linux & CTFs</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
