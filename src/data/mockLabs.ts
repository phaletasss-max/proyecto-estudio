import type { CTFLab } from '@/types/ctf';

/**
 * Public, non-secret fixtures for explicit local demo mode.
 * Never add flags, answer verifiers, private hints or writeups to this file.
 */
export const REAL_LABS: CTFLab[] = [
  {
    id: 'demo-forensics-router',
    title: 'Forense de Redes e Infraestructura — Router Gateway',
    slug: 'forense-redes-router',
    difficulty: 'Easy',
    category: 'Forensics',
    framework: 'Linux / Windows Server 2022',
    tags: ['Forensics', 'Linux', 'Routing', 'NAT'],
    description: 'Analiza evidencias de una red de laboratorio y documenta cómo identificar la interfaz de salida del gateway.',
    estimatedMinutes: 45,
    zip_url: null,
    author: 'ShadowBytes Team',
    created_at: '2026-01-15T00:00:00.000Z',
    is_published: true,
    is_admission_challenge: true,
    is_members_only: false,
    points: 100,
  },
  {
    id: 'demo-wsl-setup',
    title: 'Preparación de Linux en Windows con WSL 2',
    slug: 'wsl2-linux-alternativa-vms',
    difficulty: 'Easy',
    category: 'Misc',
    framework: 'WSL 2 / Ubuntu / Kali Linux',
    tags: ['WSL2', 'Linux', 'Kali Linux', 'Windows 11'],
    description: 'Prepara un entorno Linux reproducible en Windows antes de comenzar los laboratorios prácticos.',
    estimatedMinutes: 40,
    zip_url: null,
    author: 'ShadowBytes Team',
    created_at: '2026-02-01T00:00:00.000Z',
    is_published: true,
    is_members_only: false,
    points: 100,
  },
];
