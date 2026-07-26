import { createContext, useContext, useState, type ReactNode } from 'react'

/* ─── Tipos ─────────────────────────────────────────────── */
export interface SiteContent {
  // Hero
  heroVideoUrl: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  heroRoles: string[]

  // About
  aboutName: string
  aboutSubtitle: string
  aboutInstitution: string
  aboutLocation: string
  aboutRuc: string
  aboutStatus: string

  // Footer
  footerEmail: string
  footerCta: string
  footerLinkedin: string
  footerGithub: string
  footerWhatsapp: string

  // Selected Works images
  skillImages: string[]

  // Journal entries
  journalTitles: string[]

  // Explorations images
  explorationImages: string[]
}

const DEFAULT_CONTENT: SiteContent = {
  heroVideoUrl: 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8',
  heroEyebrow: 'SENATI • RUC 1073140317',
  heroTitle: 'Portafolio',
  heroDescription: 'Estudiante de Ciberseguridad en SENATI, enfocado en la administración de infraestructura de red, automatización y desarrollo web seguro. Apasionado por la seguridad informática, la configuración de redes empresariales y el despliegue de soluciones integrales.',
  heroRoles: ['Ciberseguridad', 'Redes y Conectividad', 'Infraestructura', 'Desarrollo Seguro'],

  aboutName: 'Estudiante de Ciberseguridad',
  aboutSubtitle: 'Administración de Redes e Infraestructura',
  aboutInstitution: 'SENATI',
  aboutLocation: 'Perú',
  aboutRuc: '1073140317',
  aboutStatus: 'Disponible',

  footerEmail: 'tu-correo@senati.pe',
  footerCta: '¿Listo para asegurar y automatizar tu infraestructura?',
  footerLinkedin: 'https://linkedin.com/in/tu-perfil',
  footerGithub: 'https://github.com/tu-usuario',
  footerWhatsapp: 'https://wa.me/51XXXXXXXXX',

  skillImages: [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  ],

  journalTitles: [
    'Implementación de enrutamiento OSPF y políticas QoS en entornos Cisco',
    'Seguridad y Hardening en Arch Linux: Configuración avanzada del Kernel y Firewalls',
    'Auditoría de aplicaciones LAMP: Mitigando inyecciones SQL y fallos XSS',
    'Automatización de sistemas IoT usando ESP32 y control biométrico seguro',
  ],

  explorationImages: [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
  ],
}

/* ─── Context ───────────────────────────────────────────── */
interface SiteContextType {
  content: SiteContent
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void
  reset: () => void
}

const SiteContext = createContext<SiteContextType>({
  content: DEFAULT_CONTENT,
  update: () => {},
  reset: () => {},
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  const reset = () => setContent(DEFAULT_CONTENT)

  return (
    <SiteContext.Provider value={{ content, update, reset }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContext)
}

export { DEFAULT_CONTENT }
