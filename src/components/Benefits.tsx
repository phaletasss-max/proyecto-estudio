import React from 'react';
import { motion } from 'framer-motion';
import { Users, Cpu, Workflow, Briefcase, Target, HeartHandshake, Newspaper, Share2, Check, Sparkles } from 'lucide-react';

interface BenefitItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

const benefitsList: BenefitItem[] = [
  {
    title: 'Aprendizaje colaborativo',
    subtitle: 'Resolvemos guías, ejercicios de código y dudas conceptuales en conjunto para fortalecer conocimientos.',
    icon: Users,
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    badge: 'Sinergia',
  },
  {
    title: 'Experiencia práctica',
    subtitle: 'Desarrollo de proyectos reales con tecnologías actuales como React, Windows Server y laboratorios CTF.',
    icon: Cpu,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
    badge: 'Hands-On',
  },
  {
    title: 'Trabajo en equipo',
    subtitle: 'Simulación de entorno laboral real con metodologías ágiles, repositorios Git y división de tareas.',
    icon: Workflow,
    color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    badge: 'Scrum & Git',
  },
  {
    title: 'Portafolio profesional',
    subtitle: 'Creación y documentación de proyectos listos para ser presentados en GitHub y postulaciones laborales.',
    icon: Briefcase,
    color: 'text-sky-400 border-sky-500/20 bg-sky-500/10',
    badge: 'Showcase',
  },
  {
    title: 'Preparación para prácticas',
    subtitle: 'Simulación de entrevistas técnicas, revisión de CV y orientación para el mercado laboral de TI.',
    icon: Target,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    badge: 'Empleabilidad',
  },
  {
    title: 'Apoyo constante',
    subtitle: 'Acompañamiento entre compañeros durante el ciclo académico para evitar el rezago en cualquier materia.',
    icon: HeartHandshake,
    color: 'text-teal-400 border-teal-500/20 bg-teal-500/10',
    badge: 'Mentoría Mutua',
  },
  {
    title: 'Noticias recientes',
    subtitle: 'Actualizaciones sobre vulnerabilidades, tendencias tecnológicas, eventos y novedades de SENATI.',
    icon: Newspaper,
    color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
    badge: 'Tendencias Tech',
  },
  {
    title: 'Networking entre estudiantes',
    subtitle: 'Conexión duradera con compañeros motivados que aspiran a ser líderes en tecnología y ciberseguridad.',
    icon: Share2,
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    badge: 'Comunidad',
  },
];

export const Benefits: React.FC = () => {
  return (
    <section id="beneficios" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>¿POR QUÉ SUMARTE?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Beneficios de la <span className="gradient-text-blue">Comunidad</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Formar parte de nuestro equipo de estudio te potencia académicamente y impulsa tu perfil profesional en el sector tecnológico.
          </p>
        </div>

        {/* Animated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefitsList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-xl hover:border-blue-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${item.color} shadow-inner`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom subtle green checkmark indicator */}
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>Incluido en el grupo</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
