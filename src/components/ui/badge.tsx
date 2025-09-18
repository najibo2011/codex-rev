import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
}

export default function Badge({ children, variant = 'default' }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variant === 'default'
          ? 'bg-white/90 text-slate-900 shadow dark:bg-slate-800/80 dark:text-slate-100'
          : 'bg-accent/90 text-white shadow'
      )}
    >
      {children}
    </span>
  );
}
