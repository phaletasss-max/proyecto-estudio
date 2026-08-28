import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Globe, Link2, MessageSquare, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { AvatarPicker } from '@/components/AvatarPicker';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [discordTag, setDiscordTag] = useState(user?.discordTag || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      fullName,
      bio,
      specialty,
      avatarUrl,
      githubUrl,
      discordTag,
      linkedinUrl,
    });
    setSaving(false);
    onClose();
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-colors ${
    isDark
      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
  }`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl my-auto ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-xl border transition-colors ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white bg-slate-900' : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-[Orbitron]">Editar Perfil Hacker</h2>
              <p className="text-xs font-mono text-slate-400">Personaliza tu identidad en ShadowBytes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Picker Component */}
            <AvatarPicker currentAvatar={avatarUrl} onSelect={setAvatarUrl} />

            {/* Name + Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-slate-400">Nombre Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre real o alias"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-1 text-slate-400">Especialidad Principal</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ej: Forense de Redes / Web SQLi"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-mono mb-1 text-slate-400">Biografía / Acerca de ti</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Describe tus intereses en ciberseguridad, experiencia en SENATI..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-mono font-semibold text-slate-400">Enlaces y Redes</label>

              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/tu-usuario"
                  className={`${inputClass} pl-9`}
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="Usuario Discord (ej: mi_user#1234)"
                  className={`${inputClass} pl-9`}
                />
              </div>

              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-semibold border ${
                  isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-600/20"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
