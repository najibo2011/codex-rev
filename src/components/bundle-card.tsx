import Link from 'next/link';
import type { BundleSummary } from '@/lib/types';

interface Props {
  bundle: BundleSummary;
}

export default function BundleCard({ bundle }: Props) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{bundle.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{bundle.description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-300">
        {bundle.items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span aria-hidden>📘</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-6">
        <div>
          <p className="text-2xl font-bold text-brand">{(bundle.price / 100).toFixed(2)} €</p>
          <p className="text-sm text-slate-500 line-through dark:text-slate-400">
            {(bundle.compareAtPrice / 100).toFixed(2)} €
          </p>
        </div>
        <Link
          href={`/bundles#${bundle.slug}`}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Acheter
        </Link>
      </div>
    </article>
  );
}
