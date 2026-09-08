import { ContentIcon } from '@/components/ContentIcon';
import { useState } from 'react'
import { useSiteContent, type SiteContent } from '../context/SiteContent'

/* ─── Field editor component ────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
        />
      )}
    </div>
  )
}

/* ─── Array field editor ────────────────────────────────── */
function ArrayField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const update = (idx: number, val: string) => {
    const copy = [...values]
    copy[idx] = val
    onChange(copy)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-xs text-white/30 w-5 text-right flex-shrink-0">{i + 1}.</span>
          <input
            type="text"
            value={v}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      ))}
    </div>
  )
}

/* ─── Collapsible section ───────────────────────────────── */
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="text-lg"><ContentIcon name={icon} /></span>
          <span className="text-sm font-semibold text-white">{title}</span>
        </span>
        <span className="text-white/40 text-sm transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          ▼
        </span>
      </button>
      {open && (
        <div className="p-5 pt-0 flex flex-col gap-4 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Main Admin Panel ──────────────────────────────────── */
export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { content, update, reset } = useSiteContent()
  const [saved, setSaved] = useState(false)

  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleUpdate = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    update(key, value)
    flash()
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ backgroundColor: 'hsl(0 0% 6%)' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/10 bg-black/80">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #89AACC, #4E85BF)', color: 'white' }}>
              <ContentIcon name="settings" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Panel de Administración</h1>
              <p className="text-[10px] text-white/40">Los cambios se aplican en tiempo real • Se pierden al recargar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-green-400 animate-pulse"> Aplicado</span>
            )}
            <button
              onClick={reset}
              className="text-xs px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
            >
              Restaurar todo
            </button>
            <button
              onClick={onClose}
              className="text-xs px-4 py-2 rounded-full text-white font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg, #89AACC, #4E85BF)' }}
            >
              ← Volver al sitio
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-4">

        {/* Hero Section */}
        <Section title="Hero (Página Principal)" icon="home">
          <Field
            label="URL del Video HLS"
            value={content.heroVideoUrl}
            onChange={v => handleUpdate('heroVideoUrl', v)}
          />
          <Field
            label="Texto superior (eyebrow)"
            value={content.heroEyebrow}
            onChange={v => handleUpdate('heroEyebrow', v)}
          />
          <Field
            label="Título principal"
            value={content.heroTitle}
            onChange={v => handleUpdate('heroTitle', v)}
          />
          <Field
            label="Descripción"
            value={content.heroDescription}
            onChange={v => handleUpdate('heroDescription', v)}
            multiline
          />
          <ArrayField
            label="Roles que rotan"
            values={content.heroRoles}
            onChange={v => handleUpdate('heroRoles', v)}
            placeholder="Ej: Ciberseguridad"
          />
        </Section>

        {/* About Section */}
        <Section title="Sobre Mí (Perfil Profesional)" icon="user">
          <Field
            label="Nombre / Título"
            value={content.aboutName}
            onChange={v => handleUpdate('aboutName', v)}
          />
          <Field
            label="Subtítulo"
            value={content.aboutSubtitle}
            onChange={v => handleUpdate('aboutSubtitle', v)}
          />
          <Field
            label="Institución"
            value={content.aboutInstitution}
            onChange={v => handleUpdate('aboutInstitution', v)}
          />
          <Field
            label="Ubicación"
            value={content.aboutLocation}
            onChange={v => handleUpdate('aboutLocation', v)}
          />
          <Field
            label="RUC"
            value={content.aboutRuc}
            onChange={v => handleUpdate('aboutRuc', v)}
          />
          <Field
            label="Estado actual"
            value={content.aboutStatus}
            onChange={v => handleUpdate('aboutStatus', v)}
          />
        </Section>

        {/* Images */}
        <Section title="Imágenes de Habilidades" icon="image">
          <p className="text-xs text-white/40 -mt-1">
            URLs de las imágenes de fondo del Bento Grid (4 tarjetas).
          </p>
          <ArrayField
            label="URLs de imágenes"
            values={content.skillImages}
            onChange={v => handleUpdate('skillImages', v)}
            placeholder="https://images.unsplash.com/..."
          />
        </Section>

        {/* Journal */}
        <Section title="Bitácora (Títulos de Artículos)" icon="file">
          <ArrayField
            label="Títulos de entradas"
            values={content.journalTitles}
            onChange={v => handleUpdate('journalTitles', v)}
            placeholder="Título del artículo..."
          />
        </Section>

        {/* Explorations */}
        <Section title="Laboratorios (Galería de Imágenes)" icon="flask">
          <p className="text-xs text-white/40 -mt-1">
            URLs de las 6 imágenes del carrusel parallax.
          </p>
          <ArrayField
            label="URLs de imágenes"
            values={content.explorationImages}
            onChange={v => handleUpdate('explorationImages', v)}
            placeholder="https://images.unsplash.com/..."
          />
        </Section>

        {/* Footer / Contact */}
        <Section title="Contacto y Redes Sociales" icon="mail">
          <Field
            label="Email de contacto"
            value={content.footerEmail}
            onChange={v => handleUpdate('footerEmail', v)}
          />
          <Field
            label="Frase CTA del Footer"
            value={content.footerCta}
            onChange={v => handleUpdate('footerCta', v)}
          />
          <Field
            label="URL de LinkedIn"
            value={content.footerLinkedin}
            onChange={v => handleUpdate('footerLinkedin', v)}
          />
          <Field
            label="URL de GitHub"
            value={content.footerGithub}
            onChange={v => handleUpdate('footerGithub', v)}
          />
          <Field
            label="URL de WhatsApp"
            value={content.footerWhatsapp}
            onChange={v => handleUpdate('footerWhatsapp', v)}
          />
        </Section>

        {/* Info box */}
        <div className="mt-4 p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-xs text-yellow-200/80 leading-relaxed">
            <strong className="text-yellow-300"> Importante:</strong> Todos los cambios realizados aquí son temporales
            y solo se aplican en esta sesión del navegador. Al recargar la página, se restaurarán los valores originales.
            Para cambios permanentes, edita directamente los archivos del código fuente.
          </p>
        </div>
      </div>
    </div>
  )
}
