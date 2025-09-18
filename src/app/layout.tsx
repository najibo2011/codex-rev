import type { Metadata, Viewport } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

const font = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'] });

const siteUrl = 'https://senior-zen.example';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Senior Zen – Librairie d’ebooks pour bien vieillir',
    template: '%s | Senior Zen',
  },
  description:
    'Librairie numérique dédiée aux seniors : ebooks pratiques, bundles avantageux et abonnement Club Senior Zen.',
  keywords: ['ebook', 'senior', 'santé', 'mémoire', 'autonomie'],
  openGraph: {
    title: 'Senior Zen – Ebooks bien-être pour les 55+',
    description:
      'Accédez à des ebooks pratiques pour la santé, l’autonomie et la mémoire avec bibliothèque personnelle sécurisée.',
    url: siteUrl,
    siteName: 'Senior Zen',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senior Zen',
    description: 'Librairie d’ebooks numériques dédiée aux seniors actifs.',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  colorScheme: 'light dark',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${font.className} flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950`}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
