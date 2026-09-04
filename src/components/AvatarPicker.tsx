import React, { useState } from 'react';
import { Check, Upload, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const HACKER_AVATARS = [
  '/logo-shadowbytes.webp',
];

interface AvatarPickerProps {
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ currentAvatar, onSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [customUrl, setCustomUrl] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelect(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className={`block text-xs font-mono font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        Selecciona tu Avatar Hacker
      </label>

      {/* Preset Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
        {HACKER_AVATARS.map((url, idx) => {
          const isSelected = currentAvatar === url;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(url)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                isSelected
                  ? 'border-purple-500 scale-105 shadow-md shadow-purple-500/30'
                  : 'border-transparent hover:border-slate-600 hover:scale-102'
              }`}
            >
              <img src={url} alt={`Avatar preset ${idx}`} className="w-full h-full object-cover rounded-xl" />
              {isSelected && (
                <div className="absolute inset-0 bg-purple-600/30 backdrop-blur-[1px] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom URL or File */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="url"
              placeholder="https://... URL de imagen"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-mono font-bold"
          >
            Usar
          </button>
        </form>

        <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed cursor-pointer text-xs font-mono transition-colors ${
          isDark ? 'border-slate-700 hover:border-purple-500 text-slate-400 hover:text-white bg-slate-900/50' : 'border-slate-300 hover:border-purple-500 text-slate-600 hover:text-slate-900 bg-slate-50'
        }`}>
          <Upload className="w-4 h-4" />
          <span>Subir imagen local</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
};
