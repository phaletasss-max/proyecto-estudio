import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Shield, Terminal, Layers } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface ProjectCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  glowColorDark: string;
  glowColorLight: string;
  badge: string;
  delay: number;
}

const projectsData: ProjectCardProps[] = [
  {
    title: 'Proyecto Web',
    description:
      'Desarrollo completo del proyecto web utilizando tecnologías modernas, documentación y trabajo colaborativo.',
    icon: Globe,
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Git & GitHub'],
    glowColorDark: 'hover:border-blue-500 hover:shadow-blue-500/10',
    glowColorLight: 'hover:border-blue-400 hover:shadow-blue-400/20',
    badge: 'Desarrollo Frontend & Backend',
    delay: 0.1,
  },
  {
    title: 'Proyecto DNS',
    description:
      'Implementación de Windows Server 2022, DNS, DHCP, File Server, Web Server, Active Directory y VirtualBox.',
    icon: Server,
    tags: ['Windows Server 2022', 'DNS / DHCP', 'Active Directory', 'VirtualBox', 'File Server'],
    glowColorDark: 'hover:border-cyan-500 hover:shadow-cyan-500/10',
    glowColorLight: 'hover:border-cyan-400 hover:shadow-cyan-400/20',
    badge: 'Infraestructura & Redes',
    delay: 0.2,
  },
  {
    title: 'CE Ingeniería en Ciberseguridad',
    description:
      'Investigación, laboratorios, CTF, pentesting, redes, Linux y automatización.',
    icon: Shield,
    tags: ['Kali Linux', 'Pentesting', 'CTF Labs', 'Redes & Seguridad', 'Automatización'],
    glowColorDark: 'hover:border-indigo-500 hover:shadow-indigo-500/10',
    glowColorLight: 'hover:border-indigo-400 hover:shadow-indigo-400/20',
    badge: 'Seguridad Informática',
    delay: 0.3,
  },
];

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="proyectos"
      className={`py-20 relative z-10 transition-colors duration-300 ${
        isDark ? 'border-b border-slate-800/80' : 'border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-4 shadow-md ${
            isDark
              ? 'bg-blue-950/80 border border-blue-500/30 text-cyan-300'
              : 'bg-blue-100 border border-blue-300 text-blue-700'
          }`}>
            <Layers className="w-3.5 h-3.5" />
            <span>4.º CICLO SENATI</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nuestros <span className="gradient-text-blue">Proyectos Clave</span>
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Combinamos el desarrollo web profesional con la administración de servidores Windows Server 2022 y la seguridad informática.
          </p>
        </div>

        {/* 3 Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsData.map((project) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: project.delay }}
                className={`group relative rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 shadow-xl ${
                  isDark
                    ? `bg-slate-900/90 border-slate-800 ${project.glowColorDark}`
                    : `bg-white border-slate-200 ${project.glowColorLight} hover:shadow-2xl`
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                    isDark
                      ? 'bg-blue-950/80 text-cyan-300 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {project.badge}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform shadow-md ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-cyan-400'
                      : 'bg-slate-100 border-slate-200 text-blue-600'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Card Title */}
                <h3 className={`text-2xl font-bold transition-colors mb-3 ${
                  isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {project.title}
                </h3>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {project.description}
                </p>

                {/* Divider line */}
                <div className={`w-full h-px my-6 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                {/* Tech Tags */}
                <div>
                  <h4 className={`text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <Terminal className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                    Tecnologías & Herramientas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono ${
                          isDark
                            ? 'bg-slate-950 border border-slate-800 text-cyan-300'
                            : 'bg-slate-100 border border-slate-200 text-blue-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
