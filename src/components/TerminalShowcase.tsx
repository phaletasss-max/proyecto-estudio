import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, Monitor, Shield, Cpu, Code2 } from 'lucide-react';

type TerminalType = 'cmd' | 'powershell' | 'kali' | 'arch';

interface TerminalInfo {
  id: TerminalType;
  name: string;
  badge: string;
  icon: string;
  titleBar: string;
  bgColor: string;
  headerColor: string;
  fontColor: string;
  command: string;
  output: Array<{ text: string; color?: string }>;
}

const terminalConfigs: Record<TerminalType, TerminalInfo> = {
  cmd: {
    id: 'cmd',
    name: 'Windows CMD',
    badge: 'Server 2022',
    icon: '🪟',
    titleBar: 'Símbolo del sistema — Windows Server 2022 (DC-SENATI-LAB)',
    bgColor: 'bg-black',
    headerColor: 'bg-slate-800 text-slate-200 border-slate-700',
    fontColor: 'text-slate-200 font-mono',
    command: 'C:\\Users\\Administrator> ipconfig /all && net share',
    output: [
      { text: 'Windows IP Configuration', color: 'text-white font-bold' },
      { text: '' },
      { text: '   Host Name . . . . . . . . . . . . : DC-SENATI-LAB', color: 'text-slate-300' },
      { text: '   Primary Dns Suffix  . . . . . . . : senati.local', color: 'text-slate-300' },
      { text: '   IPv4 Address. . . . . . . . . . . : 10.0.4.10 (Preferred)', color: 'text-cyan-400 font-bold' },
      { text: '   Subnet Mask . . . . . . . . . . . : 255.255.255.0', color: 'text-slate-300' },
      { text: '   Default Gateway . . . . . . . . . : 10.0.4.1', color: 'text-slate-300' },
      { text: '   DNS Servers . . . . . . . . . . . : 10.0.4.10', color: 'text-emerald-400 font-bold' },
      { text: '' },
      { text: 'Share name   Resource                        Remark', color: 'text-amber-400 font-bold' },
      { text: '---------------------------------------------------------', color: 'text-slate-600' },
      { text: 'ProyectosWeb C:\\Shares\\ProyectosWeb          Proyectos 4to ciclo', color: 'text-slate-200' },
      { text: 'MaterialCTF  C:\\Shares\\MaterialCTF           Archivos de Ciberseguridad', color: 'text-slate-200' },
      { text: '' },
      { text: 'The command completed successfully.', color: 'text-emerald-400' },
    ],
  },
  powershell: {
    id: 'powershell',
    name: 'PowerShell',
    badge: 'Active Directory',
    icon: '⚡',
    titleBar: 'Administrator: Windows PowerShell 7.4 (senati.local)',
    bgColor: 'bg-[#012456]',
    headerColor: 'bg-[#001737] text-cyan-200 border-blue-900',
    fontColor: 'text-white font-mono',
    command: 'PS C:\\> Get-ADUser -Filter * | Select-Object Name, UserPrincipalName, Enabled',
    output: [
      { text: 'Windows PowerShell', color: 'text-cyan-300 font-bold' },
      { text: 'Copyright (C) Microsoft Corporation. All rights reserved.', color: 'text-slate-400' },
      { text: '' },
      { text: 'Name                 UserPrincipalName                  Enabled', color: 'text-yellow-300 font-bold' },
      { text: '----                 -----------------                  -------', color: 'text-blue-300' },
      { text: 'Administrator        admin@senati.local                 True', color: 'text-emerald-400' },
      { text: 'Victor Kenky         v.rodriguez@senati.local           True', color: 'text-cyan-300 font-bold' },
      { text: 'Estudiante-01        estudiante1@senati.local           True', color: 'text-white' },
      { text: 'ShadowBytes-Lab      lab@senati.local                   True', color: 'text-emerald-400 font-bold' },
      { text: '' },
      { text: 'PS C:\\> Get-Service -Name "DNS","DHCP" | Select-Object Status, DisplayName', color: 'text-yellow-300' },
      { text: 'Status   DisplayName', color: 'text-yellow-300 font-bold' },
      { text: 'Running  DNS Server (Active Directory Integrated)       [ONLINE]', color: 'text-emerald-400 font-bold' },
      { text: 'Running  DHCP Server (Scope 10.0.4.0/24)                [ONLINE]', color: 'text-emerald-400 font-bold' },
    ],
  },
  kali: {
    id: 'kali',
    name: 'Kali Linux',
    badge: 'Pentesting & CTF',
    icon: '🐉',
    titleBar: '┌──(kali㉿shadowbytes-senati)-[~/pentesting/ctf-labs]',
    bgColor: 'bg-[#0f141d]',
    headerColor: 'bg-[#18202c] text-blue-300 border-slate-700',
    fontColor: 'text-slate-200 font-mono',
    command: '┌──(kali㉿shadowbytes)-[~]\n└─$ nmap -p 80,443,53,3389 -sV 10.0.4.10',
    output: [
      { text: 'Starting Nmap 7.94 ( https://nmap.org ) at 2026-07-26 09:00 EST', color: 'text-slate-400' },
      { text: 'Nmap scan report for DC-SENATI-LAB (10.0.4.10)', color: 'text-cyan-400 font-bold' },
      { text: 'Host is up (0.00042s latency).', color: 'text-slate-300' },
      { text: '' },
      { text: 'PORT     STATE SERVICE       VERSION', color: 'text-blue-400 font-bold' },
      { text: '53/tcp   open  domain        Microsoft DNS 6.1.7601', color: 'text-emerald-400' },
      { text: '80/tcp   open  http          Microsoft IIS httpd 10.0', color: 'text-emerald-400' },
      { text: '443/tcp  open  ssl/https     Microsoft IIS httpd 10.0', color: 'text-emerald-400' },
      { text: '3389/tcp open  ms-wbt-server Microsoft Terminal Services', color: 'text-cyan-300' },
      { text: '' },
      { text: '└─$ cat /home/kali/ctf/flag.txt', color: 'text-blue-400' },
      { text: 'HTB{200.48.225.14} — [WAN GATEWAY CAPTURED SUCCESSFUL]', color: 'text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded' },
    ],
  },
  arch: {
    id: 'arch',
    name: 'Arch Linux',
    badge: 'Dev & Vercel',
    icon: '🏹',
    titleBar: 'senati@archlinux: ~/projects/shadowbytes (zsh)',
    bgColor: 'bg-[#0a0f18]',
    headerColor: 'bg-[#111927] text-cyan-300 border-cyan-900/50',
    fontColor: 'text-slate-100 font-mono',
    command: '[senati@archlinux shadowbytes]$ git status && vercel --prod',
    output: [
      { text: 'On branch main', color: 'text-slate-300' },
      { text: 'Your branch is up to date with \'origin/main\'.', color: 'text-slate-400' },
      { text: 'nothing to commit, working tree clean', color: 'text-emerald-400' },
      { text: '' },
      { text: 'Vercel CLI 33.5.0 — Deploying to Production', color: 'text-cyan-400 font-bold' },
      { text: '🔍 Inspecting build outputs...', color: 'text-slate-300' },
      { text: '✅ Building React 19 + TypeScript frontend', color: 'text-emerald-400' },
      { text: '🔒 AES-256-GCM Zero-Knowledge encryption verified', color: 'text-purple-400 font-bold' },
      { text: '🚀 Production: https://proyecto-estudio-twvd.vercel.app [1.2s]', color: 'text-cyan-300 font-bold underline' },
      { text: '' },
      { text: '[senati@archlinux shadowbytes]$ _', color: 'text-slate-200 animate-pulse' },
    ],
  },
};

