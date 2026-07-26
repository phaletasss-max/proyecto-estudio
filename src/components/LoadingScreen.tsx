import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORDS = ['Asegurar', 'Conectar', 'Automatizar']

interface Props {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const [count, setCount]     = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const startRef              = useRef<number | null>(null)
  const rafRef                = useRef<number>(0)
  const doneRef               = useRef(false)

  /* ── Counter (0→100 over 2700ms) ─────────────────────── */
  useEffect(() => {
    const duration = 2700
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const next    = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setCount(next)
      if (next < 100) {
        rafRef.current = requestAnimationFrame(animate)
      } else if (!doneRef.current) {
        doneRef.current = true
        setTimeout(onComplete, 400)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onComplete])

  /* ── Word cycling (every 900ms) ───────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: 'hsl(var(--bg))' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Top-left label */}
      <motion.p
        className="absolute top-8 left-8 text-xs uppercase tracking-[0.3em]"
        style={{ color: 'hsl(var(--muted))' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Portafolio
      </motion.p>

      {/* Center word */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIdx}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic select-none"
            style={{ color: 'hsl(var(--text) / 0.8)', fontFamily: "'Instrument Serif', serif" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {WORDS[wordIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <motion.div
        className="absolute bottom-16 right-8 text-6xl md:text-8xl lg:text-9xl font-display tabular-nums select-none"
        style={{ color: 'hsl(var(--text))', fontFamily: "'Instrument Serif', serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {String(count).padStart(3, '0')}
      </motion.div>

      {/* Bottom progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ backgroundColor: 'hsl(var(--stroke) / 0.5)' }}
      >
        <motion.div
          className="h-full accent-gradient origin-left"
          style={{
            scaleX: count / 100,
            boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
          }}
        />
      </div>
    </motion.div>
  )
}
