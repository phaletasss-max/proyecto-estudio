import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/context/ThemeContext';

interface WriteupRendererProps {
  content: string;
}

export const WriteupRenderer: React.FC<WriteupRendererProps> = ({ content }) => {
  const { theme } = useTheme();

  return (
    <div className={`writeup-content ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className={`text-3xl font-bold mt-8 mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`} {...props} />,
          h2: ({ node, ...props }) => <h2 className={`text-2xl font-bold mt-6 mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} {...props} />,
          h3: ({ node, ...props }) => <h3 className={`text-xl font-bold mt-5 mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} {...props} />,
          h4: ({ node, ...props }) => <h4 className={`text-lg font-bold mt-4 mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className={`text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 hover:decoration-blue-500 transition-colors`} target="_blank" rel="noopener noreferrer" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className={`border-l-4 pl-4 py-1 mb-4 italic rounded-r-lg ${
              theme === 'dark' ? 'border-blue-500 bg-blue-900/20 text-gray-300' : 'border-blue-500 bg-blue-50 text-gray-700'
            }`} {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className={`min-w-full border-collapse ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className={`border px-4 py-2 text-left font-bold ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-100 text-gray-900'}`} {...props} />,
          td: ({ node, ...props }) => <td className={`border px-4 py-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} {...props} />,
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;
            
            if (isInline) {
              return (
                <code className={`px-1.5 py-0.5 rounded-md font-mono text-sm ${
                  theme === 'dark' ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-pink-600'
                }`} {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <div className="rounded-lg overflow-hidden my-4 border border-gray-800">
                <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  {match && <span className="text-xs text-gray-500 ml-2 font-mono lowercase">{match[1]}</span>}
                </div>
                <pre className="bg-[#0d1117] p-4 overflow-x-auto">
                  <code className="text-gray-300 font-mono text-sm block" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
