import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { value: '2+', label: 'Certificaciones Cisco', sub: 'CCNA 1 y 2 listos, preparando CCNA 3' },
  { value: '4+', label: 'Distribuciones Linux', sub: 'Arch Linux, Kali, Ubuntu Server, Red Hat' },
  { value: '100%', label: 'Enfoque Técnico', sub: 'Hardening, enrutamiento y automatización' },
]

export default function Stats() {
  const countRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.5 }
    )
    countRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'hsl(var(--bg))' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-3xl overflow-hidden"
          style={{ backgroundColor: 'hsl(var(--stroke))' }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center py-16 px-8"
              style={{ backgroundColor: 'hsl(var(--bg))' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <span
                ref={el => { countRefs.current[i] = el }}
                className="text-5xl md:text-6xl lg:text-7xl font-display italic mb-3 gradient-text"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {stat.value}
              </span>
              <p className="text-base font-medium mb-1" style={{ color: 'hsl(var(--text))' }}>
                {stat.label}
              </p>
              <p className="text-xs" style={{ color: 'hsl(var(--muted))' }}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
