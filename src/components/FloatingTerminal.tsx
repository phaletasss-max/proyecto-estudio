import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { CyberTerminal } from '@/components/CyberTerminal';
import { useTheme } from '@/context/ThemeContext';

export const FloatingTerminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950 border border-purple-500/40 text-purple-400 font-mono text-xs font-bold shadow-2xl shadow-purple-500/20 hover:border-purple-400 hover:text-white transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Terminal className="w-4 h-4" />
          <span>AttackBox Console</span>
        </motion.button>
      )}

      {/* Floating Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[540px] md:w-[620px] shadow-2xl rounded-2xl overflow-hidden border border-purple-500/40"
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>ShadowBytes Floating AttackBox</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <CyberTerminal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
