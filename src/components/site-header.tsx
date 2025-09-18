'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './theme-toggle';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/ebooks', label: 'Ebooks' },
  { href: '/bundles', label: 'Bundles' },
  { href: '/club', label: 'Club' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <span className="rounded bg-brand px-2 py-1 text-white">Senior Zen</span>
          <span className="sr-only">Retour à l'accueil</span>
        </Link>
        <nav className="hidden items-center gap-6 text-base font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'text-brand underline'
                  : 'text-slate-700 hover:text-brand dark:text-slate-200'
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="rounded-full bg-brand px-4 py-2 font-semibold text-white shadow hover:bg-brand-dark"
          >
            Mon compte
          </Link>
          <ThemeToggle />
        </nav>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-slate-300 p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((state) => !state)}
          aria-label="Menu"
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={
                  pathname === link.href
                    ? 'text-brand underline'
                    : 'text-slate-700 hover:text-brand dark:text-slate-200'
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-4 py-2 text-center font-semibold text-white shadow hover:bg-brand-dark"
            >
              Mon compte
            </Link>
            <div className="mt-3">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
