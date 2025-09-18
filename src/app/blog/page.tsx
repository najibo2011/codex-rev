import type { Metadata } from 'next';
import BlogCard from '@/components/blog-card';
import { listBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog Senior Zen',
  description: 'Conseils pratiques, exercices et inspirations pour bien vivre sa retraite.',
};

export default async function BlogPage() {
  const posts = await listBlogPosts();
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Le blog Senior Zen</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Articles optimisés SEO pour répondre aux questions fréquentes : sommeil, mémoire, numérique, nutrition…
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
