import { BookOpen, LayoutDashboard, Menu, Moon, ShieldCheck, Sun, Target, Wrench, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { UserNavbarBadge } from '@/components/UserNavbarBadge';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    ...(user ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : [{ name: 'Inicio', href: '/', icon: ShieldCheck }]),
    { name: 'Rutas', href: '/paths', icon: BookOpen },
    { name: 'Labs', href: '/labs', icon: Target },
    { name: 'Preparar WSL', href: '/setup/wsl', icon: Wrench },
    { name: 'Comunidad', href: '/#comunidad', icon: ShieldCheck },
    ...(user?.accessStatus === 'admin' ? [{ name: 'Administrar', href: '/admin/labs/new', icon: ShieldCheck }] : []),
  ];

  const active = (href: string) => href === '/' ? pathname === '/' : href.startsWith('/#') ? false : pathname.startsWith(href);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b ${isDark ? 'border-[#222a39] bg-[#07090f]/95' : 'border-slate-200 bg-white/95'} backdrop-blur`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white">Saltar al contenido</a>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={user ? '/dashboard' : '/'} className="flex shrink-0 items-center gap-3" aria-label="ShadowBytes">
          <img src="/logo-shadowbytes.webp" width="40" height="40" alt="" className="h-10 w-10 border border-purple-500/30 object-cover" />
          <span className="font-[Orbitron] text-base font-extrabold tracking-tight sm:text-lg">SHADOW<span className="text-purple-500">BYTES</span></span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {links.map(({ name, href, icon: Icon }) => <Link key={href} to={href} aria-current={active(href) ? 'page' : undefined} className={`inline-flex min-h-10 items-center gap-2 border-b-2 px-3 text-xs font-semibold ${active(href) ? 'border-purple-500 text-white' : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}`}><Icon className="h-3.5 w-3.5" />{name}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className={`hidden h-10 w-10 items-center justify-center border sm:inline-flex ${isDark ? 'border-[#222a39] text-amber-300' : 'border-slate-200 text-indigo-600'}`} aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}>{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <UserNavbarBadge />
          <button type="button" onClick={() => setOpen((value) => !value)} className={`inline-flex h-10 w-10 items-center justify-center border lg:hidden ${isDark ? 'border-[#222a39]' : 'border-slate-200'}`} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Abrir navegación">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {open && <nav id="mobile-navigation" aria-label="Navegación móvil" className={`border-t px-4 py-3 lg:hidden ${isDark ? 'border-[#222a39] bg-[#0d111a]' : 'border-slate-200 bg-white'}`}>
        <div className="mx-auto grid max-w-7xl gap-1">{links.map(({ name, href, icon: Icon }) => <Link key={href} to={href} className={`flex min-h-12 items-center gap-3 px-3 text-sm font-semibold ${active(href) ? 'bg-purple-600 text-white' : isDark ? 'text-slate-300 hover:bg-[#121826]' : 'text-slate-700 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{name}</Link>)}</div>
      </nav>}
    </header>
  );
}
