import Link from 'next/link';

const footerLinks = [
  { href: '/legal', label: 'Mentions légales' },
  { href: '/legal#cgv', label: 'CGV' },
  { href: '/legal#privacy', label: 'Confidentialité' },
  { href: '/accessibility', label: 'Accessibilité' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Senior Zen</p>
          <p className="max-w-md text-slate-600 dark:text-slate-300">
            Ebooks pratiques pour bien vivre sa retraite : santé, mémoire, autonomie et loisirs.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-300">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Senior Zen. Tous droits réservés.
      </p>
    </footer>
  );
}
