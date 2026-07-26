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
    color: 'text-blue-600 border-blue-200 bg-blue-50',
    badge: 'Sinergia',
  },
  {
    title: 'Experiencia práctica',
    subtitle: 'Desarrollo de proyectos reales con tecnologías actuales como React, Windows Server y laboratorios CTF.',
    icon: Cpu,
    color: 'text-cyan-600 border-cyan-200 bg-cyan-50',
    badge: 'Hands-On',
  },
  {
    title: 'Trabajo en equipo',
    subtitle: 'Simulación de entorno laboral real con metodologías ágiles, repositorios Git y división de tareas.',
    icon: Workflow,
    color: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    badge: 'Scrum & Git',
  },
  {
    title: 'Portafolio profesional',
    subtitle: 'Creación y documentación de proyectos listos para ser presentados en GitHub y postulaciones laborales.',
    icon: Briefcase,
    color: 'text-sky-600 border-sky-200 bg-sky-50',
    badge: 'Showcase',
  },
  {
    title: 'Preparación para prácticas',
    subtitle: 'Simulación de entrevistas técnicas, revisión de CV y orientación para el mercado laboral de TI.',
    icon: Target,
    color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    badge: 'Empleabilidad',
  },
  {
    title: 'Apoyo constante',
    subtitle: 'Acompañamiento entre compañeros durante el ciclo académico para evitar el rezago en cualquier materia.',
    icon: HeartHandshake,
    color: 'text-teal-600 border-teal-200 bg-teal-50',
    badge: 'Mentoría Mutua',
  },
  {
    title: 'Noticias recientes',
    subtitle: 'Actualizaciones sobre vulnerabilidades, tendencias tecnológicas, eventos y novedades de SENATI.',
    icon: Newspaper,
    color: 'text-purple-600 border-purple-200 bg-purple-50',
    badge: 'Tendencias Tech',
  },
  {
    title: 'Networking entre estudiantes',
    subtitle: 'Conexión duradera con compañeros motivados que aspiran a ser líderes en tecnología y ciberseguridad.',
    icon: Share2,
    color: 'text-blue-600 border-blue-200 bg-blue-50',
    badge: 'Comunidad',
  },
];

export const Benefits: React.FC = () => {
  return (
    <section id="beneficios" className="py-20 relative z-10 bg-transparent text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BENEFICIOS DE UNIRTE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ¿Por qué <span className="gradient-text-blue">estudiar con nosotros</span>?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Formar parte del grupo de estudio ShadowBytes te abre puertas a mejores proyectos, apoyo constante y trabajo colaborativo real.
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
                className="group relative rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 shadow-2xl hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/80 text-cyan-400">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom checkmark indicator */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-medium">
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
