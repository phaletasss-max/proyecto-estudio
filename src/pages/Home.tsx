import { ArrowRight, ArrowUpRight, BookOpen, Check, Code2, Crosshair, Fingerprint, Network, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SessionPlanner } from '@/components/SessionPlanner';
import { ContentIcon } from '@/components/ContentIcon';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { useAuth } from '@/context/AuthContext';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { pathProgress } from '@/lib/learningProgress';

const disciplines = [{icon:Crosshair,label:'Seguridad ofensiva'},{icon:Fingerprint,label:'Análisis forense'},{icon:Network,label:'Infraestructura'},{icon:Code2,label:'Desarrollo con IA'}];
export default function Home() {
  const { user } = useAuth();
  const learning = useLearningProgress();
  return <div className="sb-workspace sb-home">
    <section className="sb-hero sb-container">
      <div className="sb-hero-copy">
        <p className="sb-eyebrow"><span className="sb-brand-line" /> SHADOWBYTES / CYBERSECURITY COMMUNITY</p>
        <h1>El criterio<br />se <span>entrena.</span></h1>
        <p className="sb-hero-description">Entiende el sistema. Encuentra la evidencia.<br className="hidden sm:block" /> Construye una solución que puedas explicar.</p>
        <p className="sb-muted sb-hero-secondary">Ciberseguridad y desarrollo en una comunidad independiente. Rutas prácticas, retos CTF y herramientas para pasar de seguir instrucciones a tomar decisiones.</p>
        <div className="sb-actions"><Link className="sb-button sb-button-primary" to={user ? '/dashboard' : '/labs'}>{user ? 'Continuar en mi panel' : 'Explorar laboratorios'}<ArrowUpRight size={18} /></Link><a className="sb-button sb-button-quiet" href="#rutas">Encontrar mi ruta<ArrowRight size={16} /></a></div>
        <div className="sb-hero-proof"><ShieldCheck size={16} /><span>Práctica autorizada</span><span className="sb-divider" /><span>En español</span><span className="sb-divider" /><span>A tu ritmo</span></div>
        <div className="sb-hero-coordinate" aria-hidden="true"><span>OBSERVAR</span><span>COMPRENDER</span><span>VALIDAR</span><span className="sb-coordinate-mark">[ SB / 01 ]</span></div>
      </div><SessionPlanner />
    </section>
    <div className="sb-discipline-strip"><div className="sb-container">{disciplines.map(({icon:Icon,label}) => <span key={label}><Icon size={17} />{label}</span>)}</div></div>
    <section id="rutas" className="sb-container sb-section">
      <div className="sb-section-heading"><div><p className="sb-eyebrow">01 / FORMACIÓN</p><h2>Elige una dirección.<br /><span className="sb-muted">Avanza con método.</span></h2></div><p className="sb-muted">Cada ruta muestra el contenido disponible, el siguiente paso y lo que aún está en preparación.</p></div>
      <div className="sb-path-grid">{LEARNING_PATHS.map((path, index) => {
        const progress = pathProgress(path, learning.completedLessons, user?.solvedLabs.map((solve) => solve.labSlug) ?? []);
        return <Link key={path.slug} className="sb-path-card" to={`/paths/${path.slug}`}>
          <div className="sb-card-top"><span className="sb-meta">{String(index + 1).padStart(2, '0')} / {path.level}</span><ContentIcon name={path.icon} className="h-6 w-6 text-violet-400" /></div>
          <h3>{path.title}</h3><p className="sb-muted">{path.description}</p>
          <div className="sb-tags">{path.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="sb-card-bottom"><span>{progress.available.length ? `${progress.available.length} módulos disponibles` : 'En preparación'}{progress.completed > 0 && ` · ${progress.completed} completados`}</span><ArrowUpRight size={19} /></div>
        </Link>;
      })}</div>
    </section>
    <section className="sb-method"><div className="sb-container sb-section">
      <div className="sb-section-heading"><div><p className="sb-eyebrow">02 / MÉTODO</p><h2>Menos adivinar.<br />Más entender.</h2></div><Link to="/setup/wsl" className="sb-button sb-button-outline">Preparar mi entorno<ArrowUpRight size={17} /></Link></div>
      <div className="sb-method-grid">{[
        ['01','Lee el objetivo','Qué vas a aprender, qué necesitas y cómo reconocer un resultado correcto.'],
        ['02','Trabaja la evidencia','Analiza archivos, prueba una hipótesis y usa pistas cuando las necesites.'],
        ['03','Explica el resultado','Valida la flag, revisa la solución disponible y documenta cómo llegaste a ella.'],
      ].map(([number,title,copy]) => <article key={number}><span className="sb-method-number">{number}</span><h3>{title}</h3><p className="sb-muted">{copy}</p></article>)}</div>
      <div className="sb-format-note"><BookOpen size={18} /><p>Comienza con lecturas y ejercicios en tu equipo. Los laboratorios indican sus requisitos; ShadowBytes no ofrece máquinas virtuales alojadas.</p></div>
    </div></section>
    <section id="comunidad" className="sb-container sb-section sb-community">
      <div><p className="sb-eyebrow">03 / COMUNIDAD</p><h2>El conocimiento<br />crece al compartirlo.</h2><p className="sb-muted">Contrasta enfoques, pregunta con contexto y comparte lo que aprendes. Una comunidad técnica se construye con aportes útiles y respeto por el trabajo de los demás.</p><div className="sb-actions"><a className="sb-button sb-button-primary" href="https://discord.gg/MPRzx6UHM" target="_blank" rel="noopener noreferrer">Entrar a Discord<ArrowUpRight size={17} /></a><Link className="sb-button sb-button-quiet" to="/admission">CTF de acceso<ArrowRight size={17} /></Link></div></div>
      <div className="sb-community-principles">{['Practica en sistemas propios o autorizados.','Comparte pistas sin publicar flags de retos activos.','Documenta evidencias, herramientas y razonamiento.','Ayuda a quien empieza, sin dar por sabido lo básico.'].map((item) => <p key={item}><Check size={16} />{item}</p>)}<small>La membresía de la plataforma y los roles de canales externos se gestionan por separado.</small></div>
    </section>
  </div>;
}
