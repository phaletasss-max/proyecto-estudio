import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Thought {
  id: string
  content: string
  category: string
  date: string
}

const DEFAULT_THOUGHTS: Thought[] = [
  {
    id: '1',
    content: 'La ciberseguridad no es solo configurar un firewall, es una cultura constante de prevención, análisis de riesgos y concientización.',
    category: 'Ciberseguridad',
    date: '14 Jul 2026'
  },
  {
    id: '2',
    content: 'El enrutamiento moderno requiere cada vez más automatización. Integrar scripts de Python con APIs de red sobre equipos Cisco es el camino.',
    category: 'Redes',
    date: '10 Jul 2026'
  },
  {
    id: '3',
    content: 'Configurar Arch Linux desde cero te enseña exactamente qué servicios están activos, reduciendo la superficie de ataque del sistema.',
    category: 'Sistemas',
    date: '05 Jul 2026'
  }
]

const CATEGORIES = ['Ciberseguridad', 'Redes', 'Tecnología', 'Opinión', 'Personal']

export default function ThoughtsFeed() {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Ciberseguridad')

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('senati_portfolio_thoughts')
    if (saved) {
      try {
        setThoughts(JSON.parse(saved))
      } catch (e) {
        setThoughts(DEFAULT_THOUGHTS)
      }
    } else {
      setThoughts(DEFAULT_THOUGHTS)
      localStorage.setItem('senati_portfolio_thoughts', JSON.stringify(DEFAULT_THOUGHTS))
    }
  }, [])

  // Save to localStorage
  const saveThoughts = (updated: Thought[]) => {
    setThoughts(updated)
    localStorage.setItem('senati_portfolio_thoughts', JSON.stringify(updated))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const newThought: Thought = {
      id: Date.now().toString(),
      content: content.trim(),
      category,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    const updated = [newThought, ...thoughts]
    saveThoughts(updated)
    setContent('')
  }

  const handleDelete = (id: string) => {
    const updated = thoughts.filter(t => t.id !== id)
    saveThoughts(updated)
  }

  return (
    <section id="opinions" className="py-16 md:py-24 border-t" style={{ backgroundColor: 'hsl(var(--bg))', borderColor: 'hsl(var(--stroke))' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header */}
        <div className="flex flex-col mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'hsl(var(--stroke))' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'hsl(var(--muted))' }}>
              Mis Pensamientos
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'hsl(var(--text))' }}>
            Opiniones y{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              perspectivas
            </em>
          </h2>
          <p className="text-sm max-w-lg" style={{ color: 'hsl(var(--muted))' }}>
            Un espacio dinámico para compartir mis puntos de vista sobre ciberseguridad, tecnología, mi progreso y el mundo.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Form Column */}
          <div 
            className="lg:col-span-5 premium-card p-6 md:p-8 rounded-3xl flex flex-col gap-6"
          >
            <h3 className="text-lg font-semibold" style={{ color: 'hsl(var(--text))' }}>
              Agregar pensamiento
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Category selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted))' }}>
                  Categoría
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`text-xs sm:text-sm px-4 py-2.5 rounded-full border transition-all duration-200 ${
                        category === cat 
                          ? 'border-blue-400 text-blue-300 bg-blue-500/10' 
                          : 'border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea content */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted))' }}>
                  ¿Qué opinas hoy?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe tu opinión sobre habilidades, seguridad informática..."
                  rows={4}
                  className="w-full p-4 rounded-xl border text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--bg))',
                    borderColor: 'hsl(var(--stroke))',
                    color: 'hsl(var(--text))',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Submit button (large and bold) */}
              <button
                type="submit"
                disabled={!content.trim()}
                className="w-full py-4.5 px-8 rounded-full text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(78, 133, 191, 0.2)'
                }}
              >
                Publicar opinión
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--text))' }}>
              Publicaciones recientes ({thoughts.length})
            </h3>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {thoughts.length === 0 ? (
                  <p className="text-sm italic" style={{ color: 'hsl(var(--muted))' }}>
                    Aún no hay opiniones publicadas. ¡Sé el primero en compartir!
                  </p>
                ) : (
                  thoughts.map(thought => (
                    <motion.div
                      key={thought.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="premium-card p-5 rounded-2xl flex flex-col gap-3 group"
                    >
                      {/* Header with category and date */}
                      <div className="flex justify-between items-center">
                        <span
                          className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full glass-badge"
                        >
                          {thought.category}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px]" style={{ color: 'hsl(var(--muted))' }}>
                            {thought.date}
                          </span>
                          
                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(thought.id)}
                            className="text-white/40 hover:text-red-400 transition-colors text-xs p-1"
                            title="Eliminar publicación"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--text))' }}>
                        {thought.content}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
