import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { useSiteContent } from '../context/SiteContent'

gsap.registerPlugin(ScrollTrigger)

const ROTS = [-3, 2, -1.5, 3, -2, 1.5]

export default function Explorations() {
  const { content } = useSiteContent()
  const ITEMS = content.explorationImages.map((img, i) => ({ id: i + 1, img, rot: ROTS[i] || 0 }))
  const col1 = ITEMS.slice(0, 3)
  const col2 = ITEMS.slice(3, 6)

  const sectionRef  = useRef<HTMLElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const col1Ref     = useRef<HTMLDivElement>(null)
  const col2Ref     = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !col1Ref.current || !col2Ref.current) return

    const ctx = gsap.context(() => {
      // Pin center content
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
      })

      // Parallax cols
      gsap.to(col1Ref.current, {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
      gsap.to(col2Ref.current, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Lightbox" className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl" />
        </div>
      )}

      <section
        ref={sectionRef}
        id="explorations"
        className="relative"
        style={{ minHeight: '300vh', backgroundColor: 'hsl(var(--bg))' }}
      >
        {/* Layer 1: Pinned center content */}
        <div
          ref={contentRef}
          className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: 'hsl(var(--stroke))' }} />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'hsl(var(--muted))' }}>
                Laboratorios
              </span>
              <div className="w-8 h-px" style={{ backgroundColor: 'hsl(var(--stroke))' }} />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4" style={{ color: 'hsl(var(--text))' }}>
              Entornos y{' '}
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                simulaciones
              </em>
            </h2>
            <p className="text-sm max-w-sm mx-auto mb-8" style={{ color: 'hsl(var(--muted))' }}>
              Demostraciones prácticas, configuraciones de red y maquetas de automatización IoT desarrolladas.
            </p>
            <div className="relative group inline-block">
              <div className="absolute inset-[-2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #89AACC, #4E85BF)' }} />
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2 rounded-full text-base md:text-lg font-semibold px-10 py-4.5 border transition-all duration-200"
                style={{ borderColor: 'hsl(var(--stroke))', color: 'hsl(var(--muted))' }}
              >
                Ver en GitHub ↗
              </a>
            </div>
          </motion.div>
        </div>

        {/* Layer 2: Parallax columns */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <div className="h-full max-w-[1400px] mx-auto px-6 grid grid-cols-2 gap-12 md:gap-40 items-start pt-[10vh]">
            <div ref={col1Ref} className="flex flex-col gap-8">
              {col1.map(item => (
                <div
                  key={item.id}
                  className="pointer-events-auto cursor-pointer group overflow-hidden rounded-2xl border aspect-square max-w-[320px]"
                  style={{
                    transform: `rotate(${item.rot}deg)`,
                    borderColor: 'hsl(var(--stroke))',
                  }}
                  onClick={() => setLightbox(item.img)}
                >
                  <img
                    src={item.img}
                    alt="Exploration"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            <div ref={col2Ref} className="flex flex-col gap-8 mt-[30vh]">
              {col2.map(item => (
                <div
                  key={item.id}
                  className="pointer-events-auto cursor-pointer group overflow-hidden rounded-2xl border aspect-square max-w-[320px] ml-auto"
                  style={{
                    transform: `rotate(${item.rot}deg)`,
                    borderColor: 'hsl(var(--stroke))',
                  }}
                  onClick={() => setLightbox(item.img)}
                >
                  <img
                    src={item.img}
                    alt="Exploration"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
