import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibilité',
  description: 'Notre engagement pour une expérience de lecture confortable et inclusive.',
};

export default function AccessibilityPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Accessibilité</h1>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
        Senior Zen s’engage à offrir des contenus lisibles et confortables : polices de grande taille (18px minimum),
        contrastes élevés, compatibilité lecteurs d’écran et possibilité d’imprimer les fiches pratiques.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Typographie lisible</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Tous les ebooks utilisent des polices sans-serif et une taille de corps de 18px minimum avec interlignage
            généreux.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Mode sombre</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Le site propose un mode sombre optionnel pour réduire la fatigue visuelle en soirée.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Téléchargements faciles</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Les liens expirent après 24h mais peuvent être régénérés depuis l’espace bibliothèque en un clic.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Support humain</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Une équipe dédiée répond aux besoins spécifiques : police plus grande, versions audio sur demande, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
