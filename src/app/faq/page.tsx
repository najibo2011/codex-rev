import type { Metadata } from 'next';
import FAQAccordion from '@/components/faq-accordion';
import { faqs } from '@/lib/seed-data';

export const metadata: Metadata = {
  title: 'Questions fréquentes',
  description: 'Tout savoir sur les paiements, la TVA, les téléchargements et l’abonnement.',
};

export default function FAQPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">FAQ Senior Zen</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Retrouvez les réponses aux questions les plus fréquentes concernant les paiements Stripe, la TVA européenne, les
        téléchargements sécurisés et le Club Senior Zen.
      </p>
      <div className="mt-10">
        <FAQAccordion items={faqs} />
      </div>
    </div>
  );
}
