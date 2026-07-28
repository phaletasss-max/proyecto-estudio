import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle, GraduationCap, Award, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MethodologyStep {
  title: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  time: string;
}

const steps: MethodologyStep[] = [
  {
    title: 'Discord',
    description: 'Reuniones por las noches para programar, resolver dudas y compartir pantalla.',
    icon: MessageSquare,
    tag: 'Sesiones Nocturnas',
    time: '20:00 - 22:30 hrs',
  },
  {
    title: 'WhatsApp',
    description: 'Avisos, noticias, horarios, material de estudio y coordinación.',
    icon: MessageCircle,
    tag: 'Comunicación Instantánea',
    time: '24 / 7 Disponible',
  },
  {
    title: 'Clases',
    description: 'Apoyo mutuo durante laboratorios, exposiciones y proyectos.',
    icon: GraduationCap,
    tag: 'Presencial & Virtual',
    time: 'Horario SENATI',
  },
  {
    title: 'Fuera de clases',
    description: 'Compartir recursos, noticias de ciberseguridad y preparación para certificaciones.',
    icon: Award,
    tag: 'Crecimiento Profesional',
    time: 'Formación Continua',
  },
];

export const Methodology: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="metodologia"
      className={`py-20 relative z-10 transition-colors duration-300 ${
        isDark ? 'border-b border-slate-800/80' : 'border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-4 shadow-md ${
            isDark
              ? 'bg-purple-950/80 border border-purple-500/30 text-purple-300'
              : 'bg-purple-100 border border-purple-300 text-purple-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUESTRA METODOLOGÍA</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ¿Cómo <span className="gradient-text-blue">trabajamos en equipo</span>?
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Nos organizamos mediante reuniones dinámicas en Discord y coordinación directa en WhatsApp.
          </p>
        </div>

        {/* Timeline Desktop & Mobile Grid */}
        <div className="relative">
          {/* Central Connecting Line for Desktop */}
          <div className={`hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 ${
            isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`} />

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
                    <div className={`group relative rounded-3xl border p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800'
                        : 'bg-white border-slate-200 hover:shadow-2xl'
                    }`}>

                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                          isDark
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {step.tag}
                        </span>
                        <span className={`text-xs font-mono flex items-center gap-1 ${
                          isDark ? 'text-cyan-300' : 'text-blue-600'
                        }`}>
                          <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                          {step.time}
                        </span>
                      </div>

                      {/* Step Title & Icon */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-md ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-cyan-400'
                            : 'bg-slate-100 border-slate-200 text-blue-600'
                        }`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <h3 className={`text-2xl font-bold transition-colors ${
                          isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                          {step.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {step.description}
                      </p>

                    </div>
                  </div>

                  {/* Center Node Indicator (Desktop) */}
                  <div className="hidden lg:flex items-center justify-center z-10">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono text-sm font-bold shadow-md ${
                      isDark
                        ? 'bg-slate-900 text-white border-white'
                        : 'bg-white text-slate-900 border-slate-400'
                    }`}>
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
