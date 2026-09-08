import { ContentIcon } from '@/components/ContentIcon';
import { motion } from 'framer-motion'
import { useSiteContent } from '../context/SiteContent'

const CERTIFICATIONS = [
  {
    name: 'Cisco CCNA – Módulo 1: Fundamentals of Networking & Protocols',
    status: 'Completado',
    progress: 100,
    color: '#4ade80',
    glow: 'glowing-dot-green',
    desc: 'Fundamentos de redes, modelo OSI/TCP-IP, direccionamiento IPv4/IPv6, subredes y protocolos.',
  },
  {
    name: 'Cisco CCNA – Módulo 2: Switching, Routing, and Wireless Essentials',
    status: 'Completado',
    progress: 100,
    color: '#4ade80',
    glow: 'glowing-dot-green',
    desc: 'VLANs, trunking (802.1Q), EtherChannel, STP, enrutamiento estático y redes inalámbricas.',
  },
  {
    name: 'Cisco CCNA – Módulo 3: Enterprise Networking, Security, and Automation',
    status: 'En curso',
    progress: 60,
    color: '#facc15',
    glow: 'glowing-dot-yellow',
    desc: 'Seguridad en redes empresariales, VPNs, OSPF, automatización con APIs y gestión de red.',
  },
]

const ACADEMIC_COMPETENCIES = [
  {
    title: 'Redes, Conmutación y Servicios de Infraestructura',
    icon: 'globe',
    items: [
      {
        name: 'Routing & Switching (Cisco)',
        detail: 'Diseño, segmentación y configuración de redes locales mediante VLANs, trunking (802.1Q), direccionamiento IPv4/IPv6, subredes, tablas de enrutamiento y políticas básicas de seguridad de red en switches y routers Cisco.',
      },
      {
        name: 'Simulación & Análisis de Tráfico',
        detail: 'Modelado de topologías de red en Cisco Packet Tracer, análisis de tráfico con Wireshark y resolución de diagramas lógicos/físicos en entorno de laboratorio.',
      },
      {
        name: 'Servicios de Red',
        detail: 'Configuración y conceptos básicos de servicios esenciales como DNS, DHCP, servicios de correo/web y modelos cliente-servidor.',
      },
    ],
  },
  {
    title: 'Administración de Sistemas Operativos & Entornos Linux',
    icon: 'terminal',
    items: [
      {
        name: 'Sistemas Operativos (Server & Workstation)',
        detail: 'Administración y despliegue básico en Linux (Ubuntu, Kali Linux, Arch Linux), Windows y Windows Server.',
      },
      {
        name: 'Automatización & Scripting',
        detail: 'Desarrollo de scripts y algoritmos de resolución de problemas en Python 3, C++ y Java, ejecutados de forma nativa en distribuciones Linux.',
      },
      {
        name: 'Virtualización de Dispositivos/IPs',
        detail: 'Implementación de interfaces de red virtuales en Ubuntu para la simulación de nodos e IPs ficticias en escenarios de pruebas de red.',
      },
    ],
  },
  {
    title: 'Prototipado IoT & Mecatrónica Básica',
    icon: 'zap',
    items: [
      {
        name: 'Sistemas Embebidos',
        detail: 'Simulación de circuitos electrónicos y programación de microcontroladores utilizando Tinkercad, sentando las bases para el desarrollo de proyectos hardware con microcontroladores más avanzados.',
      },
    ],
  },
]

const STACK_SUMMARY = [
  { category: 'Redes & Simulación', skills: ['Cisco IOS', 'Packet Tracer', 'Wireshark', 'Subnetting IPv4/IPv6', 'VLANs', 'Routing/Switching'] },
  { category: 'Sistemas Operativos', skills: ['Arch Linux', 'Ubuntu Server/Desktop', 'Kali Linux', 'Windows Server'] },
  { category: 'Lenguajes de Programación', skills: ['Python 3', 'C++', 'Java', 'Bash Scripting'] },
  { category: 'Herramientas de Diseño & IoT', skills: ['Tinkercad (Mecatrónica/IoT)', 'Git', 'GitHub', 'VirtualBox'] },
]

