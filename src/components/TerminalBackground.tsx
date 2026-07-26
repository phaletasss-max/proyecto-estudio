import React, { useEffect, useState } from 'react';

const terminalSnippets = [
  'python3 -m ctf.forensics --target 10.0.4.10 --output-json',
  'import socket, sys, ssl',
  's = socket.socket(socket.AF_INET, socket.SOCK_STREAM)',
  's.connect(("senati.local", 443))',
  '# [OK] Connected to Windows Server 2022 IIS Web Service',
  'Get-ADDomainController -Filter * | Select-Object Name, IPAddress',
  '# DC-SENATI-LAB -> 10.0.4.10 [Active Directory Integrated]',
  'iptables -t nat -A POSTROUTING -o eth1_WAN_UPLINK -j MASQUERADE',
  '# Route established: 10.0.4.0/24 -> WAN 200.48.225.14',
  'nmap -sV --script=banner 10.0.4.10 -p 53,80,443,3389',
  '# 53/tcp   open  domain  Microsoft DNS (senati.local)',
  '# 80/tcp   open  http    Microsoft IIS/10.0',
  '# 3389/tcp open  rdp     Remote Desktop Protocol',
  'python3 -c "import hashlib; print(hashlib.sha256(b\'HTB{200.48.225.14}\').hexdigest())"',
  '# SHA256: 72694c6a272b7a3a2e1efd... [AES-256-GCM READY]',
  'git commit -m "feat: deploy to Vercel production"',
  '# Vercel Deployment SUCCESS -> https://4tociclo.vercel.app',
];

export const TerminalBackground: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentSnippetIdx, setCurrentSnippetIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  useEffect(() => {
    const currentText = terminalSnippets[currentSnippetIdx];

    if (currentCharIdx < currentText.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => {
          const newLines = [...prev];
          if (newLines.length === 0 || prev[prev.length - 1] === terminalSnippets[currentSnippetIdx - 1]) {
            newLines.push(currentText.slice(0, currentCharIdx + 1));
          } else {
            newLines[newLines.length - 1] = currentText.slice(0, currentCharIdx + 1);
          }
          return newLines.slice(-14); // Keep last 14 lines
        });
        setCurrentCharIdx((prev) => prev + 1);
      }, 35);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentCharIdx(0);
        setCurrentSnippetIdx((prev) => (prev + 1) % terminalSnippets.length);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIdx, currentSnippetIdx]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.07] select-none font-mono text-[11px] sm:text-xs text-blue-900 leading-relaxed p-6 flex flex-col justify-end">
      <div className="max-w-2xl space-y-1">
        {lines.map((line, idx) => {
          const isComment = line.startsWith('#');
          const isPython = line.startsWith('import') || line.startsWith('python3') || line.startsWith('s.');
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                isComment
                  ? 'text-emerald-700 font-semibold'
                  : isPython
                  ? 'text-cyan-800'
                  : 'text-slate-800'
              }`}
            >
              <span className="text-slate-400 font-mono text-[10px] select-none">$</span>
              <span>{line}</span>
              {idx === lines.length - 1 && (
                <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
