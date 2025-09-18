export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white">Oups…</h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
        La page demandée n’existe pas ou a été déplacée. Retournez à l’accueil pour continuer votre lecture.
      </p>
      <a
        href="/"
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-dark"
      >
        Retour à l’accueil
      </a>
    </div>
  );
}