export const TerminalShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TerminalType>('cmd');
  const [copied, setCopied] = useState(false);

  const currentTerm = terminalConfigs[activeTab];

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentTerm.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      {/* Outer Ambient Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-[32px] blur-xl opacity-30 animate-pulse" />

      {/* Main Terminal Box */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Terminal Type Selector Tabs */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {(Object.keys(terminalConfigs) as TerminalType[]).map((key) => {
              const term = terminalConfigs[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 font-bold'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{term.icon}</span>
                  <span>{term.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {term.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Terminal Interactiva SENATI</span>
          </div>
        </div>

        {/* Fake OS Window Header */}
        <div className={`flex items-center justify-between px-4 py-2.5 border-b text-xs font-mono ${currentTerm.headerColor}`}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block opacity-80" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block opacity-80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block opacity-80" />
            </div>
            <span className="ml-2 truncate max-w-[280px] sm:max-w-md font-semibold">
              {currentTerm.titleBar}
            </span>
          </div>
          <button
            onClick={handleCopyCommand}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Copiar comando"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        {/* Terminal Body */}
        <div className={`p-4 sm:p-6 ${currentTerm.bgColor} min-h-[300px] text-xs sm:text-sm overflow-x-auto`}>
          
          {/* Prompt Command line */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 font-mono text-cyan-300 font-bold">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="break-all">{currentTerm.command}</span>
          </div>

          {/* Output lines */}
          <div className="space-y-1.5 font-mono">
            {currentTerm.output.map((line, idx) => (
              <div key={idx} className={`${line.color || 'text-slate-300'} break-all`}>
                {line.text}
              </div>
            ))}
          </div>

        </div>

        {/* Terminal Footer Bar */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CPU: VirtualBox / Server 2022</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seguridad: Zero-Trust</span>
            </span>
          </div>
          <div className="text-cyan-400 font-semibold">
            ShadowBytes SENATI • 4.º Ciclo
          </div>
        </div>

      </div>
    </div>
  );
};
