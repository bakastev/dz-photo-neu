import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dz-photo.at'),
  title: 'Daniel Zangerle - Hochzeitsfotograf Oberösterreich',
  description: 'Professionelle Hochzeitsfotografie in Oberösterreich. Emotionale Hochzeitsreportagen, traumhafte Locations und Fotobox-Services.',
  keywords: ['Hochzeitsfotograf', 'Oberösterreich', 'Hochzeitsfotografie', 'Wels', 'Linz', 'Hochzeitsreportage'],
  authors: [{ name: 'Daniel Zangerle' }],
  creator: 'Daniel Zangerle',
  publisher: 'DZ-Photo',
  openGraph: {
    title: 'Daniel Zangerle - Hochzeitsfotograf Oberösterreich',
    description: 'Professionelle Hochzeitsfotografie in Oberösterreich',
    url: 'https://www.dz-photo.at',
    siteName: 'DZ-Photo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Daniel Zangerle Hochzeitsfotografie',
      },
    ],
    locale: 'de_AT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daniel Zangerle - Hochzeitsfotograf Oberösterreich',
    description: 'Professionelle Hochzeitsfotografie in Oberösterreich',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} min-h-screen bg-dark-background text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
