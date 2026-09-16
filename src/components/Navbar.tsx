import { BookOpen, LayoutDashboard, Menu, Moon, Search, ShieldCheck, Sun, Target, Wrench, X } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { UserNavbarBadge } from '@/components/UserNavbarBadge';
import { workspaceLinks } from '@/components/AppShell';
const QuickSearch = lazy(() => import('@/components/QuickSearch'));

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const isWorkspace = workspaceLinks.some(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    || ['/lab/', '/learn/', '/admin/'].some((prefix) => pathname.startsWith(prefix))
    || pathname === '/admission' || pathname === '/upload';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const handleSearch = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen((current) => !current); setOpen(false);
      }
    };
    window.addEventListener('keydown', handleSearch);
    return () => window.removeEventListener('keydown', handleSearch);
  }, []);

  const links = isWorkspace ? [
    ...workspaceLinks,
    { name: 'Acceso a la comunidad', href: '/admission', icon: ShieldCheck },
    { name: 'Inicio', href: '/', icon: ShieldCheck },
    ...(user?.accessStatus === 'admin' ? [{ name: 'Administrar', href: '/admin/labs/new', icon: ShieldCheck }] : []),
  ] : [
    ...(user ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : [{ name: 'Inicio', href: '/', icon: ShieldCheck }]),
    { name: 'Rutas', href: '/paths', icon: BookOpen },
    { name: 'Labs', href: '/labs', icon: Target },
    { name: 'Preparar WSL', href: '/setup/wsl', icon: Wrench },
    { name: 'Comunidad', href: '/#comunidad', icon: ShieldCheck },
    ...(user?.accessStatus === 'admin' ? [{ name: 'Administrar', href: '/admin/labs/new', icon: ShieldCheck }] : []),
  ];

  const active = (href: string) => href === '/' ? pathname === '/' : href.startsWith('/#') ? false : pathname === href || pathname.startsWith(`${href}/`) || (href === '/labs' && pathname.startsWith('/lab/')) || (href === '/paths' && pathname.startsWith('/learn/'));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-panel text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">Saltar al contenido</a>
      <div className={`mx-auto flex h-[72px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8 ${isWorkspace ? '' : 'max-w-7xl'}`}>
        <Link to={user ? '/dashboard' : '/'} className="flex shrink-0 items-center gap-3" aria-label="ShadowBytes">
          <img src="/logo-shadowbytes.webp" width="40" height="40" alt="" className="hidden h-10 w-10 rounded-control border border-border object-cover sm:block" />
          <span className="sb-wordmark">Shadow<span className="text-accent-text">bytes</span></span>
        </Link>

        {!isWorkspace && <nav aria-label="Navegación principal" className="hidden items-center gap-1 xl:flex">
          {links.map(({ name, href, icon: Icon }) => <Link key={href} to={href} aria-current={active(href) ? 'page' : undefined} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-xs font-semibold ${active(href) ? 'border-accent text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{name}</Link>)}
        </nav>}

        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setSearchOpen(true)} className="hidden min-h-11 items-center gap-2 rounded-control border border-border px-3 text-xs hover:bg-elevated sm:inline-flex" aria-label="Buscar contenido (Control K)"><Search size={16} /><span className="hidden md:inline">Buscar</span><kbd className="hidden text-muted xl:block">Ctrl K</kbd></button>
          <button type="button" onClick={toggleTheme} className="hidden h-11 w-11 items-center justify-center rounded-control border border-border text-muted hover:bg-elevated hover:text-foreground sm:inline-flex" aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}>{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <UserNavbarBadge />
          <button ref={menuButton} type="button" onClick={() => setOpen((value) => !value)} className={`inline-flex h-11 w-11 items-center justify-center rounded-control border border-border hover:bg-elevated ${isWorkspace ? 'min-[1200px]:hidden' : 'xl:hidden'}`} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Cerrar navegación' : 'Abrir navegación'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {open && <nav id="mobile-navigation" aria-label="Navegación móvil" onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } }} className={`max-h-[calc(100dvh_-_72px)] overflow-y-auto border-t border-border bg-panel px-4 py-3 ${isWorkspace ? 'min-[1200px]:hidden' : 'xl:hidden'}`}>
        <button type="button" onClick={() => { setOpen(false); setSearchOpen(true); }} className="flex min-h-12 items-center gap-3 px-3 text-sm"><Search size={16} />Buscar contenido</button>
        <button type="button" onClick={toggleTheme} className="flex min-h-12 items-center gap-3 px-3 text-sm sm:hidden">{isDark ? <Sun size={16} /> : <Moon size={16} />}{isDark ? 'Activar tema claro' : 'Activar tema oscuro'}</button>
        <div className="mx-auto grid max-w-7xl gap-1">{links.map(({ name, href, icon: Icon }) => <Link key={href} to={href} onClick={() => setOpen(false)} aria-current={active(href) ? 'page' : undefined} className={`flex min-h-12 items-center gap-3 rounded-control px-3 text-sm font-semibold ${active(href) ? 'bg-elevated text-accent-text' : 'text-muted hover:bg-elevated hover:text-foreground'}`}><Icon className="h-4 w-4" aria-hidden="true" />{name}</Link>)}</div>
      </nav>}
      {searchOpen && <Suspense fallback={<span role="status" className="sr-only">Cargando búsqueda</span>}><QuickSearch onClose={() => setSearchOpen(false)} /></Suspense>}
    </header>
  );
}
