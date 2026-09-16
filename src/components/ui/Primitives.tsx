import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' };

export function Button({ variant = 'secondary', className = '', type = 'button', ...props }: ButtonProps) {
  const variants = {
    primary: 'sb-primary-button',
    secondary: 'border-border bg-panel text-foreground hover:bg-elevated',
    quiet: 'border-transparent text-muted hover:bg-elevated hover:text-foreground',
  };
  return <button type={type} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />;
}

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-card border border-border bg-panel ${className}`} {...props} />;
}

type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
const badgeTones: Record<BadgeTone, string> = {
  neutral: 'border-border bg-elevated text-muted',
  accent: 'border-accent/30 bg-accent/10 text-accent-text',
  info: 'border-info/30 bg-info/10 text-info',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
};

export function Badge({ tone = 'neutral', className = '', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-control border px-2 py-1 text-xs font-medium ${badgeTones[tone]} ${className}`} {...props} />;
}

export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return <Card className="px-6 py-12 text-center">
    {icon && <div className="mb-4 flex justify-center text-muted" aria-hidden="true">{icon}</div>}
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </Card>;
}

export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={`animate-pulse rounded-control bg-elevated ${className}`} {...props} />;
}
