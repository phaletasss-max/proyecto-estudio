import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Shield, Terminal, Layers } from 'lucide-react';

export interface ProjectCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  glowColor: string;
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
    glowColor: 'hover:border-blue-500 hover:shadow-blue-500/10',
    badge: 'Desarrollo Frontend & Backend',
    delay: 0.1,
  },
  {
    title: 'Proyecto DNS',
    description:
      'Implementación de Windows Server 2022, DNS, DHCP, File Server, Web Server, Active Directory y VirtualBox.',
    icon: Server,
    tags: ['Windows Server 2022', 'DNS / DHCP', 'Active Directory', 'VirtualBox', 'File Server'],
    glowColor: 'hover:border-cyan-500 hover:shadow-cyan-500/10',
    badge: 'Infraestructura & Redes',
    delay: 0.2,
  },
  {
    title: 'CE Ingeniería en Ciberseguridad',
    description:
      'Investigación, laboratorios, CTF, pentesting, redes, Linux y automatización.',
    icon: Shield,
    tags: ['Kali Linux', 'Pentesting', 'CTF Labs', 'Redes & Seguridad', 'Automatización'],
    glowColor: 'hover:border-indigo-500 hover:shadow-indigo-500/10',
    badge: 'Seguridad Informática',
    delay: 0.3,
  },
];

export const Projects: React.FC = () => {
  return (
    <section id="proyectos" className="py-24 relative z-10 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-blue-700 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>NUESTROS PROYECTOS DEL 4.º CICLO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Proyectos principales en los que{' '}
            <span className="gradient-text-blue">trabajamos juntos</span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Nos enfocamos en el aprendizaje práctico, cubriendo desde aplicaciones web modernas hasta infraestructura de servidores enterprise y ciberseguridad.
          </p>
        </div>

        {/* 3 Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsData.map((project, idx) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: project.delay }}
                className={`group relative rounded-3xl bg-white border border-slate-200 p-8 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl ${project.glowColor}`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    {project.badge}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Divider line */}
                <div className="w-full h-px bg-slate-100 my-6" />

                {/* Tech Tags */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-600" />
                    Tecnologías & Herramientas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700 font-mono"
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
