import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload as UploadIcon, Check, AlertCircle, Eye, FileText } from 'lucide-react';
import { WriteupRenderer } from '@/components/WriteupRenderer';
import { useTheme } from '@/context/ThemeContext';
import { useUploadLab } from '@/hooks/useUploadLab';
import type { Difficulty, CTFCategory, LabFormData } from '@/types/ctf';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Insane'];
const CATEGORIES: CTFCategory[] = ['Web', 'Forensics', 'Pwn', 'Crypto', 'Reversing', 'Network', 'Misc'];

export const Upload: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { uploadLab, uploading, error, success, reset } = useUploadLab();
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState<LabFormData>({
    title: '',
    slug: '',
    difficulty: 'Easy',
    category: 'Web',
    description: '',
    writeup_markdown: '',
    flag: '',
    zipFile: null,
  });

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setForm(prev => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.flag || !form.writeup_markdown) return;
    await uploadLab(form);
  };

  const inputClasses = `w-full px-4 py-2.5 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
    isDark
      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
  }`;

  const labelClasses = `block text-xs font-mono font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  if (success) {
    return (
      <section className="pt-28 pb-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl border p-10 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ¡Lab subido exitosamente!
            </h2>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Tu writeup ha sido enviado. Estará disponible después de la revisión del equipo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/labs"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors"
              >
                Ver Labs
              </Link>
              <button
                onClick={() => { reset(); setForm({ title: '', slug: '', difficulty: 'Easy', category: 'Web', description: '', writeup_markdown: '', flag: '', zipFile: null }); }}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors border ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Subir otro
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/labs"
            className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Labs
          </Link>

          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <UploadIcon className="w-7 h-7 inline-block mr-2 text-purple-500" />
            Subir Writeup
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comparte tu resolución de un CTF con la comunidad ShadowBytes
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Title */}
          <div>
            <label className={labelClasses}>Título del Lab *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: Forense de Redes — Router Gateway"
              className={inputClasses}
              required
            />
            {form.slug && (
              <p className={`mt-1 text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Slug: {form.slug}
              </p>
            )}
          </div>

          {/* Difficulty + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Dificultad</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                className={inputClasses}
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as CTFCategory }))}
                className={inputClasses}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Descripción breve</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Resumen corto del reto..."
              rows={2}
              className={inputClasses}
            />
          </div>

          {/* Flag */}
          <div>
            <label className={labelClasses}>Flag del Reto *</label>
            <input
              type="text"
              value={form.flag}
              onChange={(e) => setForm(prev => ({ ...prev, flag: e.target.value }))}
              placeholder="HTB{tu_flag_aqui}"
              className={inputClasses}
              required
            />
            <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Se almacenará como hash SHA-256. Los usuarios deberán ingresar la flag para desbloquear el writeup.
            </p>
          </div>

          {/* ZIP Upload */}
          <div>
            <label className={labelClasses}>Archivo ZIP (opcional)</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setForm(prev => ({ ...prev, zipFile: e.target.files?.[0] || null }))}
              className={`w-full text-sm font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer transition-colors ${
                isDark
                  ? 'text-slate-400 file:bg-slate-800 file:text-purple-400 hover:file:bg-slate-700'
                  : 'text-slate-500 file:bg-slate-100 file:text-purple-600 hover:file:bg-slate-200'
              }`}
            />
          </div>

          {/* Writeup Markdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClasses}>Writeup (Markdown) *</label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`text-xs font-mono flex items-center gap-1 transition-colors ${
                  isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
                }`}
              >
                {showPreview ? <FileText className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPreview ? 'Editar' : 'Preview'}
              </button>
            </div>
            {showPreview ? (
              <div className={`rounded-xl border p-4 min-h-[200px] ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <WriteupRenderer content={form.writeup_markdown || '*Escribe tu writeup en Markdown...*'} />
              </div>
            ) : (
              <textarea
                value={form.writeup_markdown}
                onChange={(e) => setForm(prev => ({ ...prev, writeup_markdown: e.target.value }))}
                placeholder={`# Título del Writeup\n\n## Paso 1: Reconocimiento\n\nDescribe los pasos...\n\n\`\`\`bash\nnmap -sV target\n\`\`\`\n\n## Flag\n\n\`HTB{tu_flag}\``}
                rows={12}
                className={`${inputClasses} resize-y`}
                required
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !form.title || !form.flag || !form.writeup_markdown}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <UploadIcon className="w-4 h-4" />
                Publicar Writeup
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Upload;
