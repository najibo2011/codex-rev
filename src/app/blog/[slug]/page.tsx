import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getBlogPost, listBlogPosts } from '@/lib/blog';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  const { metadata } = post;
  const title = `${metadata?.title ?? 'Article'} – Senior Zen`;
  const description = metadata?.excerpt ?? 'Article du blog Senior Zen.';
  const url = `https://senior-zen.example/blog/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
    },
  } satisfies Metadata;
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getBlogPost(params.slug);
  if (!post) return notFound();
  const { metadata, Content } = post;
  const publishedAt = metadata?.publishedAt
    ? format(new Date(metadata.publishedAt), 'd MMMM yyyy', { locale: fr })
    : undefined;

  return (
    <article className="container prose prose-lg max-w-3xl py-16 prose-headings:text-slate-900 prose-p:text-slate-700 dark:prose-invert">
      <p className="text-sm uppercase tracking-wide text-brand">{publishedAt}</p>
      <h1>{metadata?.title}</h1>
      <p className="lead text-slate-500">{metadata?.excerpt}</p>
      <Content />
      <section className="mt-16 rounded-3xl bg-slate-100 p-6 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Téléchargez l’ebook associé</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Complétez votre lecture avec nos ebooks pratiques et fiches imprimables. Rendez-vous dans le catalogue pour
          explorer les guides complets.
        </p>
        <a
          href="/ebooks"
          className="mt-4 inline-flex w-fit items-center rounded-full bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Voir les ebooks
        </a>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: metadata?.title,
            datePublished: metadata?.publishedAt,
            description: metadata?.excerpt,
            author: {
              '@type': 'Organization',
              name: 'Senior Zen',
            },
          }),
        }}
      />
    </article>
  );
}
