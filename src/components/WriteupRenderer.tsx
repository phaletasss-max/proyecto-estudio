import { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const content = useRef<HTMLPreElement>(null);
  const [notice, setNotice] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(content.current?.textContent || ''); setNotice('Copiado'); }
    catch { setNotice('Selecciona el código para copiarlo'); }
  };
  return <div className="my-4 min-w-0 overflow-hidden rounded-lg border border-border bg-elevated">
    <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-1 text-xs text-muted">
      <span>Código / evidencia</span>
      <button type="button" onClick={copy} className="inline-flex min-h-10 items-center gap-2 text-foreground" aria-label="Copiar código">{notice === 'Copiado' ? <Check size={14} /> : <Copy size={14} />} Copiar</button>
    </div>
    <pre {...props} ref={content} className="m-0 overflow-x-auto p-4 font-mono text-sm leading-6 text-foreground">{children}</pre>
    {notice && <p role="status" className="px-4 pb-2 text-xs text-muted">{notice}</p>}
  </div>;
}

export function WriteupRenderer({ content }: { content: string }) {
  return <div className="writeup-content min-w-0 break-words text-sm leading-7 text-foreground">
    <Markdown remarkPlugins={[remarkGfm]} components={{
      h1: ({node, ...props}) => <h2 className="mb-4 mt-6 text-2xl font-semibold" {...props} />,
      h2: ({node, ...props}) => <h3 className="mb-3 mt-5 text-xl font-semibold" {...props} />,
      h3: ({node, ...props}) => <h4 className="mb-3 mt-4 text-base font-semibold" {...props} />,
      p: ({node, ...props}) => <p className="mb-4" {...props} />,
      a: ({node, ...props}) => <a className="text-info underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
      ul: ({node, ...props}) => <ul className="mb-4 list-disc space-y-1 pl-5" {...props} />,
      ol: ({node, ...props}) => <ol className="mb-4 list-decimal space-y-2 pl-5" {...props} />,
      blockquote: ({node, ...props}) => <blockquote className="mb-4 border-l-2 border-info bg-elevated p-3 text-muted" {...props} />,
      table: ({node, ...props}) => <div className="mb-4 overflow-x-auto"><table className="w-full border-collapse text-left" {...props} /></div>,
      th: ({node, ...props}) => <th className="border border-border bg-elevated px-3 py-2 font-semibold" {...props} />,
      td: ({node, ...props}) => <td className="border border-border px-3 py-2" {...props} />,
      pre: ({node, ...props}) => <CodeBlock {...props} />,
      code: ({node, ...props}) => <code className="rounded bg-elevated px-1 font-mono text-[0.9em] text-info" {...props} />,
    }}>{content}</Markdown>
  </div>;
}
