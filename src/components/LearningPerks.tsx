import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Trophy, Compass, Sparkles, Terminal, Rocket, Lightbulb, ShieldAlert } from 'lucide-react';

export const LearningPerks: React.FC = () => {
  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUEVAS PERSPECTIVAS & RETOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Aprende lo que <span className="gradient-text-cyan">no enseñan en las diapositivas</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Te ayudamos a dar el salto de los laboratorios básicos a proyectos reales con dominio propio, despliegues en la nube y competencias CTF.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Block 1: Dominio Propio & Cloud */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-3xl bg-slate-900/70 border border-slate-800/80 p-8 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block mb-2">
                DOMINIO & NUBE
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                Tu propio dominio y hosting web
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Si quieres aprender a configurar tu propio dominio personalizado (`tudominio.com`), desplegar en Vercel o AWS y estructurar proyectos web modernos, aquí aprenderás el paso a paso.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 text-xs font-mono text-blue-300 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Despliegues automatizados</span>
            </div>
          </motion.div>

          {/* Block 2: CTF & Hackatones */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-3xl bg-slate-900/70 border border-slate-800/80 p-8 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block mb-2">
                CIBERSEGURIDAD & CTFS
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                CTFs, Hackatones y Labs
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Participamos en desafíos Capture The Flag (CTF), hackatones y pruebas de concepto de pentesting ético para potenciar tu perfil en ciberseguridad.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 text-xs font-mono text-indigo-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Pentesting & Hacking ético</span>
            </div>
          </motion.div>

          {/* Block 3: Cambio de Perspectiva */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative rounded-3xl bg-slate-900/70 border border-slate-800/80 p-8 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
                MENTALIDAD DE CRECIMIENTO
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                Otras formas de ver las cosas
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Descubrirás cómo resolver problemas reales con nuevas perspectivas tecnológicas, mejores prácticas de la industria y la mentalidad de nunca dejar de practicar.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Innovación constante</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
