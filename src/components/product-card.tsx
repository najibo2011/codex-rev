import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Badge from './ui/badge';
import RatingStars from './ui/rating-stars';
import type { ProductSummary } from '@/lib/types';

interface Props {
  product: ProductSummary;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800">
        <img src={product.coverUrl} alt={product.title} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{product.category}</Badge>
          {product.isNew && <Badge variant="accent">Nouveau</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <header className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{product.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
        </header>
        <ul className="space-y-1 text-sm text-slate-500 dark:text-slate-300">
          {product.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <BookOpenIcon className="mt-1 h-4 w-4 text-brand" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <p className="text-2xl font-bold text-brand">{(product.price / 100).toFixed(2)} €</p>
            <RatingStars value={product.rating} />
          </div>
          <Link
            href={`/ebook/${product.slug}`}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Voir le détail
          </Link>
        </div>
      </div>
    </article>
  );
}
