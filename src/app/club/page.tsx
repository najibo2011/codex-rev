import type { Metadata } from 'next';
import { clubSubscription } from '@/lib/seed-data';

export const metadata: Metadata = {
  title: 'Club Senior Zen',
  description: 'Abonnement mensuel à 9€ pour recevoir un nouvel ebook, masterclass et réductions sur tout le catalogue.',
};

export default function ClubPage() {
  return (
    <div className="bg-gradient-to-br from-brand/5 to-brand/10 py-16 dark:from-slate-900 dark:to-slate-950">
      <div className="container grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Rejoignez le Club Senior Zen</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Chaque mois, recevez un ebook exclusif, participez à une masterclass animée par un expert et profitez d’une
            remise automatique de 30% sur tout le catalogue. Résiliable en un clic.
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            {clubSubscription.benefits.map((benefit) => (
              <li key={benefit}>✔️ {benefit}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-6 rounded-3xl border border-brand/30 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Abonnement mensuel</p>
          <p className="text-5xl font-bold text-slate-900 dark:text-white">
            {(clubSubscription.price / 100).toFixed(2)} €<span className="text-lg font-medium text-slate-500">/mois</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            TVA incluse. Paiement récurrent via Stripe. Portail client pour mettre à jour vos informations et résilier.
          </p>
          <form action="/api/checkout" method="post" className="space-y-3">
            <input type="hidden" name="subscriptionId" value={clubSubscription.id} />
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-dark"
            >
              Essayer le club
            </button>
          </form>
          <p className="text-sm text-slate-500">
            Après paiement réussi, un email de bienvenue vous est envoyé via Resend avec le lien vers vos bonus.
          </p>
        </div>
      </div>
    </div>
  );
}
