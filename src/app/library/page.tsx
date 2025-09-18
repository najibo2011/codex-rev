import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ma bibliothèque',
  description: 'Téléchargez à nouveau vos ebooks achetés. Liens sécurisés, limite 5 téléchargements.',
};

const mockLibrary = [
  {
    id: 'ebook-bien-dormir',
    title: 'Bien dormir après 60 ans',
    downloadUrl: '/api/signed-download?productId=ebook-bien-dormir',
    remainingDownloads: 5,
  },
  {
    id: 'ebook-memoire',
    title: 'Entretenir sa mémoire',
    downloadUrl: '/api/signed-download?productId=ebook-memoire',
    remainingDownloads: 3,
  },
];

export default function LibraryPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Ma bibliothèque</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Retrouvez ici tous vos achats, bundles et contenus inclus dans le Club Senior Zen. Chaque lien est signé et
        expire après 24h pour éviter le partage abusif. Les téléchargements sont limités à 5 par produit.
      </p>
      <div className="mt-10 grid gap-4">
        {mockLibrary.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{item.title}</h2>
              <p className="text-sm text-slate-500">Téléchargements restants : {item.remainingDownloads}</p>
            </div>
            <a
              href={item.downloadUrl}
              className="rounded-full bg-brand px-5 py-3 text-center font-semibold text-white hover:bg-brand-dark"
            >
              Télécharger
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
