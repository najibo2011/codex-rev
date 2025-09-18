import Link from 'next/link';
import { Metadata } from 'next';
import ProductCard from '@/components/product-card';
import { categories, listProductsByCategory } from '@/lib/seed-data';

type Props = {
  searchParams: {
    category?: string;
  };
};

export const metadata: Metadata = {
  title: 'Catalogue des ebooks',
  description: '12 ebooks numériques pour prendre soin de votre santé, mémoire, autonomie et loisirs.',
};

export default function EbooksPage({ searchParams }: Props) {
  const category = searchParams.category;
  const products = listProductsByCategory(category as any);
  return (
    <div className="container py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Catalogue ebooks</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Téléchargement immédiat, mises à jour offertes et bibliothèque personnelle pour tous vos achats.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <FilterLink label="Tous" href="/ebooks" isActive={!category} />
        {categories.map((cat) => (
          <FilterLink
            key={cat}
            label={cat}
            href={`/ebooks?category=${encodeURIComponent(cat)}`}
            isActive={category === cat}
          />
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function FilterLink({ label, href, isActive }: { label: string; href: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        isActive
          ? 'border-brand bg-brand text-white shadow'
          : 'border-slate-300 bg-white text-slate-600 hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900'
      }`}
    >
      {label}
    </Link>
  );
}
