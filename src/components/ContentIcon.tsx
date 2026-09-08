import { Award, BookOpen, Building2, Calendar, CheckCircle2, Code2, Compass, Cpu, FileText, Flag, FlaskConical, Globe2, Home, Image, LockKeyhole, Mail, Network, Search, Settings, ShieldCheck, Target, Terminal, Trophy, User, Zap } from 'lucide-react';

const icons = { award: Award, book: BookOpen, building: Building2, calendar: Calendar, check: CheckCircle2, code: Code2, compass: Compass, cpu: Cpu, file: FileText, flag: Flag, flask: FlaskConical, globe: Globe2, home: Home, image: Image, lock: LockKeyhole, mail: Mail, network: Network, search: Search, settings: Settings, shield: ShieldCheck, target: Target, terminal: Terminal, trophy: Trophy, user: User, zap: Zap };

/** Stable content identifiers keep presentation separate from persisted badge codes. */
export function ContentIcon({ name, className = 'inline-block h-[1em] w-[1em] shrink-0 align-middle' }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? ShieldCheck;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
