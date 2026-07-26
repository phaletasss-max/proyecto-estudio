import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Cpu, Terminal, Lock, Activity, Sparkles } from 'lucide-react';

interface MetricItem {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

const metrics: MetricItem[] = [
  {
    number: '+120',
    title: 'CTF Flags Resueltas',
    description: 'Desafíos completados en hacking ético, criptografía, esteganografía y análisis forense.',
    icon: ShieldAlert,
    color: 'text-amber-600 border-amber-200 bg-amber-50',
    badge: 'HackTheBox & CTFs',
  },
  {
    number: '100%',
    title: 'Laboratorios Aislados',
    description: 'Entornos de prueba seguros con VirtualBox, VHDX y redes locales segmentadas.',
    icon: Lock,
    color: 'text-blue-600 border-blue-200 bg-blue-50',
    badge: 'Sandbox Seguro',
  },
  {
    number: '2022',
    title: 'Active Directory & DNS',
    description: 'Infraestructura empresarial en Windows Server 2022 con políticas GPO y DHCP.',
    icon: Cpu,
    color: 'text-cyan-600 border-cyan-200 bg-cyan-50',
    badge: 'Windows Server',
  },
  {
    number: '15+',
    title: 'Herramientas Kali Linux',
    description: 'Nmap, Wireshark, Burp Suite, Metasploit, John the Ripper y automatización en Bash.',
    icon: Terminal,
    color: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    badge: 'Pentesting Suite',
  },
  {
    number: 'Zero-Trust',
    title: 'Filosofía de Seguridad',
    description: 'Evaluación continua de vulnerabilidades y buenas prácticas en desarrollo web seguro.',
    icon: Shield,
    color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    badge: 'Metodología',
  },
  {
    number: '24/7',
    title: 'Telemetría & Monitoreo',
    description: 'Monitoreo de proyectos y coordinación continua a través de salas dedicadas en Discord.',
    icon: Activity,
    color: 'text-rose-600 border-rose-200 bg-rose-50',
    badge: 'Discord Active',
  },
];

export const CyberMetrics: React.FC = () => {
  return (
    <section className="py-20 relative z-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-blue-700 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MÉTRICAS & TELEMETRÍA DE CIBERSEGURIDAD</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Indicadores de <span className="gradient-text-blue">Rendimiento Técnico</span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Cubrimos desde la administración de servidores hasta la resolución de retos reales de ciberseguridad con métricas medibles.
          </p>
        </div>

        {/* Grid of Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${item.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      {item.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors mb-1">
                    {item.number}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
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
