import React, { useEffect, useState, memo } from 'react';

const staticCodeLines = [
  'python3 -m ctf.forensics --target 10.0.4.10 --output-json',
  'import socket, sys, ssl',
  's = socket.socket(socket.AF_INET, socket.SOCK_STREAM)',
  's.connect(("senati.local", 443))',
  '# [OK] Connected to Windows Server 2022 IIS Web Service',
  'Get-ADDomainController -Filter * | Select Name, IPAddress',
  '# DC-SENATI-LAB -> 10.0.4.10 [Active Directory Integrated]',
  'iptables -t nat -A POSTROUTING -o eth1_WAN -j MASQUERADE',
  '# Route established: 10.0.4.0/24 -> WAN 200.48.225.14',
  'nmap -sV --script=banner 10.0.4.10 -p 53,80,443,3389',
  '# 53/tcp   open  domain  Microsoft DNS (senati.local)',
  '# 80/tcp   open  http    Microsoft IIS/10.0',
  'git commit -m "feat: deploy to Vercel production"',
  '# Vercel Deployment SUCCESS -> https://4tociclo.vercel.app',
];

export const TerminalBackground: React.FC = memo(() => {
  const [activeCount, setActiveCount] = useState(4);

  useEffect(() => {
    // Throttled light interval (every 2.5s) to avoid 30fps React layout re-renders
    const interval = setInterval(() => {
      setActiveCount((prev) => (prev >= staticCodeLines.length ? 4 : prev + 1));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.06] select-none font-mono text-xs text-blue-900 leading-relaxed p-6 flex flex-col justify-end transform-gpu">
      <div className="max-w-xl space-y-1.5">
        {staticCodeLines.slice(0, activeCount).map((line, idx) => {
          const isComment = line.startsWith('#');
          const isPython = line.startsWith('import') || line.startsWith('python3');
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                isComment
                  ? 'text-emerald-700 font-semibold'
                  : isPython
                  ? 'text-cyan-800 font-medium'
                  : 'text-slate-800'
              }`}
            >
              <span className="text-slate-400 font-mono text-[10px] select-none">$</span>
              <span>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

TerminalBackground.displayName = 'TerminalBackground';
