# Next.js Code Examples for DZ-Photo Migration

## 1. Portfolio Page (Dynamic Route)
```typescript
// app/hochzeit/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPortfolioItem, getAllPortfolioSlugs } from '@/lib/api'
import Gallery from '@/components/portfolio/Gallery'

interface Props {
  params: { slug: string }
}

// Generate static params for all portfolio items
export async function generateStaticParams() {
  const slugs = await getAllPortfolioSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const portfolio = await getPortfolioItem(params.slug)

  if (!portfolio) return { title: 'Not Found' }

  return {
    title: `${portfolio.title} | DZ-Photo`,
    description: portfolio.description || `Hochzeitsfotos von ${portfolio.coupleNames}`,
    openGraph: {
      images: [portfolio.images[0]?.url],
    },
  }
}

export default async function PortfolioPage({ params }: Props) {
  const portfolio = await getPortfolioItem(params.slug)

  if (!portfolio) notFound()

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{portfolio.title}</h1>
      <p className="text-gray-600 mb-8">
        {portfolio.coupleNames} • {new Date(portfolio.date).toLocaleDateString('de-DE')}
      </p>

      {portfolio.description && (
        <p className="text-lg mb-12">{portfolio.description}</p>
      )}

      <Gallery images={portfolio.images} />
    </main>
  )
}

```

## 2. Sanity Schema (Data Model)
```typescript
// sanity/schemas/portfolio.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'coupleNames',
      title: 'Couple Names',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Wedding Date',
      type: 'date',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text',
          }
        ]
      }],
      validation: Rule => Rule.required().min(1),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'SEO Description' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      date: 'date',
    },
    prepare(selection) {
      const { title, media, date } = selection
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString('de-DE') : 'No date',
        media,
      }
    },
  },
})

```

## 3. Gallery Component
```typescript
// components/portfolio/Gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface GalleryProps {
  images: Array<{
    url: string
    alt?: string
  }>
}

export default function Gallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
          >
            <Image
              src={image.url}
              alt={image.alt || `Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={images.map(img => ({ src: img.url, alt: img.alt }))}
      />
    </>
  )
}

```

## 4. API Functions
```typescript
// lib/api.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Get all portfolio items
export async function getAllPortfolio() {
  return client.fetch(`
    *[_type == "portfolio"] | order(date desc) {
      _id,
      title,
      slug,
      coupleNames,
      date,
      "imageUrl": images[0].asset->url,
      featured
    }
  `)
}

// Get single portfolio item
export async function getPortfolioItem(slug: string) {
  return client.fetch(`
    *[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      coupleNames,
      date,
      location,
      description,
      "images": images[]{
        "url": asset->url,
        alt
      },
      seo
    }
  `, { slug })
}

// Get all portfolio slugs for static generation
export async function getAllPortfolioSlugs() {
  const items = await client.fetch(`
    *[_type == "portfolio"]{ "slug": slug.current }
  `)
  return items.map((item: any) => item.slug)
}

```

## 5. Package.json
```json
{
  "name": "dz-photo-nextjs",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@sanity/client": "^6.0.0",
    "@sanity/image-url": "^1.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "yet-another-react-lightbox": "^3.15.0",
    "resend": "^2.0.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.0"
  }
}

```

## Additional Setup Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  // Optional: Set up redirects from old WordPress URLs
  async redirects() {
    return [
      // Add redirects if URLs change
    ]
  },
}

module.exports = nextConfig
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add your brand colors
      },
    },
  },
  plugins: [],
}
```

### .env.local
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

RESEND_API_KEY=your_resend_key
```

## Migration Checklist

- [ ] Create Next.js project: `npx create-next-app@latest`
- [ ] Install dependencies from package.json
- [ ] Set up Sanity.io project
- [ ] Create schemas for Portfolio, BlogPost, FotoboxPackage
- [ ] Export images from WordPress
- [ ] Import content to Sanity
- [ ] Build components (Gallery, ContactForm, etc.)
- [ ] Implement pages with SSG
- [ ] Add SEO metadata
- [ ] Test performance
- [ ] Deploy to Vercel

---

**Ready to start? Begin with:** `npx create-next-app@latest dz-photo-nextjs --typescript --tailwind --app`
