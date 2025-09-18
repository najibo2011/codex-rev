import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { BlogSummary } from '@/lib/types';

interface Props {
  post: BlogSummary;
}

export default function BlogCard({ post }: Props) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm uppercase tracking-wide text-brand">
        {format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: fr })}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
      <div className="mt-auto pt-6">
        <Link href={`/blog/${post.slug}`} className="font-semibold text-brand hover:underline">
          Lire l'article →
        </Link>
      </div>
    </article>
  );
}
