import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark py-16 text-white">
      <div className="container relative z-10 grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
            Bien vieillir, vivre pleinement
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">
            La librairie numérique pour les seniors actifs et sereins
          </h1>
          <p className="text-lg leading-relaxed text-white/90">
            Des ebooks pratiques pour prendre soin de votre santé, booster votre mémoire et profiter de chaque
            journée. Téléchargement immédiat et bibliothèque personnelle sécurisée.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/ebooks"
              className="rounded-full bg-white px-6 py-3 font-semibold text-brand transition hover:bg-brand-light"
            >
              Découvrir les ebooks
            </Link>
            <Link
              href="/club"
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Rejoindre le club
            </Link>
          </div>
        </div>
        <div className="grid gap-4 text-lg">
          <Feature
            title="PDF accessibles"
            description="Grosses polices, contrastes élevés, impressions autorisées."
          />
          <Feature
            title="Paiement sécurisé"
            description="Stripe, TVA UE, coupons promos et factures automatiques."
          />
          <Feature title="Support attentionné" description="Réponse en moins de 24h par email ou téléphone." />
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" aria-hidden />
    </section>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  );
}
