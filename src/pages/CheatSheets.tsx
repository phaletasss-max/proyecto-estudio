import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Copy, Check, Terminal, Sparkles, Filter } from 'lucide-react';
import { CHEATSHEETS, type CheatSheetSection, type CheatSheetCommand } from '@/data/cheatsheets';
import { useTheme } from '@/context/ThemeContext';

export const CheatSheets: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredSections = CHEATSHEETS.filter((section) => {
    if (selectedSection !== 'all' && section.id !== selectedSection) return false;
    return true;
  }).map((section) => {
    if (!search.trim()) return section;
    const q = search.toLowerCase();
    const filteredCommands = section.commands.filter(
      (c) =>
        c.command.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.framework?.toLowerCase().includes(q)
    );
    return { ...section, commands: filteredCommands };
  }).filter((section) => section.commands.length > 0);

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Base de Conocimiento & Cheat Sheets</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            CYBER <span className="gradient-text-blue">CHEATSHEETS</span>
          </h1>
          <p className={`mt-2 text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comandos esenciales para auditorías de Laravel, Active Directory en Windows Server 2022, Kali Linux y análisis de tráfico de red.
          </p>
        </motion.div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar comando o técnica..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-mono border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedSection('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 ${
                selectedSection === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            {CHEATSHEETS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedSection === s.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cheatsheet Sections List */}
        <div className="space-y-8">
          {filteredSections.map((section: CheatSheetSection) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border p-6 sm:p-8 shadow-xl ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold font-mono">{section.title}</h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                        {section.badge}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Commands Grid */}
              <div className="space-y-3">
                {section.commands.map((cmd: CheatSheetCommand, cIdx) => {
                  const isCopied = copiedCmd === cmd.command;

                  return (
                    <div
                      key={cIdx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDark ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/30' : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/20">
                            {cmd.category}
                          </span>
                          {cmd.framework && (
                            <span className="text-[10px] font-mono text-amber-400 font-semibold">
                              #{cmd.framework}
                            </span>
                          )}
                        </div>

                        <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {cmd.description}
                        </p>

                        <div className={`p-2.5 rounded-xl border font-mono text-xs overflow-x-auto select-all ${
                          isDark ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-400'
                        }`}>
                          <code>{cmd.command}</code>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(cmd.command)}
                        className={`self-start md:self-center shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                          isCopied
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                              : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 shadow-sm'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CheatSheets;
