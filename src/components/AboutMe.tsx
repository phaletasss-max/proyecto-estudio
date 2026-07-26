import { motion } from 'framer-motion'
import { useSiteContent } from '../context/SiteContent'

const CERTIFICATIONS = [
  { name: 'Cisco CCNA 1', status: 'Completado', progress: 100, color: '#4ade80', glow: 'glowing-dot-green' },
  { name: 'Cisco CCNA 2', status: 'Completado', progress: 100, color: '#4ade80', glow: 'glowing-dot-green' },
  { name: 'Cisco CCNA 3', status: 'En curso', progress: 45, color: '#facc15', glow: 'glowing-dot-yellow' },
  { name: 'Arch Linux Admin', status: 'Avanzado', progress: 90, color: '#89AACC', glow: 'glowing-dot-green' },
  { name: 'Kali Linux Security', status: 'Avanzado', progress: 85, color: '#89AACC', glow: 'glowing-dot-green' },
]

const TOOLS = [
  'Cisco IOS', 'Packet Tracer', 'Wireshark', 'Nmap',
  'Arch Linux', 'Ubuntu Server', 'Red Hat', 'Kali Linux',
  'PHP', 'MySQL', 'HTML/CSS', 'Python',
  'ESP32', 'Git', 'SSH/VPN', 'Docker',
]

const inView = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function AboutMe() {
  const { content } = useSiteContent()

  const QUICK_FACTS = [
    { icon: '🎓', label: 'Institución', value: content.aboutInstitution },
    { icon: '📍', label: 'Ubicación', value: content.aboutLocation },
    { icon: '💼', label: 'RUC', value: content.aboutRuc },
    { icon: '🟢', label: 'Estado', value: content.aboutStatus },
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
              Sobre Mí
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'hsl(var(--text))' }}>
            Perfil{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              profesional
            </em>
          </h2>
          <p className="text-sm max-w-xl" style={{ color: 'hsl(var(--muted))' }}>
            Información clave para reclutadores y responsables de recursos humanos en ciberseguridad e infraestructura.
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
            {/* Avatar + Name */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              {/* Glowing Avatar container */}
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
                {/* Active pulse status ring */}
                <span className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full bg-green-500 border-2 border-[hsl(var(--bg))] glowing-dot-green" />
              </div>

              <h3 className="text-xl font-semibold mb-1 text-center" style={{ color: 'hsl(var(--text))' }}>
                {content.aboutName}
              </h3>
              <p className="text-sm mb-6 text-center" style={{ color: 'hsl(var(--muted))' }}>
                {content.aboutSubtitle}
              </p>

              {/* Quick facts bento cells */}
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
                    <span className="text-lg">{f.icon}</span>
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
          </motion.div>

          {/* Right Column — Certifications + Tools */}
          <motion.div
            className="lg:col-span-8 flex flex-col gap-6"
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.15 }}
          >
            {/* Certifications Card */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              <h3 className="text-lg font-semibold mb-5" style={{ color: 'hsl(var(--text))' }}>
                Certificaciones y Progreso
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
                        {/* Glowing dot for status */}
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cert.glow}`} style={{ backgroundColor: cert.color }} />
                        <span className="text-sm font-medium" style={{ color: 'hsl(var(--text))' }}>
                          {cert.name}
                        </span>
                      </div>
                      <span
                        className="text-[10px] px-2.5 py-0.5 rounded-full border font-semibold"
                        style={{
                          color: cert.color,
                          borderColor: `${cert.color}40`,
                          backgroundColor: `${cert.color}0d`,
                        }}
                      >
                        {cert.status} ({cert.progress}%)
                      </span>
                    </div>

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

            {/* Tools & Technologies */}
            <div className="premium-card p-6 md:p-8 rounded-3xl">
              <h3 className="text-lg font-semibold mb-5" style={{ color: 'hsl(var(--text))' }}>
                Herramientas y Tecnologías
              </h3>

              <div className="flex flex-wrap gap-2">
                {TOOLS.map((tool, i) => (
                  <motion.span
                    key={tool}
                    className="text-xs sm:text-sm px-4 py-2.5 rounded-full glass-badge cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    viewport={{ once: true }}
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
