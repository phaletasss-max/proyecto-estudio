import { useState } from 'react';
import { ArrowUpRight, Check, Clock3, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { moduleHref, recommendModule } from '@/lib/learningProgress';

export function SessionPlanner() {
  const { user } = useAuth();
  const learning = useLearningProgress();
  const [selected, setSelected] = useState('');
  const [minutes, setMinutes] = useState(60);
  const path = LEARNING_PATHS.find((item) => item.slug === (selected || learning.activePath)) ?? LEARNING_PATHS[0];
  const recommendation = recommendModule(path, minutes, learning.completedLessons, user?.solvedLabs.map((solve) => solve.labSlug) ?? []);
  const module = recommendation.module;

  return <aside className="sb-planner" aria-labelledby="session-title">
    <div className="sb-planner-top"><span className="sb-eyebrow"><SlidersHorizontal size={14} /> Tu próxima sesión</span><span className="sb-meta">01 / PLANIFICAR</span></div>
    <div className="sb-planner-body">
      <h2 id="session-title">Un objetivo. Un siguiente paso.</h2>
      <p className="sb-muted sb-small">Elige tu enfoque y el tiempo que tienes hoy.</p>
      <label className="sb-field-label" htmlFor="session-path">Área de práctica</label>
      <select id="session-path" className="sb-select" value={path.slug} onChange={(event) => setSelected(event.target.value)}>
        {LEARNING_PATHS.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
      </select>
      <fieldset className="sb-time"><legend className="sb-field-label">Tiempo disponible</legend><div>
        {[30, 60, 90].map((time) => <button type="button" key={time} aria-pressed={minutes === time} onClick={() => setMinutes(time)}><Clock3 size={13} />{time} min</button>)}
      </div></fieldset>
      <div className="sb-recommendation" aria-live="polite" aria-atomic="true">
        <span className="sb-eyebrow">{module ? 'Recomendación para ti' : 'Estado de la ruta'}</span>
        <h3>{module?.title ?? (recommendation.available.length ? 'Ruta al día' : 'Contenido en preparación')}</h3>
        <p>{recommendation.reason}</p>
        {module && <div className="sb-inline-meta"><span>{module.labSlug ? 'Laboratorio CTF' : 'Lectura guiada'}</span><span>{module.durationMinutes} min estimados</span></div>}
        <Link className="sb-button sb-button-primary" to={module ? moduleHref(path, module)! : `/paths/${path.slug}`}>{module ? 'Abrir módulo' : 'Ver detalle de la ruta'}<ArrowUpRight size={17} /></Link>
      </div>
      <button className="sb-save-path" type="button" disabled={learning.activePath === path.slug} onClick={() => learning.selectPath(path)}><Check size={14} />{learning.activePath === path.slug ? 'Guardada como tu ruta activa' : 'Guardar como mi ruta activa'}</button>
      <p className="sb-storage-note" role="status">{learning.error || 'Ruta y lecturas guardadas en este navegador. Los labs se completan con una flag validada.'}</p>
    </div>
  </aside>;
}
