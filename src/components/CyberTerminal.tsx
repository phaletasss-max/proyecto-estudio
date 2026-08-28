import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Trash2, Shield, Play } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CyberTerminalProps {
  labSlug?: string;
  targetIp?: string;
}

interface CommandHistory {
  id: string;
  command: string;
  output: string;
  type?: 'stdout' | 'stderr' | 'system';
}

export const CyberTerminal: React.FC<CyberTerminalProps> = ({ labSlug = 'laravel-rce', targetIp = '10.10.184.72' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [logs, setLogs] = useState<CommandHistory[]>([
    {
      id: 'init-1',
      command: 'system info',
      output: `[+] ShadowBytes CyberConsole v2.4 (Kali / Ubuntu Hybrid Sandbox)\n[+] Target Subnet: 10.10.0.0/16 | Connected Target IP: ${targetIp}\n[+] Escribe "help" para ver los comandos de reconocimiento y auditoría disponibles.`,
      type: 'system',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const raw = cmd.trim();
    if (!raw) return;

    setPastCommands((prev) => [...prev, raw]);
    setHistoryIndex(null);

    const lower = raw.toLowerCase();
    let response = '';
    let type: 'stdout' | 'stderr' | 'system' = 'stdout';

    if (lower === 'clear' || lower === 'cls') {
      setLogs([]);
      setInput('');
      return;
    } else if (lower === 'help' || lower === '?') {
      response = `
================= COMANDOS DISPONIBLES =================
- help                   : Muestra este menú de ayuda
- nmap [ip]              : Escaneo de puertos y detección de versiones
- curl [url]             : Petición HTTP e inspección de headers
- gobuster dir [url]     : Fuzzing y enumeración de rutas y directorios
- php artisan [cmd]      : Consola de comandos del Framework Laravel
- cat [archivo]          : Leer archivos del sistema (.env, flag.txt, etc.)
- whoami / id            : Identidad del usuario actual
- ls -la                 : Listar archivos en el directorio actual
- ping [ip]              : Enviar paquetes ICMP al host objetivo
- clear                  : Limpiar la pantalla de la terminal
========================================================
      `.trim();
    } else if (lower.startsWith('ping')) {
      response = `PING ${targetIp} (56 data bytes)\n64 bytes from ${targetIp}: icmp_seq=1 ttl=64 time=12.4 ms\n64 bytes from ${targetIp}: icmp_seq=2 ttl=64 time=11.8 ms\n64 bytes from ${targetIp}: icmp_seq=3 ttl=64 time=12.1 ms\n--- ${targetIp} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2004ms`;
    } else if (lower.startsWith('nmap')) {
      response = `
Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-27 10:45
Nmap scan report for ${targetIp}
Host is up (0.012s latency).
Not shown: 996 closed tcp ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    nginx/1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: ShadowBytes Laravel Application - Portal SENATI
|_http-generator: Laravel 10.x (PHP 8.2.10)
8000/tcp open  http-alt PHP cli server 8.2.10 (Ignition Debug enabled)
3306/tcp open  mysql   MySQL 8.0.35-0ubuntu0.22.04.1

Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds
      `.trim();
    } else if (lower.startsWith('curl')) {
      response = `
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 27 Aug 2026 10:46:12 GMT
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
X-Powered-By: PHP/8.2.10
Set-Cookie: shadowbytes_session=eyJpdiI6Ilp...; expires=Thu, 27-Aug-2026 12:46:12 GMT; path=/; httponly

<!DOCTYPE html>
<html lang="es">
<head>
  <title>Laravel Portal - SENATI 4.º Ciclo</title>
  <!-- Framework: Laravel v10.48.4 (PHP v8.2.10) -->
</head>
<body>
  <h1>Bienvenido al Sistema de Gestión Interno</h1>
  <p>Acceso restringido para estudiantes y docentes.</p>
</body>
</html>
      `.trim();
    } else if (lower.startsWith('gobuster') || lower.startsWith('dirb')) {
      response = `
===============================================================
Gobuster v3.6 - Directory & File Enumeration Mode
Target: http://${targetIp}/
Wordlist: /usr/share/wordlists/dirb/common.txt
===============================================================
/.env                 (Status: 200) [Size: 842] --> CRITICAL EXPOSURE!
/storage              (Status: 301) [Size: 178] [--> http://${targetIp}/storage/]
/storage/logs/laravel.log (Status: 200) [Size: 14205]
/_ignition/health-check (Status: 200) [Size: 12]
/_ignition/execute-solution (Status: 200) [Size: 45] --> CVE-2021-3129 RCE!
/login                (Status: 200) [Size: 2450]
/api/v1/users         (Status: 401) [Size: 64]
/robots.txt           (Status: 200) [Size: 32]
===============================================================
      `.trim();
    } else if (lower.startsWith('php artisan') || lower === 'artisan') {
      response = `
Laravel Framework 10.48.4

Usage:
  command [options] [arguments]

Options:
  -h, --help            Display help for the given command
  -q, --quiet           Do not output any message
  -V, --version         Display this application version

Available commands:
  env                   Display the current framework environment
  migrate               Run the database migrations
  route:list            List all registered routes
  tinker                Interact with your application
  ignition:test         Test Ignition debug solutions
  key:generate          Set the application key
      `.trim();
    } else if (lower === 'cat .env' || lower === 'cat /.env') {
      response = `
APP_NAME=ShadowBytes-SENATI
APP_ENV=local
APP_KEY=base64:dGVzdGtleTEyMzQ1Njc4OWFiY2RlZjEyMzQ1Njc4OTA=
APP_DEBUG=true
APP_URL=http://${targetIp}

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shadowbytes_db
DB_USERNAME=root
DB_PASSWORD=HTB{l4r4v3l_d3bug_3nv_3xp0s3d_2026}

# CTF FLAG: HTB{l4r4v3l_d3bug_3nv_3xp0s3d_2026}
      `.trim();
    } else if (lower === 'cat /etc/passwd') {
      response = `
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
senati_admin:x:1000:1000:Manuel SENATI:/home/senati_admin:/bin/bash
instructor_kenky:x:1001:1001:Victor Kenky:/home/instructor_kenky:/bin/bash
      `.trim();
    } else if (lower === 'whoami') {
      response = 'www-data (Laravel Web Server Worker)';
    } else if (lower === 'id') {
      response = 'uid=33(www-data) gid=33(www-data) groups=33(www-data)';
    } else if (lower === 'ls' || lower === 'ls -la' || lower === 'dir') {
      response = `
total 248
drwxr-xr-x 12 www-data www-data   4096 Aug 27 10:40 .
drwxr-xr-x  3 root     root       4096 Aug 25 18:20 ..
-rw-r--r--  1 www-data www-data    842 Aug 27 10:35 .env
-rw-r--r--  1 www-data www-data   1240 Aug 26 14:10 artisan
drwxr-xr-x  6 www-data www-data   4096 Aug 26 14:10 app
drwxr-xr-x  2 www-data www-data   4096 Aug 26 14:10 bootstrap
drwxr-xr-x  2 www-data www-data   4096 Aug 26 14:10 config
drwxr-xr-x  5 www-data www-data   4096 Aug 26 14:10 database
drwxr-xr-x  7 www-data www-data   4096 Aug 26 14:10 public
drwxr-xr-x  5 www-data www-data   4096 Aug 26 14:10 routes
drwxr-xr-x  5 www-data www-data   4096 Aug 26 14:10 storage
-rw-r--r--  1 root     root         42 Aug 27 10:41 flag.txt
      `.trim();
    } else if (lower === 'cat flag.txt' || lower === 'cat flag') {
      response = 'HTB{l4r4v3l_10_cve_2021_3129_pwn3d_2026}';
    } else {
      response = `bash: ${raw.split(' ')[0]}: command not found. Escribe "help" para ver las herramientas soportadas.`;
      type = 'stderr';
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: raw,
        output: response,
        type,
      },
    ]);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const nextIdx = historyIndex === null ? pastCommands.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(pastCommands[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== null) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < pastCommands.length) {
          setHistoryIndex(nextIdx);
          setInput(pastCommands[nextIdx]);
        } else {
          setHistoryIndex(null);
          setInput('');
        }
      }
    }
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden font-mono shadow-2xl transition-all ${
        isExpanded ? 'fixed inset-4 z-50 flex flex-col' : 'relative'
      } ${isDark ? 'bg-[#0a0e17] border-slate-800 text-slate-200' : 'bg-slate-950 border-slate-800 text-slate-100'}`}
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">
            kali@shadowbytes:~# attackbox [{targetIp}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick preset buttons */}
          <button
            onClick={() => handleCommand('nmap ' + targetIp)}
            className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] border border-purple-500/30"
          >
            nmap
          </button>
          <button
            onClick={() => handleCommand('gobuster dir ' + targetIp)}
            className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] border border-cyan-500/30"
          >
            gobuster
          </button>
          <button
            onClick={() => handleCommand('php artisan')}
            className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] border border-red-500/30"
          >
            artisan
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Limpiar terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-white"
            title={isExpanded ? 'Minimizar' : 'Maximizar'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`p-4 overflow-y-auto text-xs leading-relaxed ${
          isExpanded ? 'flex-1 min-h-0' : 'max-h-72 min-h-[180px]'
        }`}
      >
        {logs.map((entry) => (
          <div key={entry.id} className="mb-3">
            {/* Command Header */}
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="text-purple-400">kali@shadowbytes:~$</span>
              <span className="text-white">{entry.command}</span>
            </div>

            {/* Output */}
            <pre
              className={`mt-1 whitespace-pre-wrap font-mono ${
                entry.type === 'stderr'
                  ? 'text-rose-400'
                  : entry.type === 'system'
                    ? 'text-emerald-400/90'
                    : 'text-slate-300'
              }`}
            >
              {entry.output}
            </pre>
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center gap-2 text-cyan-400 font-bold mt-2">
          <span className="text-purple-400">kali@shadowbytes:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe 'help', 'nmap', 'gobuster', 'php artisan' o 'cat .env'..."
            className="flex-1 bg-transparent text-emerald-400 font-mono text-xs focus:outline-none placeholder-slate-600"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
