import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle, FolderCode, HeartHandshake } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}

const stats: StatCard[] = [
  {
    label: '3 Proyectos',
    value: '03',
    subtitle: 'Web, Server DNS & Ciberseguridad',
    icon: FolderCode,
  },
  {
    label: 'Discord',
    value: 'VOZ & CODE',
    subtitle: 'Salas de estudio por las noches',
    icon: MessageSquare,
  },
  {
    label: 'WhatsApp',
    value: 'GRUPO 24/7',
    subtitle: 'Avisos, consultas & coordinación',
    icon: MessageCircle,
  },
  {
    label: 'Estudio colaborativo',
    value: '100%',
    subtitle: 'Enfocados en el 4.º ciclo de SENATI',
    icon: HeartHandshake,
  },
];

export const Community: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      className={`py-20 relative z-10 transition-colors duration-300 ${
        isDark ? 'border-b border-slate-800/80' : 'border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Comunidad de <span className="gradient-text-blue">Estudio Activa</span>
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
                className={`group relative rounded-3xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/60 hover:shadow-xl'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xl'
                }`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-cyan-400'
                      : 'bg-slate-100 border-slate-200 text-blue-600'
                  }`}>
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <span className={`text-xs font-mono uppercase tracking-widest block mb-1 font-semibold ${
                    isDark ? 'text-cyan-400' : 'text-blue-500'
                  }`}>
                    {stat.label}
                  </span>

                  <h3 className={`text-3xl font-extrabold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </h3>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
