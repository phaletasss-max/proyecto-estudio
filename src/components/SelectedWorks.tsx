import { motion } from 'framer-motion'
import { useSiteContent } from '../context/SiteContent'

interface SkillItem {
  id: number
  title: string
  tag: string
  span: number
  img: string
  details: string[]
  techs: string[]
}

const SKILLS: Omit<SkillItem, 'img'>[] = [
  {
    id: 1,
    title: 'Redes e Infraestructura',
    tag: 'Cisco / R&S',
    span: 7,
    details: [
      'Certificaciones: Cisco CCNA 1 y 2 (En preparación para CCNA 3).',
      'Protocolos: Configuración y optimización de OSPF, EIGRP, ACLs y priorización QoS.',
      'Seguridad: Implementación de políticas de acceso, segmentación de VLANs y hardening.'
    ],
    techs: ['Cisco IOS', 'OSPF', 'VLANs', 'QoS', 'ACLs', 'Wireshark']
  },
  {
    id: 2,
    title: 'Sistemas Operativos y Servidores',
    tag: 'SysAdmin',
    span: 5,
    details: [
      'Linux: Administración en Arch Linux, Ubuntu Server, Red Hat y Kali Linux.',
      'Servicios: Gestión corporativa e integración de SMTP, OAuth, SSH y VPNs.'
    ],
    techs: ['Arch Linux', 'Ubuntu Server', 'Red Hat', 'SSH/VPN', 'Docker', 'Kali Linux']
  },
  {
    id: 3,
    title: 'Desarrollo Web & Ciberseguridad',
    tag: 'LAMP / Secure Dev',
    span: 5,
    details: [
      'Stack Principal: HTML5, CSS3, PHP y MySQL (Entornos LAMP).',
      'Seguridad Web: Auditoría de vulnerabilidades y autenticación basada en roles.',
      'Remediación: Corrección de fallos en bases de datos y control de accesos.'
    ],
    techs: ['HTML/CSS', 'PHP', 'MySQL', 'LAMP', 'Secure Auth', 'SQLi Mitigation']
  },
  {
    id: 4,
    title: 'Automatización e IoT',
    tag: 'Hardware / Scripting',
    span: 7,
    details: [
      'IoT: Integración y programación de microcontroladores (ESP32) y biométricos.',
      'Flujos de Trabajo: Configuración de entornos automatizados y estructura de sistemas.'
    ],
    techs: ['ESP32', 'Python', 'Biometrics', 'Git', 'IoT Security', 'Sensors']
  },
]

const inView = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

const SPAN_CLASSES: Record<number, string> = {
  5: 'md:col-span-5',
  7: 'md:col-span-7',
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
]

export default function SelectedWorks() {
  const { content } = useSiteContent()
  const skills: SkillItem[] = SKILLS.map((s, i) => ({
    ...s,
    img: content.skillImages[i] || DEFAULT_IMAGES[i],
  }))

  return (
    <section id="work" className="py-16 md:py-24" style={{ backgroundColor: 'hsl(var(--bg))' }}>
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
                Habilidades
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'hsl(var(--text))' }}>
              Portafolio{' '}
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                tecnológico
              </em>
            </h2>
            <p className="text-sm max-w-lg" style={{ color: 'hsl(var(--muted))' }}>
              Especialización técnica y áreas de enfoque en administración de sistemas, redes, desarrollo seguro y automatización.
            </p>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {skills.map((s, i) => (
            <motion.div
              key={s.id}
              className={`group premium-card rounded-3xl h-[390px] md:h-[440px] flex flex-col justify-between p-6 md:p-8 col-span-1 ${SPAN_CLASSES[s.span] || 'md:col-span-12'}`}
              variants={inView}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Background Image */}
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 transition-all duration-700 group-hover:scale-105 group-hover:opacity-10 pointer-events-none"
              />

              {/* Dark overlay fade from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 pointer-events-none" />

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Top bar with tag */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full glass-badge">
                    {s.tag}
                  </span>
                </div>

                {/* Middle details */}
                <div className="my-auto">
                  <h3
                    className="text-xl md:text-2xl mb-3 font-semibold transition-colors duration-300 group-hover:text-blue-300"
                    style={{ color: 'hsl(var(--text))' }}
                  >
                    {s.title}
                  </h3>
                  
                  {/* Detailed lists */}
                  <ul className="space-y-1.5 md:space-y-2 opacity-95">
                    {s.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="text-xs md:text-sm flex items-start gap-2 leading-relaxed"
                        style={{ color: 'hsl(var(--muted))' }}
                      >
                        <span className="text-blue-400 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400/80" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom tech badges */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                  {s.techs.map(tech => (
                    <span
                      key={tech}
                      className="text-[10px] md:text-xs px-2.5 py-1 rounded-md glass-badge cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
