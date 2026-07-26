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
    <section id="comunidad" className="py-24 relative z-10 bg-slate-50 border-y border-slate-200 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Statistics */}
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
                className="group relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${stat.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                      INDICADOR
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors font-mono tracking-tight mb-1">
                    {stat.value}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {stat.label}
                  </h4>

                  <p className="text-xs text-slate-500">
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
