import Link from "next/link";
import Hero from '@/components/hero';
import ProductCard from '@/components/product-card';
import BlogCard from '@/components/blog-card';
import FAQAccordion from '@/components/faq-accordion';
import { blogPosts, faqs, products } from '@/lib/seed-data';

const featuredProducts = products.slice(0, 3);

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />
      <section className="container grid gap-8 md:grid-cols-[2fr,1fr] md:items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Des ebooks pensés pour les besoins des 55+
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Chaque guide est co-écrit avec des professionnels de santé, des ergothérapeutes et des animateurs
            spécialisés. Ils incluent des explications simples, des fiches pratiques à imprimer et des vidéos bonus.
          </p>
          <ul className="space-y-3 text-slate-600 dark:text-slate-300">
            <li>✔️ Téléchargement immédiat et liens sécurisés</li>
            <li>✔️ TVA européenne automatiquement calculée</li>
            <li>✔️ Emails de reçus envoyés via Resend</li>
          </ul>
        </div>
        <div className="grid gap-4 rounded-3xl border border-brand/20 bg-brand/5 p-6 text-lg text-slate-700 dark:text-slate-200">
          <p>
            « Les ebooks Senior Zen ont redonné confiance à ma mère. Elle suit les exercices de mémoire avec enthousiasme
            et adore le suivi dans son espace bibliothèque. »
          </p>
          <p className="font-semibold">— Claire, infirmière à domicile</p>
        </div>
      </section>
      <section className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Ebooks populaires</h2>
          <Link href="/ebooks" className="text-sm font-semibold text-brand hover:underline">
            Voir tout le catalogue
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="bg-slate-100 py-16 dark:bg-slate-900/50">
        <div className="container grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Bibliothèque personnelle</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Vos achats sont accessibles depuis l’espace client avec des liens de téléchargement signés et limités à 5
              téléchargements. Chaque PDF peut être filigrané avec votre nom pour limiter le partage sauvage.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Paiements gérés par Stripe</p>
            <p className="text-slate-600 dark:text-slate-300">
              Produits, bundles et abonnement sont créés côté code puis synchronisés avec Stripe. Les webhooks assurent la
              création des commandes et des droits d’accès dans la base Prisma.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Lors d’un achat, Resend envoie un email de reçu contenant le lien vers la bibliothèque.
            </p>
          </div>
        </div>
      </section>
      <section className="container">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Derniers articles</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      <section className="container">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Questions fréquentes</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Toutes les réponses détaillées se trouvent sur la page FAQ, mais voici un aperçu.
        </p>
        <div className="mt-6">
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </div>
  );
}
