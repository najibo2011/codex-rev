import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductCard from '@/components/product-card';
import { findProductBySlug, products } from '@/lib/seed-data';
import type { ProductDetail } from '@/lib/types';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = findProductBySlug(params.slug);
  if (!product) return {};
  const title = `${product.title} – Ebook Senior Zen`;
  const description = product.description;
  const url = `https://senior-zen.example/ebook/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'product',
      url,
      images: product.images.map((src) => ({ url: src })),
    },
  } satisfies Metadata;
}

export default function ProductPage({ params }: Props) {
  const product = findProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <div className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="container grid gap-12 lg:grid-cols-[1.3fr,1fr]">
        <div className="space-y-6">
          <nav className="text-sm text-slate-500">
            <a href="/ebooks" className="hover:text-brand">
              ← Retour au catalogue
            </a>
          </nav>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{product.title}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{product.description}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {product.images.map((image) => (
              <img
                key={image}
                src={image}
                alt="Extrait de l’ebook"
                className="h-full w-full rounded-3xl border border-slate-200 object-cover dark:border-slate-800"
              />
            ))}
          </div>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Sommaire</h2>
            <ol className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
              {product.tableOfContents.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden>➜</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Avis lecteurs</h2>
            <div className="mt-3 space-y-4">
              {product.reviews.length === 0 && (
                <p className="text-slate-500">Les premiers avis arriveront bientôt.</p>
              )}
              {product.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className="font-semibold text-brand">{review.author}</p>
                  <p className="text-sm text-slate-500">Note : {review.rating}/5</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="text-3xl font-bold text-brand">{(product.price / 100).toFixed(2)} €</div>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            TVA incluse. Paiement sécurisé via Stripe. Téléchargement immédiat.
          </p>
          <form action="/api/checkout" method="post" className="space-y-3">
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-dark"
            >
              Acheter cet ebook
            </button>
          </form>
          <p className="text-sm text-slate-500">
            Besoin d’un devis ou d’une facture spécifique ? Contactez-nous à contact@seniorzen.fr.
          </p>
          <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm text-slate-600 dark:text-slate-200">
            <p className="font-semibold text-brand">Inclus avec votre achat :</p>
            <ul className="mt-2 space-y-1">
              <li>✔️ Accès à vie dans la bibliothèque</li>
              <li>✔️ Mises à jour gratuites</li>
              <li>✔️ Filigrane personnalisé anti-partage</li>
            </ul>
          </div>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product)) }}
      />
      <section className="container mt-16">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Vous aimerez aussi</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {products
            .filter((item) => item.category === product.category && item.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
    </div>
  );
}

function buildProductJsonLd(product: ProductDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (product.price / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `https://senior-zen.example/ebook/${product.slug}`,
    },
  };
}
