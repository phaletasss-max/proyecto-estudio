import React, { memo } from 'react';

const staticCodeLines = [
  'python3 -m ctf.forensics --target 10.0.4.10 --output-json',
  'import socket, sys, ssl',
  's = socket.socket(socket.AF_INET, socket.SOCK_STREAM)',
  's.connect(("shadowbytes.test", 443))',
  '# [OK] Connected to Windows Server 2022 IIS Web Service',
  'Get-ADDomainController -Filter * | Select Name, IPAddress',
  '# DC-SHADOWBYTES-LAB -> 10.0.4.10 [Active Directory Integrated]',
  'iptables -t nat -A POSTROUTING -o eth1_WAN -j MASQUERADE',
  '# Route established: 10.0.4.0/24 -> documentation network',
  'nmap -sV --script=banner 10.0.4.10 -p 53,80,443,3389',
  '# 53/tcp open domain Microsoft DNS (shadowbytes.test)',
  'git commit -m "feat: deploy to Vercel production"',
  '# Vercel Deployment SUCCESS -> https://shadowbytes.vercel.app',
];

export const TerminalBackground: React.FC = memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.05] select-none font-mono text-xs leading-relaxed p-6 flex flex-col justify-end">
      <div className="max-w-xl space-y-1.5">
        {staticCodeLines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-400">
            <span className="text-slate-500 font-mono text-[10px] select-none">$</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

TerminalBackground.displayName = 'TerminalBackground';
