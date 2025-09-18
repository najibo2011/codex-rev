import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Tableau de bord pour gérer les produits, bundles, coupons et uploads.',
};

const mockStats = [
  { label: 'Chiffre d’affaires (30j)', value: '4 320 €' },
  { label: 'Commandes', value: '218' },
  { label: 'Téléchargements', value: '812' },
];

export default function AdminPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Accès restreint. Utilisez les formulaires ci-dessous pour gérer le catalogue, générer des coupons et consulter les
        statistiques de ventes. Les actions déclenchent des mutations Prisma et des synchronisations Stripe/S3.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {mockStats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Créer / éditer un produit</h2>
          <form className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-600 dark:bg-slate-950" placeholder="Titre" />
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-600 dark:bg-slate-950" placeholder="Prix (centimes)" />
            <button type="submit" className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
              Enregistrer
            </button>
          </form>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Importer un CSV produits</h2>
          <form className="mt-4 space-y-3">
            <input type="file" className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-600 dark:bg-slate-950" />
            <button type="submit" className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
              Importer
            </button>
          </form>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Uploader une couverture</h2>
          <form className="mt-4 space-y-3" encType="multipart/form-data">
            <input type="file" className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-600 dark:bg-slate-950" />
            <button type="submit" className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
              Uploader
            </button>
          </form>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Générer un coupon</h2>
          <form className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-600 dark:bg-slate-950" placeholder="Code" />
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-600 dark:bg-slate-950" placeholder="% de réduction" />
            <button type="submit" className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
              Générer
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
