import { ContentIcon } from '@/components/ContentIcon';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LabCard } from '@/components/LabCard';
import { useTheme } from '@/context/ThemeContext';
import { useLabs } from '@/hooks/useLabs';
import type { Difficulty, CTFCategory } from '@/types/ctf';
import { CATEGORY_ICONS } from '@/types/ctf';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Insane'];
const CATEGORIES: CTFCategory[] = ['Web', 'Forensics', 'Pwn', 'Crypto', 'Reversing', 'Network', 'Misc'];

export const Labs: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CTFCategory | null>(null);

  const { labs, loading, error } = useLabs({
    search: search || undefined,
    difficulty: selectedDifficulty,
    category: selectedCategory,
  });

  return (
    <section className="pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Trophy className="w-8 h-8 inline-block mr-2 text-purple-500" />
                Labs CTF
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {labs.length} labs disponibles • Resuelve retos y aprende con los writeups
              </p>
            </div>

            {/* Search */}
            <div className={`relative w-full sm:w-72 ${isDark ? '' : ''}`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Buscar labs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-3"
        >
          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedDifficulty === null
                  ? 'bg-purple-600 text-white'
                  : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              Todas
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedDifficulty === d
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-4" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === null
                  ? 'bg-cyan-600 text-white'
                  : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              Todas
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(selectedCategory === c ? null : c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedCategory === c
                    ? 'bg-cyan-600 text-white'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <ContentIcon name={CATEGORY_ICONS[c]} /> {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Labs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className={`text-center py-20 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            <p className="font-mono text-sm">{error}</p>
          </div>
        ) : labs.length === 0 ? (
          <div className={`text-center py-20 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-mono text-sm">No se encontraron labs con esos filtros</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {labs.map((lab, idx) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <LabCard lab={lab} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Labs;
