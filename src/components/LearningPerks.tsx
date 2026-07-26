import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Trophy, Compass, Sparkles, Rocket, Lightbulb, ShieldAlert } from 'lucide-react';

export const LearningPerks: React.FC = () => {
  return (
    <section className="py-20 relative z-10 bg-transparent border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUEVAS PERSPECTIVAS & RETOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Aprende lo que <span className="gradient-text-blue">no enseñan en las diapositivas</span>
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
            className="group relative rounded-3xl bg-slate-900/90 backdrop-blur-sm transform-gpu border border-slate-800 p-8 hover:border-blue-500/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
                DOMINIO & NUBE
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                Tu propio dominio y hosting web
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Si quieres aprender a configurar tu propio dominio personalizado (`tudominio.com`), desplegar en Vercel o la nube y estructurar proyectos web modernos, aquí aprenderás el paso a paso.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5 font-medium">
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
            className="group relative rounded-3xl bg-slate-900/90 backdrop-blur-sm transform-gpu border border-slate-800 p-8 hover:border-purple-500/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-2 font-semibold">
                CIBERSEGURIDAD & CTFS
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                CTFs, Hackatones y Labs
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Participamos en desafíos Capture The Flag (CTF), hackatones y pruebas de concepto de pentesting ético para potenciar tu perfil en ciberseguridad.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-purple-300 flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Pentesting & Hacking ético</span>
            </div>
          </motion.div>

          {/* Block 3: Cambio de Perspectiva */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 hover:border-emerald-500/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2 font-semibold">
                MENTALIDAD DE CRECIMIENTO
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                Otras formas de ver las cosas
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Descubrirás cómo resolver problemas reales con nuevas perspectivas tecnológicas, mejores prácticas de la industria y la mentalidad de nunca dejar de practicar.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-emerald-300 flex items-center gap-1.5 font-medium">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Innovación constante</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