const inView = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function AboutMe() {
  const { content } = useSiteContent()

  const QUICK_FACTS = [
    { icon: 'award', label: 'Especialidad', value: 'Ciberseguridad' },
    { icon: 'building', label: 'Comunidad', value: 'ShadowBytes' },
    { icon: 'calendar', label: 'Formato', value: 'Rutas y laboratorios' },
    { icon: 'check', label: 'Enfoque', value: 'Práctica técnica' },
  ]

  return (
    <section id="about" className="py-16 md:py-24 border-t" style={{ backgroundColor: 'hsl(var(--bg))', borderColor: 'hsl(var(--stroke))' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          className="mb-12 md:mb-16"
          variants={inView}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'hsl(var(--stroke))' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'hsl(var(--muted))' }}>
              Formación y práctica técnica
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'hsl(var(--text))' }}>
            Estudiante de{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              Ciberseguridad
            </em>
          </h2>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: 'hsl(var(--muted))' }}>
            Rutas de práctica en infraestructura, redes, sistemas operativos y ciberseguridad, con laboratorios y documentación técnica.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column — Profile Card */}
          <motion.div
            className="lg:col-span-4 flex flex-col gap-6"
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* Avatar + Quick Facts */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              <div
                className="relative w-24 h-24 mx-auto rounded-full p-[2px] mb-5 group-hover:scale-105 transition-transform duration-500"
                style={{ background: 'linear-gradient(135deg, #89AACC, #4E85BF)', boxShadow: '0 0 20px rgba(78, 133, 191, 0.2)' }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-3xl font-display italic"
                  style={{ backgroundColor: 'hsl(var(--bg))', color: 'hsl(var(--text))' }}
                >
                  SE
                </div>
                <span className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full bg-green-500 border-2 border-[hsl(var(--bg))] glowing-dot-green" />
              </div>

              <h3 className="text-xl font-semibold mb-1 text-center" style={{ color: 'hsl(var(--text))' }}>
                {content.aboutName || 'ShadowBytes'}
              </h3>
              <p className="text-sm mb-6 text-center" style={{ color: 'hsl(var(--muted))' }}>
                Infraestructura, Redes & Ciberseguridad
              </p>

              {/* Quick facts cells */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {QUICK_FACTS.map(f => (
                  <div
                    key={f.label}
                    className="p-3.5 rounded-2xl border flex flex-col justify-between"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderColor: 'hsl(var(--stroke) / 0.7)',
                    }}
                  >
                    <span className="text-lg"><ContentIcon name={f.icon} /></span>
                    <div className="mt-2">
                      <p className="text-[9px] uppercase tracking-widest" style={{ color: 'hsl(var(--muted))' }}>
                        {f.label}
                      </p>
                      <p className="text-xs font-semibold truncate" style={{ color: 'hsl(var(--text))' }}>
                        {f.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download CV Button */}
              <a
                href="/cv.pdf"
                download
                className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 text-white"
                style={{
                  background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
                  boxShadow: '0 4px 15px rgba(78, 133, 191, 0.25)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar CV (PDF)
              </a>
            </div>

            {/* Academic Stack Summary Box */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--text))' }}>
                <span><ContentIcon name="terminal" /></span> Herramientas y tecnologías
              </h3>
              <div className="space-y-4">
                {STACK_SUMMARY.map(st => (
                  <div key={st.category}>
                    <p className="text-xs font-mono mb-2" style={{ color: 'hsl(var(--muted))' }}>
                      {st.category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {st.skills.map(sk => (
                        <span
                          key={sk}
                          className="text-[11px] px-2.5 py-1 rounded-lg border font-mono"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderColor: 'hsl(var(--stroke) / 0.6)',
                            color: 'hsl(var(--text))',
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column — Certifications + Labs */}
          <motion.div
            className="lg:col-span-8 flex flex-col gap-6"
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.15 }}
          >
            {/* Cisco Certifications Card */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: 'hsl(var(--text))' }}>
                <span><ContentIcon name="trophy" /></span> Certificaciones Cisco
              </h3>

              <div className="flex flex-col gap-4">
                {CERTIFICATIONS.map((cert, i) => (
                  <motion.div
                    key={cert.name}
                    className="p-4 rounded-2xl border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      borderColor: 'hsl(var(--stroke) / 0.7)',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cert.glow}`} style={{ backgroundColor: cert.color }} />
                        <span className="text-sm font-semibold" style={{ color: 'hsl(var(--text))' }}>
                          {cert.name}
                        </span>
                      </div>
                      <span
                        className="text-[10px] px-2.5 py-0.5 rounded-full border font-semibold shrink-0"
                        style={{
                          color: cert.color,
                          borderColor: `${cert.color}40`,
                          backgroundColor: `${cert.color}0d`,
                        }}
                      >
                        {cert.status} ({cert.progress}%)
                      </span>
                    </div>

                    <p className="text-xs mb-3 pl-5" style={{ color: 'hsl(var(--muted))' }}>
                      {cert.desc}
                    </p>

                    {/* Progress bar container */}
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cert.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cert.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Academic Competencies & Lab Projects */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: 'hsl(var(--text))' }}>
                <span><ContentIcon name="book" /></span> Áreas técnicas y laboratorios
              </h3>

              <div className="space-y-6">
                {ACADEMIC_COMPETENCIES.map((comp) => (
                  <div
                    key={comp.title}
                    className="p-5 rounded-2xl border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      borderColor: 'hsl(var(--stroke) / 0.7)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl"><ContentIcon name={comp.icon} /></span>
                      <h4 className="text-sm font-semibold" style={{ color: 'hsl(var(--text))' }}>
                        {comp.title}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {comp.items.map((item) => (
                        <div key={item.name} className="pl-4 border-l-2 border-blue-500/40">
                          <p className="text-xs font-bold mb-1" style={{ color: 'hsl(var(--text))' }}>
                            {item.name}
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted))' }}>
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
