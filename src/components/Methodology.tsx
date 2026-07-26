import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle, GraduationCap, Award, Clock, Sparkles } from 'lucide-react';

interface MethodologyStep {
  title: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  badgeColor: string;
  time: string;
}

const steps: MethodologyStep[] = [
  {
    title: 'Discord',
    description: 'Reuniones por las noches para programar, resolver dudas y compartir pantalla.',
    icon: MessageSquare,
    tag: 'Sesiones Nocturnas',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    time: '20:00 - 22:30 hrs',
  },
  {
    title: 'WhatsApp',
    description: 'Avisos, noticias, horarios, material de estudio y coordinación.',
    icon: MessageCircle,
    tag: 'Comunicación Instantánea',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    time: '24 / 7 Disponible',
  },
  {
    title: 'Clases',
    description: 'Apoyo mutuo durante laboratorios, exposiciones y proyectos.',
    icon: GraduationCap,
    tag: 'Presencial & Virtual',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    time: 'Horario SENATI',
  },
  {
    title: 'Fuera de clases',
    description: 'Compartir recursos, noticias de ciberseguridad y preparación para certificaciones.',
    icon: Award,
    tag: 'Crecimiento Profesional',
    badgeColor: 'bg-cyan-950/50 text-cyan-300 border-cyan-800/50',
    time: 'Formación Continua',
  },
];

export const Methodology: React.FC = () => {
  return (
    <section id="metodologia" className="py-20 relative z-10 bg-transparent text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUESTRA METODOLOGÍA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ¿Cómo <span className="gradient-text-blue">trabajamos en equipo</span>?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Nos organizamos mediante reuniones dinámicas en Discord y coordinación directa en WhatsApp.
          </p>
        </div>

        {/* Timeline Desktop & Mobile Grid */}
        <div className="relative">
          {/* Central Connecting Line for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 bg-slate-300" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => {
              const IconComp = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Card Content Side */}
                  <div className="w-full lg:w-1/2">
                    <div className="group relative rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-950/80 text-purple-300 border border-purple-500/30 font-medium">
                          {step.tag}
                        </span>
                        <span className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {step.time}
                        </span>
                      </div>

                      {/* Step Title & Icon */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-md">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {step.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 text-base leading-relaxed">
                        {step.description}
                      </p>

                    </div>
                  </div>

                  {/* Center Node Indicator (Desktop) */}
                  <div className="hidden lg:flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white border-4 border-white flex items-center justify-center font-mono text-sm font-bold shadow-md">
                      0{index + 1}
                    </div>
                  </div>

                  {/* Empty Spacer Side (Desktop) */}
                  <div className="hidden lg:block w-1/2" />
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
