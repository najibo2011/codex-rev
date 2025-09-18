import type { Metadata } from 'next';
import BundleCard from '@/components/bundle-card';
import { bundles } from '@/lib/seed-data';

export const metadata: Metadata = {
  title: 'Bundles d’ebooks',
  description: 'Profitez de packs thématiques de 3 ebooks avec remise immédiate.',
};

export default function BundlesPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Bundles thématiques</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Chaque pack regroupe trois ebooks complémentaires pour accélérer vos progrès. TVA et remise déjà incluses. Un
        email récapitulatif vous est envoyé à la fin du paiement.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {bundles.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}
