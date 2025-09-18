import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Besoin d’un devis, d’un support ou d’une information ? Écrivez-nous.',
};

export default function ContactPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Contact</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Notre équipe répond sous 24h ouvrées. Vous pouvez également nous joindre par téléphone au 01 86 86 86 86.
      </p>
      <form className="mt-10 grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <label className="space-y-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Nom complet</span>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="space-y-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="space-y-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Message</span>
          <textarea
            name="message"
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-dark"
        >
          Envoyer
        </button>
        <p className="text-sm text-slate-500">
          Pour les questions liées à la facturation, indiquez votre numéro de commande Stripe afin d’accélérer le
          traitement.
        </p>
      </form>
    </div>
  );
}
