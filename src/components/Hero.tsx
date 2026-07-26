import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle2, Globe, Server, Trophy } from 'lucide-react';
import { DomainCTFModal } from '@/components/DomainCTFModal';
import { TerminalShowcase } from '@/components/TerminalShowcase';

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dev' | 'infra' | 'ctf'>('dev');

  return (
    <section id="inicio" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-white text-slate-900">
      
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

          {/* Motivational Quote Banner (Improved Phrase) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8 max-w-2xl mx-auto px-6 py-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-center shadow-xs"
          >
            <p className="text-xs sm:text-sm font-medium text-blue-950 italic leading-relaxed">
              "No tengas miedo de empezar sin saber; ten miedo de saber que no sabes y aun así no hacer nada para aprender."
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

          {/* CTA Interactive Button: ¿Quieres aprender a tener tu dominio? */}
          <div className="mt-4">
            <DomainCTFModal />
          </div>

          {/* Key Features Quick Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-600 font-medium"
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

        {/* Interactive Multi-Terminal Showcase (Windows CMD, PowerShell, Kali Linux, Arch Linux) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <TerminalShowcase />
        </motion.div>

      </div>
    </section>
  );
};
