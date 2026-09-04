import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#07090f] px-4 pb-20 pt-28 text-center text-slate-100">
      <div className="max-w-xl">
        <Search className="mx-auto h-9 w-9 text-purple-400" />
        <p className="mt-5 font-mono text-sm font-bold tracking-[0.2em] text-cyan-400">ERROR 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Esta ruta no existe.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">El recurso pudo cambiar de dirección o todavía no está publicado.</p>
        <Link to="/" className="mt-7 inline-flex min-h-11 items-center gap-2 bg-purple-600 px-5 text-sm font-bold hover:bg-purple-500"><ArrowLeft className="h-4 w-4" /> Volver al inicio</Link>
      </div>
    </section>
  );
}
