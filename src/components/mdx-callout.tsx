interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Callout({ title, children }: Props) {
  return (
    <div className="my-6 rounded-2xl border border-brand/30 bg-brand/10 p-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">{title}</p>
      <div className="mt-2 text-base text-slate-700 dark:text-slate-200">{children}</div>
    </div>
  );
}
