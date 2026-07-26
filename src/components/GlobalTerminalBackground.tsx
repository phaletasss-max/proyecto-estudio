import React, { useEffect, useState } from 'react';

interface TerminalBlock {
  osName: string;
  osIcon: string;
  badgeColor: string;
  badgeBorder: string;
  logs: Array<{ text: string; color?: string }>;
}

const osTerminalBlocks: TerminalBlock[] = [
  {
    osName: 'Windows Server 2022',
    osIcon: '🪟',
    badgeColor: 'text-cyan-300 bg-blue-950/90 shadow-cyan-500/20',
    badgeBorder: 'border-cyan-500/50',
    logs: [
      { text: 'C:\\Users\\Administrator> ipconfig /all', color: 'text-cyan-400 font-bold' },
      { text: '   Host Name . . . . . . . . . . . : DC-SENATI-LAB', color: 'text-slate-300' },
      { text: '   Primary Dns Suffix  . . . . . . : senati.local', color: 'text-slate-400' },
      { text: '   IPv4 Address. . . . . . . . . . : 10.0.4.10 (Preferred)', color: 'text-emerald-400 font-bold' },
      { text: '   DNS Servers . . . . . . . . . . : 10.0.4.10', color: 'text-cyan-300' },
      { text: 'PS C:\\> Get-ADUser -Filter * | Select Name, Enabled', color: 'text-amber-300 font-bold' },
      { text: '   Administrator        True   [Active Directory OK]', color: 'text-emerald-400 font-bold' },
      { text: '   Victor Kenky         True   [Instructor Rol]', color: 'text-cyan-300' },
    ],
  },
  {
    osName: 'Kali Linux 2026',
    osIcon: '🐉',
    badgeColor: 'text-purple-300 bg-purple-950/90 shadow-purple-500/20',
    badgeBorder: 'border-purple-500/50',
    logs: [
      { text: '┌──(kali㉿shadowbytes-senati)-[~/ctf-labs]', color: 'text-purple-400 font-bold' },
      { text: '└─$ nmap -sV -p 53,80,443,3389 10.0.4.10', color: 'text-cyan-300 font-bold' },
      { text: 'Starting Nmap scan on DC-SENATI-LAB (10.0.4.10)', color: 'text-slate-400' },
      { text: '53/tcp   open  domain        Microsoft DNS', color: 'text-emerald-400 font-bold' },
      { text: '80/tcp   open  http          Microsoft IIS/10.0', color: 'text-emerald-400' },
      { text: '└─$ python3 -c "import hashlib; print(hashlib.sha256(b\'HTB{200.48.225.14}\').hexdigest())"', color: 'text-amber-300' },
      { text: '└─$ FLAG: HTB{200.48.225.14} [GATEWAY WAN CAPTURED]', color: 'text-amber-400 font-bold' },
    ],
  },
  {
    osName: 'Arch Linux',
    osIcon: '🏹',
    badgeColor: 'text-cyan-300 bg-slate-950/95 shadow-cyan-500/20',
    badgeBorder: 'border-cyan-400/50',
    logs: [
      { text: '[senati@archlinux shadowbytes]$ sudo pacman -Syu git nodejs docker', color: 'text-cyan-300 font-bold' },
      { text: ':: Synchronizing package databases...', color: 'text-slate-400' },
      { text: 'core is up to date', color: 'text-emerald-400' },
      { text: 'extra is up to date', color: 'text-emerald-400' },
      { text: '[senati@archlinux shadowbytes]$ vercel --prod', color: 'text-amber-300 font-bold' },
      { text: '🔍 Inspecting build outputs...', color: 'text-slate-300' },
      { text: '✅ Production: https://4tociclo.vercel.app [1.2s]', color: 'text-cyan-300 font-bold underline' },
    ],
  },
  {
    osName: 'Ubuntu Server / Python',
    osIcon: '🐧',
    badgeColor: 'text-orange-300 bg-orange-950/90 shadow-orange-500/20',
    badgeBorder: 'border-orange-500/50',
    logs: [
      { text: 'ubuntu@node-senati:~$ python3 ctf_forensics.py', color: 'text-orange-400 font-bold' },
      { text: 'import socket, ssl, crypto', color: 'text-cyan-300' },
      { text: '[+] AES-256-GCM Zero-Knowledge Key Loaded', color: 'text-emerald-400 font-bold' },
      { text: '[+] Connecting to https://proyecto-estudio-twvd.vercel.app...', color: 'text-slate-300' },
      { text: '[+] Status: 200 OK — SSL Validated', color: 'text-emerald-400 font-bold' },
      { text: '[+] Ready for 4.º Ciclo Students', color: 'text-amber-300 font-bold' },
    ],
  },
];

export const GlobalTerminalBackground: React.FC = () => {
  const [activeBlockIdx, setActiveBlockIdx] = useState(0);
  const [visibleLineCount, setVisibleLineCount] = useState(1);

  useEffect(() => {
    const currentBlock = osTerminalBlocks[activeBlockIdx];
    
    if (visibleLineCount < currentBlock.logs.length) {
      const timer = setTimeout(() => {
        setVisibleLineCount((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleLineCount(1);
        setActiveBlockIdx((prev) => (prev + 1) % osTerminalBlocks.length);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visibleLineCount, activeBlockIdx]);

  const block = osTerminalBlocks[activeBlockIdx];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050811]">
      
      {/* Subtle Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating OS Watermark Badge (Top Right) */}
      <div className="absolute top-24 right-4 sm:right-12 z-10 transition-all duration-700">
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${block.badgeColor} ${block.badgeBorder}`}>
          <span className="text-3xl sm:text-4xl animate-bounce">{block.osIcon}</span>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold font-mono tracking-wider uppercase text-white">
              {block.osName}
            </span>
            <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Terminal en vivo • 4.º Ciclo
            </span>
          </div>
        </div>
      </div>

      {/* Huge Giant OS Watermark Icon Center Left */}
      <div className="absolute top-1/4 left-4 sm:left-16 opacity-35 sm:opacity-50 transition-all duration-700 pointer-events-none">
        <span className="text-[120px] sm:text-[180px] font-black font-mono text-cyan-500/20 drop-shadow-[0_0_50px_rgba(34,211,238,0.2)]">
          {block.osIcon}
        </span>
      </div>

      {/* High-Contrast Live Terminal Log Box (Bottom Left) */}
      <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-auto max-w-lg p-4 sm:p-5 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-500 z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-white font-bold flex items-center gap-1.5">
              <span>{block.osIcon}</span>
              <span>{block.osName}</span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            LOG STREAM ⚡
          </span>
        </div>

        {/* Console Text Lines */}
        <div className="space-y-1.5 font-mono text-xs sm:text-sm overflow-hidden min-h-[165px]">
          {block.logs.slice(0, visibleLineCount).map((log, idx) => (
            <div key={idx} className={`${log.color || 'text-slate-200'} break-all flex items-center gap-2 drop-shadow-sm`}>
              <span className="text-purple-400 text-[11px] font-bold">&gt;</span>
              <span>{log.text}</span>
              {idx === visibleLineCount - 1 && (
                <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block ml-1" />
              )}
            </div>
          ))}
        </div>

        {/* Terminal Footer Indicator */}
        <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>ShadowBytes Telemetry Labs</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>

      </div>

    </div>
  );
};
