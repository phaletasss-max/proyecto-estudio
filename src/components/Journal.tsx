import { motion } from 'framer-motion'
import { useSiteContent } from '../context/SiteContent'

const ENTRIES = [
  {
    id: 1,
    title: 'Implementación de enrutamiento OSPF y políticas QoS en entornos Cisco',
    tag: 'Redes',
    readTime: '5 min de lectura',
    date: 'Jul 2026',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80',
  },
  {
    id: 2,
    title: 'Seguridad y Hardening en Arch Linux: Configuración avanzada del Kernel y Firewalls',
    tag: 'Sistemas',
    readTime: '8 min de lectura',
    date: 'Jun 2026',
    img: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200&q=80',
  },
  {
    id: 3,
    title: 'Auditoría de aplicaciones LAMP: Mitigando inyecciones SQL y fallos XSS',
    tag: 'Seguridad Web',
    readTime: '6 min de lectura',
    date: 'May 2026',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80',
  },
  {
    id: 4,
    title: 'Automatización de sistemas IoT usando ESP32 y control biométrico seguro',
    tag: 'IoT',
    readTime: '7 min de lectura',
    date: 'Abr 2026',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
  },
]

const inView = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function Journal() {
  const { content } = useSiteContent()
  
  // Use dynamic titles from context if available
  const entries = ENTRIES.map((entry, idx) => ({
    ...entry,
    title: content.journalTitles[idx] || entry.title
  }))

  return (
    <section id="journal" className="py-16 md:py-24" style={{ backgroundColor: 'hsl(var(--bg))' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14"
          variants={inView}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: 'hsl(var(--stroke))' }} />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'hsl(var(--muted))' }}>
                Bitácora
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'hsl(var(--text))' }}>
              Notas e{' '}
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                investigaciones
              </em>
            </h2>
            <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
              Reflexiones sobre seguridad informática, administración de redes e infraestructura.
            </p>
          </div>

          <div className="hidden md:block mt-6 md:mt-0">
            <div className="relative group">
              <div className="absolute inset-[-2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #89AACC, #4E85BF)' }} />
              <button
                className="relative inline-flex items-center gap-2 rounded-full text-base font-semibold px-9 py-3.5 border transition-all duration-200 bg-[hsl(var(--surface))] hover:text-white"
                style={{ borderColor: 'hsl(var(--stroke))', color: 'hsl(var(--muted))' }}
              >
                Ver todas →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Entry list with premium card styling */}
        <div className="flex flex-col gap-4">
          {entries.map((entry, i) => (
            <motion.article
              key={entry.id}
              className="premium-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 rounded-[24px] cursor-pointer"
              variants={inView}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Left Side: Thumbnail + Title */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-white/10 p-[1.5px] bg-gradient-to-tr from-[#89AACC] to-[#4E85BF]">
                  <img src={entry.img} alt={entry.title} className="w-full h-full object-cover rounded-full" />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {entry.title}
                  </p>
                </div>
              </div>

              {/* Right Side: Meta Info */}
              <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-auto pl-16 sm:pl-0">
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full glass-badge">
                  {entry.tag}
                </span>
                <span className="text-xs text-[#a3a3a3] hidden md:inline">
                  {entry.readTime}
                </span>
                <span className="text-xs text-[#737373]">
                  {entry.date}
                </span>
                <span className="text-sm text-blue-400 group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
