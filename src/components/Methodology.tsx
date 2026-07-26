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
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    time: 'Formación Continua',
  },
];

export const Methodology: React.FC = () => {
  return (
    <section id="metodologia" className="py-24 relative z-10 bg-slate-50 border-y border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUESTRO FLUJO DE TRABAJO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Metodología de <span className="gradient-text-blue">Trabajo</span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Combinamos comunicación ágil, espacios virtuales de estudio y colaboración en tiempo real para optimizar el rendimiento del grupo.
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
                    <div className="group relative rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border font-medium ${step.badgeColor}`}>
                          {step.tag}
                        </span>
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {step.time}
                        </span>
                      </div>

                      {/* Step Title & Icon */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-cyan-400 shadow-sm">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {step.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-base leading-relaxed">
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
