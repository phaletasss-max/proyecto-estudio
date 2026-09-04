import React, { useState } from 'react';
import { Info, Terminal as TerminalIcon, Trash2 } from 'lucide-react';

interface CyberTerminalProps {
  labSlug?: string;
}

interface TerminalLine {
  command: string;
  output: string;
}

const SAFE_COMMANDS: Record<string, string> = {
  help: 'Comandos educativos: pwd, ls, whoami, ip addr, ip route, clear. Este simulador no ejecuta procesos ni se conecta a una máquina.',
  pwd: '/home/student/lab',
  ls: 'README.md  evidence/  notes.txt',
  'ls -la': 'drwxr-xr-x student student .\ndrwxr-xr-x student student evidence\n-rw-r--r-- student student README.md\n-rw-r--r-- student student notes.txt',
  whoami: 'student',
  'ip addr': 'Consulta de ejemplo: identifica interfaces, direcciones y máscaras. Los datos reales están en los archivos del laboratorio.',
  'ip route': 'Consulta de ejemplo: busca la ruta default y relaciona su interfaz con la evidencia del reto.',
  'cat readme.md': 'Objetivo: practica la lectura de comandos sin ejecutar nada en tu equipo. Abre los recursos del laboratorio para investigar la respuesta.',
};

export const CyberTerminal: React.FC<CyberTerminalProps> = ({ labSlug }) => {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([]);

  const run = () => {
    const command = input.trim();
    if (!command) return;
    if (command.toLowerCase() === 'clear') {
      setLines([]);
      setInput('');
      return;
    }
    const output = SAFE_COMMANDS[command.toLowerCase()] || 'Comando no disponible en el simulador. Escribe “help” para ver las opciones.';
    setLines((current) => [...current, { command, output }]);
    setInput('');
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-[#090c12]" aria-labelledby="terminal-title">
      <header className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-violet-300" />
          <h2 id="terminal-title" className="text-sm font-bold text-white">Simulador de terminal</h2>
          {labSlug && <span className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-400">{labSlug}</span>}
        </div>
        <button type="button" onClick={() => setLines([])} className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Limpiar simulador"><Trash2 className="h-4 w-4" /> Limpiar</button>
      </header>

      <div className="flex gap-2 border-b border-amber-400/15 bg-amber-400/5 px-4 py-3 text-sm leading-6 text-amber-100">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
        <p>Entorno educativo sin conexión: no ejecuta comandos reales, no representa una VPN y nunca contiene flags o credenciales.</p>
      </div>

      <div className="min-h-64 max-h-[28rem] overflow-y-auto p-4 font-mono text-sm leading-6 text-slate-300" aria-live="polite">
        <p className="text-slate-500">Escribe <span className="text-violet-300">help</span> para comenzar.</p>
        {lines.map((line, index) => <div key={`${line.command}-${index}`} className="mt-4"><p><span className="text-emerald-300">student@shadowbytes</span>:<span className="text-cyan-300">~/lab</span>$ {line.command}</p><pre className="mt-1 whitespace-pre-wrap font-mono text-slate-400">{line.output}</pre></div>)}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); run(); }} className="flex items-center gap-2 border-t border-slate-800 p-3">
        <span className="font-mono text-sm text-emerald-300" aria-hidden="true">$</span>
        <label htmlFor="terminal-command" className="sr-only">Comando del simulador</label>
        <input id="terminal-command" value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" spellCheck={false} className="min-h-11 flex-1 bg-transparent px-2 font-mono text-sm text-white outline-none placeholder:text-slate-600" placeholder="help" />
        <button type="submit" className="min-h-11 rounded-lg bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-700">Ejecutar</button>
      </form>
    </section>
  );
};
