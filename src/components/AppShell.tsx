import { Award, BookOpen, ChevronLeft, ChevronRight, FileText, Home, LayoutDashboard, ShieldCheck, Target, Trophy, UserRound, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const workspaceLinks = [
  { name: 'Mi progreso', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Biblioteca y práctica', href: '/library', icon: BookOpen },
  { name: 'Laboratorios', href: '/labs', icon: Target, related: '/lab/' },
  { name: 'Rutas de aprendizaje', href: '/paths', icon: BookOpen, related: '/learn/' },
  { name: 'Referencia rápida', href: '/cheatsheets', icon: FileText },
  { name: 'Preparar entorno', href: '/setup/wsl', icon: Wrench },
  { name: 'Clasificación', href: '/leaderboard', icon: Trophy },
  { name: 'Logros', href: '/achievements', icon: Award },
  { name: 'Mi perfil', href: '/profile', icon: UserRound },
];

export function AppShell() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('shadowbytes_sidebar_collapsed') === 'true'; } catch { return false; }
  });

  const toggle = () => setCollapsed((current) => {
    try { localStorage.setItem('shadowbytes_sidebar_collapsed', String(!current)); } catch { /* Navigation works without storage. */ }
    return !current;
  });
  const links = [...workspaceLinks,
    { name: 'Acceso a la comunidad', href: '/admission', icon: ShieldCheck },
    ...(user?.accessStatus === 'admin' ? [{ name: 'Administrar labs', href: '/admin/labs/new', icon: ShieldCheck }] : []),
  ];

  return <div className={`sb-app-shell ${collapsed ? 'sb-app-shell-collapsed' : ''}`}>
    <aside className="sb-app-sidebar" aria-label="Espacio de aprendizaje">
      <div className="sb-app-sidebar-heading">
        {!collapsed && <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Espacio de trabajo</span>}
        <button type="button" onClick={toggle} className="sb-sidebar-toggle" aria-expanded={!collapsed} aria-controls="workspace-navigation" aria-label={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'} title={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}>
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>
      <nav id="workspace-navigation" aria-label="Navegación de la plataforma" className="sb-app-sidebar-links">
        {links.map(({ name, href, icon: Icon, ...link }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`) || ('related' in link && typeof link.related === 'string' && pathname.startsWith(link.related));
          return <Link key={href} to={href} aria-label={collapsed ? name : undefined} title={collapsed ? name : undefined} aria-current={active ? 'page' : undefined} className="sb-sidebar-link"><Icon size={18} aria-hidden="true" />{!collapsed && <span>{name}</span>}</Link>;
        })}
      </nav>
      <div className="sb-app-sidebar-bottom">
        <Link to="/" className="sb-sidebar-link" title={collapsed ? 'Volver a inicio' : undefined} aria-label={collapsed ? 'Volver a inicio' : undefined}><Home size={18} aria-hidden="true" />{!collapsed && <span>Volver a inicio</span>}</Link>
        {!collapsed && <p className="px-3 pt-3 text-xs leading-5 text-muted">Aprende, analiza y documenta tu trabajo.</p>}
      </div>
    </aside>
    <div className="sb-app-content"><Outlet /></div>
  </div>;
}
