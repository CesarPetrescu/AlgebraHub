import type { Metadata } from 'next';
import './globals.css';

const siteOrigin = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'AlgebraHub — Forme pătratice, pas cu pas',
  description: 'Învață algebra liniară vizual: matrici, valori proprii, baze ortonormate și forme canonice.',
  openGraph: {
    title: 'AlgebraHub — Forme pătratice, pas cu pas',
    description: 'De la matricea simetrică la forma canonică, printr-un traseu vizual și interactiv.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AlgebraHub — Forme pătratice, pas cu pas' }],
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlgebraHub — Forme pătratice, pas cu pas',
    description: 'Învață ortodiagonalizarea și forma canonică, fără pași săriți.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
