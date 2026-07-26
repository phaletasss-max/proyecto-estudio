import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle, FolderCode, HeartHandshake } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
}

const stats: StatCard[] = [
  {
    label: '3 Proyectos',
    value: '03',
    subtitle: 'Web, Server DNS & Ciberseguridad',
    icon: FolderCode,
    color: 'text-blue-600 border-blue-200 bg-blue-50',
  },
  {
    label: 'Discord',
    value: 'VOZ & CODE',
    subtitle: 'Salas de estudio por las noches',
    icon: MessageSquare,
    color: 'text-indigo-600 border-indigo-200 bg-indigo-50',
  },
  {
    label: 'WhatsApp',
    value: 'GRUPO 24/7',
    subtitle: 'Avisos, consultas & coordinación',
    icon: MessageCircle,
    color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
  },
  {
    label: 'Estudio colaborativo',
    value: '100%',
    subtitle: 'Enfocados en el 4.º ciclo de SENATI',
    icon: HeartHandshake,
    color: 'text-cyan-600 border-cyan-200 bg-cyan-50',
  },
];

export const Community: React.FC = () => {
  return (
    <section className="py-20 relative z-10 bg-transparent text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comunidad de <span className="gradient-text-blue">Estudio Activa</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Compartimos recursos, resolvemos dudas y organizamos reuniones de código para avanzar juntos en el ciclo.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1 font-semibold">
                    {stat.label}
                  </span>

                  <h3 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    {stat.value}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {stat.subtitle}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
