import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Search, SearchX, SlidersHorizontal, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentIcon } from '@/components/ContentIcon';
import { DIFFICULTY_LABELS, LabCard } from '@/components/LabCard';
import { Button, Card, EmptyState, Skeleton } from '@/components/ui/Primitives';
import { useLabs } from '@/hooks/useLabs';
import { CATEGORY_ICONS, type Difficulty, type CTFCategory } from '@/types/ctf';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Insane'];
const CATEGORIES: CTFCategory[] = ['Web', 'Forensics', 'Pwn', 'Crypto', 'Reversing', 'Network', 'Misc'];
const PAGE_SIZE = 12;

export function Labs() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [category, setCategory] = useState<CTFCategory | null>(null);
  const [page, setPage] = useState(1);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const timeout = window.setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const { labs, total, loading, error, refetch } = useLabs({ search: debouncedSearch, difficulty, category, page, pageSize: PAGE_SIZE });
  const searching = search !== debouncedSearch;
  const busy = loading || searching;
  const hasFilters = Boolean(search || difficulty || category);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  useEffect(() => {
    if (!busy && !error && page > pageCount) setPage(pageCount);
  }, [busy, error, page, pageCount]);
  const resetFilters = () => { setSearch(''); setDebouncedSearch(''); setDifficulty(null); setCategory(null); setPage(1); };
  const changePage = (next: number) => {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };
  const filterClasses = (selected: boolean) => `inline-flex min-h-11 items-center gap-2 rounded-control border px-3 py-2 text-sm transition-colors ${selected ? 'border-accent bg-accent/10 font-semibold text-accent-text' : 'border-border bg-panel text-muted hover:bg-elevated hover:text-foreground'}`;

  return <section className="min-h-screen pb-16 pt-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="sb-eyebrow mb-3">Entrenamiento práctico</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Laboratorios de ciberseguridad</h1>
          <p className="mt-4 text-sm leading-7 text-muted">Elige un caso, analiza sus evidencias y comprueba tus conclusiones. Cada laboratorio indica su nivel, los materiales necesarios y el objetivo que debes resolver.</p>
        </div>
        <Link to="/paths/iniciacion-ctf" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-control border border-border bg-panel px-4 py-2 text-sm font-semibold text-foreground hover:bg-elevated lg:self-auto"><BookOpen size={17} />Primera vez: empieza aquí<ArrowRight size={16} /></Link>
      </header>

      <Card className="mb-8 p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div className="w-full max-w-xl">
            <label htmlFor="lab-search" className="mb-2 block text-sm font-medium text-foreground">Buscar por título o descripción</label>
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-3 top-3.5 text-muted" aria-hidden="true" />
              <input id="lab-search" type="search" maxLength={120} placeholder="Por ejemplo: redes, cifrado, registros…" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 w-full rounded-control border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted" />
            </div>
          </div>
          {hasFilters && <Button variant="quiet" onClick={resetFilters}>Limpiar filtros</Button>}
        </div>
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-muted">Nivel</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={difficulty === null} onClick={() => { setDifficulty(null); setPage(1); }} className={filterClasses(difficulty === null)}>Todos los niveles</button>
              {DIFFICULTIES.map((value) => <button key={value} type="button" aria-pressed={difficulty === value} onClick={() => { setDifficulty(value); setPage(1); }} className={filterClasses(difficulty === value)}>{DIFFICULTY_LABELS[value]}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-muted">Especialidad</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={category === null} onClick={() => { setCategory(null); setPage(1); }} className={filterClasses(category === null)}>Todas las especialidades</button>
              {CATEGORIES.map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setPage(1); }} className={filterClasses(category === value)}><ContentIcon name={CATEGORY_ICONS[value]} />{value}</button>)}
            </div>
          </fieldset>
        </div>
      </Card>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 ref={resultsHeading} tabIndex={-1} className="scroll-mt-24 text-base font-semibold text-foreground">{hasFilters ? 'Resultados de la búsqueda' : 'Catálogo de laboratorios'}</h2>
        <span role="status" className="text-sm text-muted">{busy ? 'Buscando laboratorios…' : error ? 'Catálogo no disponible' : `${total} ${total === 1 ? 'laboratorio' : 'laboratorios'}`}</span>
      </div>
      <div aria-busy={busy}>
        {busy ? <div className="grid gap-5 sm:grid-cols-2 min-[1440px]:grid-cols-3" aria-label="Cargando laboratorios">
          {Array.from({ length: 6 }, (_, index) => <Card key={index} className="p-6"><Skeleton className="mb-6 h-6 w-36" /><Skeleton className="mb-3 h-6 w-full" /><Skeleton className="mb-6 h-16 w-full" /><Skeleton className="h-4 w-2/3" /></Card>)}
        </div> : error ? <EmptyState icon={<SlidersHorizontal size={28} />} title="No pudimos abrir el catálogo" description={error} action={<Button onClick={refetch}>Volver a intentar</Button>} />
          : labs.length === 0 ? <EmptyState icon={<SearchX size={32} />} title={hasFilters ? 'No hay coincidencias con estos filtros' : 'Los próximos laboratorios aparecerán aquí'} description={hasFilters ? 'Prueba con otra palabra o amplía el nivel y la especialidad.' : 'Puedes comenzar con una ruta de aprendizaje mientras se preparan nuevos casos.'} action={hasFilters ? <Button onClick={resetFilters}>Ver todos los laboratorios</Button> : <Link to="/paths" className="sb-button sb-button-outline">Explorar rutas<ArrowRight size={16} /></Link>} />
            : <div className="grid gap-5 sm:grid-cols-2 min-[1440px]:grid-cols-3">{labs.map((lab) => <LabCard key={lab.id} lab={lab} />)}</div>}
      </div>
      {!busy && !error && pageCount > 1 && <nav aria-label="Páginas de laboratorios" className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button disabled={page <= 1} onClick={() => changePage(page - 1)}><ArrowLeft size={16} />Anterior</Button>
        <span className="text-sm text-muted">Página {page} de {pageCount}</span>
        <Button disabled={page >= pageCount} onClick={() => changePage(page + 1)}>Siguiente<ArrowRight size={16} /></Button>
      </nav>}
      <div className="mt-10 flex items-start gap-3 border-t border-border pt-6 text-sm leading-6 text-muted"><Target size={20} className="mt-0.5 shrink-0" aria-hidden="true" /><p>Para avanzar, entrega la respuesta solicitada en cada paso. Las pistas muestran su coste antes de abrirlas y la solución completa se desbloquea al resolver el reto.</p></div>
    </div>
  </section>;
}

export default Labs;
