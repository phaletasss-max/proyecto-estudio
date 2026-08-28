import React from 'react';
import { Difficulty, DIFFICULTY_COLORS } from '@/types/ctf';
import { useTheme } from '@/context/ThemeContext';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const { theme } = useTheme();
  const colors = DIFFICULTY_COLORS[difficulty] || { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
  
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const dotSizeClasses = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colors.bg} ${colors.border} ${theme === 'dark' ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
      <span className={`rounded-full ${colors.bg} ${dotSizeClasses} ${theme === 'dark' ? '' : 'opacity-80'}`} />
      <span className={`font-medium ${colors.text}`}>{difficulty}</span>
    </span>
  );
};
