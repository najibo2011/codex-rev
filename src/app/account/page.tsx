import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon compte',
  description: 'Gérez vos informations personnelles, vos commandes et votre abonnement.',
};

export default function AccountPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Mon compte</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Cette page est protégée par l’authentification. Après connexion, vous pourrez mettre à jour votre profil, accéder
        aux factures Stripe et gérer votre abonnement.
      </p>
      <div className="mt-8 grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Informations personnelles</h2>
          <p className="mt-2 text-sm text-slate-500">
            Email, nom affiché, préférences de communication. Mise à jour via Prisma + NextAuth.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Commandes & factures</h2>
          <p className="mt-2 text-sm text-slate-500">
            Liste des commandes synchronisées depuis Stripe (Checkout et abonnements). Téléchargez vos factures au format
            PDF.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Gestion de l’abonnement</h2>
          <p className="mt-2 text-sm text-slate-500">
            Accédez au portail Stripe Billing pour mettre à jour votre carte ou annuler votre abonnement Club Senior Zen.
          </p>
        </section>
      </div>
    </div>
  );
}
