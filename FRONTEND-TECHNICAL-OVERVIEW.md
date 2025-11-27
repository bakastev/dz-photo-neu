# DZ-Photo Frontend - Technische Übersicht

## 🎯 Projektübersicht

**DZ-Photo** ist eine moderne Hochzeitsfotografie-Website für Daniel Zangerle, migriert von WordPress zu Next.js 16 mit Supabase Backend.

- **Live Domain**: https://www.dz-photo.at
- **Repository**: https://github.com/bakastev/dz-photo-neu.git
- **Framework**: Next.js 16.0.5 (App Router, Turbopack)
- **Backend**: Supabase (PostgreSQL, Storage, Edge Functions)
- **Hosting**: Vercel (Region: Frankfurt)

---

## 🏗️ Architektur

### Technology Stack

| Kategorie | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 16.0.5 |
| Runtime | React | 19.2.0 |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Database | Supabase (PostgreSQL) | - |
| Storage | Supabase Storage | - |
| Animations | Framer Motion | 10.18.0 |
| Lightbox | yet-another-react-lightbox | latest |
| Icons | Lucide React | latest |
| TypeScript | TypeScript | 5.x |

### Projektstruktur

```
dz-photo-neu/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Homepage
│   │   ├── layout.tsx                # Root Layout
│   │   ├── not-found.tsx             # 404 Page
│   │   ├── globals.css               # Global Styles
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog Landing
│   │   │   └── [slug]/page.tsx       # Blog Detail
│   │   ├── hochzeit/
│   │   │   ├── page.tsx              # Weddings Landing
│   │   │   └── [slug]/page.tsx       # Wedding Detail
│   │   ├── locations/
│   │   │   ├── page.tsx              # Locations Landing
│   │   │   └── [slug]/page.tsx       # Location Detail
│   │   ├── fotobox/
│   │   │   └── page.tsx              # Fotobox Services
│   │   ├── api/
│   │   │   ├── contact/route.ts      # Contact Form API
│   │   │   ├── track/route.ts        # Server-Side Tracking
│   │   │   └── images/[filename]/    # Image Proxy
│   │   ├── sitemap.xml/route.ts      # Dynamic Sitemap
│   │   └── robots.txt/route.ts       # Dynamic Robots.txt
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Navigation
│   │   │   └── Footer.tsx            # Footer
│   │   ├── homepage/
│   │   │   ├── HeroSection.tsx       # Hero mit Vollbild
│   │   │   ├── AboutSection.tsx      # Über Daniel
│   │   │   ├── ServicesSection.tsx   # Services Grid
│   │   │   ├── PortfolioSection.tsx  # Featured Work
│   │   │   ├── FotoboxSection.tsx    # Fotobox Präsentation
│   │   │   ├── TestimonialsSection.tsx # Kundenstimmen
│   │   │   ├── BlogSection.tsx       # Latest Posts
│   │   │   ├── FAQSection.tsx        # FAQ Akkordeon
│   │   │   └── ContactSection.tsx    # Kontaktformular
│   │   ├── shared/
│   │   │   ├── ImageGallery.tsx      # Galerie + Lightbox
│   │   │   ├── SchemaOrg.tsx         # Structured Data
│   │   │   ├── ShareButton.tsx       # Social Sharing
│   │   │   ├── ScrollRevealWrapper.tsx # Scroll Animations
│   │   │   ├── TrackingProvider.tsx  # Analytics Context
│   │   │   └── ConsentBanner.tsx     # GDPR Cookie Banner
│   │   ├── weddings/
│   │   │   └── WeddingDetailPage.tsx # Wedding Template
│   │   └── ui/                       # shadcn/ui Components
│   │
│   ├── lib/
│   │   ├── supabase.ts               # Supabase Client + Types
│   │   ├── utils.ts                  # Utility Functions
│   │   ├── cms-helpers.ts            # Data Fetching Helpers
│   │   └── tracking.ts               # Tracking Utilities
│   │
│   └── hooks/
│       └── useScrollReveal.ts        # Scroll Animation Hook
│
├── public/
│   ├── dz-photo-logo-white.png       # Logo
│   └── fonts/                        # Custom Fonts
│
├── supabase/
│   └── functions/
│       └── generate-embedding/       # Edge Function
│
├── migration-scripts/                # Daten-Migration (excluded from build)
│
├── vercel.json                       # Vercel Config
├── next.config.ts                    # Next.js Config
├── tailwind.config.ts                # Tailwind Config
├── tsconfig.json                     # TypeScript Config
└── package.json                      # Dependencies
```

---

## 📄 Seiten & Routen

### Statische Seiten (SSG)

| Route | Beschreibung | Datenquelle |
|-------|--------------|-------------|
| `/` | Homepage mit allen Sections | Supabase |
| `/blog` | Blog-Übersicht | `blog_posts` |
| `/hochzeit` | Hochzeiten-Übersicht | `weddings` |
| `/locations` | Locations-Übersicht | `locations` |
| `/fotobox` | Fotobox-Services | `fotobox_services` |

### Dynamische Seiten (SSG mit generateStaticParams)

| Route | Template | Anzahl Seiten |
|-------|----------|---------------|
| `/blog/[slug]` | Blog Detail | 31 |
| `/hochzeit/[slug]` | Wedding Detail | 15 |
| `/locations/[slug]` | Location Detail | 13 |

### API Routes (Serverless)

| Endpoint | Methode | Funktion |
|----------|---------|----------|
| `/api/contact` | POST | Kontaktformular → Supabase |
| `/api/track` | POST | Server-Side Tracking |
| `/api/images/[filename]` | GET | Image Proxy (Legacy) |

### SEO Routes

| Route | Beschreibung |
|-------|--------------|
| `/sitemap.xml` | Dynamische Sitemap |
| `/robots.txt` | Robots.txt |

---

## 🎨 Design System

### Farbpalette

```css
/* Primärfarben */
--gold: #D4AF37;           /* Hauptakzent */
--gold-light: #E5C158;     /* Hover State */
--gold-dark: #B8960F;      /* Active State */

/* Hintergrund */
--dark-background: #0A0A0A;
--dark-surface: #141414;
--dark-card: #1A1A1A;

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #A0A0A0;
--text-muted: #666666;
```

### Typografie

```css
/* Überschriften */
font-family: 'Playfair Display', serif;

/* Body Text */
font-family: 'Inter', sans-serif;

/* Größen */
--section-title: clamp(2rem, 5vw, 4rem);
--heading-1: 3rem;
--heading-2: 2.25rem;
--body: 1rem;
--small: 0.875rem;
```

### Komponenten-Styles

```css
/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gold Button */
.btn-gold {
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  color: white;
  border-radius: 9999px;
}

/* Scroll Reveal Animation */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 🖼️ Bildverwaltung

### Supabase Storage Struktur

```
images/                    # Haupt-Bucket (public)
├── location/
│   ├── feichthub/        # 23 Bilder
│   ├── gut-kuhstein/     # 18 Bilder
│   ├── tegernbach/       # 15 Bilder
│   └── ...               # 11 Locations gesamt
├── wedding/
│   ├── anita-ahmet/      # 1 Cover
│   ├── lisa-markus/      # 1 Cover
│   └── ...               # 14 Weddings gesamt
├── blog/                 # Blog-Bilder
├── fotobox/              # Fotobox-Bilder
└── other/                # Sonstige
```

### Image Helper Function

```typescript
// src/lib/utils.ts
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://[SUPABASE_URL]/storage/v1/object/public/images/weddings/fallback.jpg';
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Already a Supabase URL
  if (imagePath.startsWith(supabaseUrl)) {
    return imagePath;
  }
  
  // WordPress URL → Extract filename
  if (imagePath.includes('dz-photo.at')) {
    const filename = imagePath.split('/').pop();
    return `${supabaseUrl}/storage/v1/object/public/images/weddings/${filename}`;
  }
  
  // Relative path
  return `${supabaseUrl}/storage/v1/object/public/images/${imagePath}`;
}
```

### Lightbox Integration

```typescript
// yet-another-react-lightbox
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

// Features:
// ✅ Touch/Swipe Navigation
// ✅ Thumbnail Strip
// ✅ Zoom (Scroll + Pinch)
// ✅ Fullscreen Mode
// ✅ Keyboard Navigation
// ✅ Counter Display
```

---

## 📊 Datenmodelle (Supabase)

### Weddings

```typescript
interface Wedding {
  id: string;
  slug: string;
  title: string;
  couple_names: string;
  wedding_date?: string;
  location?: string;
  description?: string;
  content?: string;
  cover_image?: string;
  images?: string[];
  featured?: boolean;
  published: boolean;
  guest_count?: number;
  meta_title?: string;
  meta_description?: string;
}
```

### Locations

```typescript
interface Location {
  id: string;
  slug: string;
  name: string;
  city?: string;
  description?: string;
  cover_image?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  published: boolean;
  meta_title?: string;
  meta_description?: string;
}
```

### Blog Posts

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}
```

### Fotobox Services

```typescript
interface FotoboxService {
  id: string;
  slug: string;
  name: string;
  service_type: string;
  price?: number;
  description?: string;
  features?: string[];
  cover_image?: string;
  images?: string[];
  popular?: boolean;
  active: boolean;
  published: boolean;
}
```

### Reviews

```typescript
interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  wedding_id?: string;
  location_id?: string;
  featured?: boolean;
  published: boolean;
}
```

---

## 🔍 SEO Implementation

### Metadata (per Page)

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.slug);
  
  return {
    title: data.meta_title || `${data.name} | DZ-Photo`,
    description: data.meta_description || data.description,
    openGraph: {
      title: data.name,
      description: data.description,
      images: [getImageUrl(data.cover_image)],
      type: 'website',
    },
    alternates: {
      canonical: `https://www.dz-photo.at/${route}/${data.slug}`,
    },
  };
}
```

### Schema.org (Structured Data)

```typescript
// Implementierte Schemas:
// - LocalBusiness (Homepage)
// - Event (Weddings)
// - Place (Locations)
// - Article (Blog Posts)
// - Review (Testimonials)
// - Service (Fotobox)
// - Person (Daniel Zangerle)
```

### Sitemap Generation

```typescript
// /sitemap.xml/route.ts
// Dynamisch generiert mit allen:
// - Statischen Seiten
// - Blog Posts
// - Weddings
// - Locations
// - Fotobox Services
```

---

## 📈 Tracking & Analytics

### Client-Side Tracking

```typescript
// TrackingProvider Context
const { trackEvent, trackPageView } = useTracking();

// Events:
trackEvent('CTAClick', { section: 'hero', type: 'contact' });
trackEvent('ImageView', { section: 'gallery', index: 0 });
trackEvent('FormSubmit', { form: 'contact' });
trackEvent('Share', { platform: 'native' });
```

### Server-Side Tracking

```typescript
// /api/track - Server-Side Events
// - Meta Conversion API
// - Google Analytics 4 (Measurement Protocol)
// - Deduplication via event_id
// - User Agent & IP Forwarding
```

### GDPR Compliance

```typescript
// ConsentBanner Component
// - Cookie Consent Management
// - Granular Permissions (Analytics, Marketing)
// - localStorage Persistence
// - Conditional Script Loading
```

---

## ⚡ Performance Optimierungen

### Image Optimization

```typescript
// next/image mit:
// - Automatic WebP/AVIF Conversion
// - Lazy Loading
// - Blur Placeholder
// - Responsive srcset
// - Priority Loading für Above-the-fold

<Image
  src={getImageUrl(image)}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL={defaultBlurDataURL}
  priority={index === 0}
/>
```

### Static Generation

```typescript
// generateStaticParams für alle dynamischen Routen
export async function generateStaticParams() {
  const { data } = await supabase
    .from('table')
    .select('slug')
    .eq('published', true);
  
  return data.map((item) => ({ slug: item.slug }));
}
```

### Caching Strategy

```typescript
// vercel.json Headers
{
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }]
    }
  ]
}
```

---

## 🔐 Sicherheit

### Security Headers (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only

# Tracking (Optional)
META_PIXEL_ID=xxx
META_CONVERSION_API_TOKEN=xxx
GA_MEASUREMENT_ID=G-xxx
```

---

## 🚀 Deployment

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install --force",
  "regions": ["fra1"]
}
```

### Build Output

```
Route (app)
├ ○ /                      # Static
├ ○ /blog                  # Static
├ ● /blog/[slug]           # SSG (31 pages)
├ ○ /fotobox               # Static
├ ○ /hochzeit              # Static
├ ● /hochzeit/[slug]       # SSG (15 pages)
├ ○ /locations             # Static
├ ● /locations/[slug]      # SSG (13 pages)
├ ○ /sitemap.xml           # Static
├ ○ /robots.txt            # Static
├ ƒ /api/contact           # Serverless
├ ƒ /api/track             # Serverless
└ ƒ /api/images/[filename] # Serverless

Total: 71 pages generated
```

---

## 📋 Nächste Schritte: Admin-Bereich

### Geplante Features

1. **Dashboard**
   - Übersicht aller Inhalte
   - Analytics-Widgets
   - Quick Actions

2. **Content Management**
   - CRUD für Weddings, Locations, Blog Posts
   - Rich Text Editor (Tiptap/Lexical)
   - Image Upload mit Drag & Drop
   - Bulk Operations

3. **Media Library**
   - Supabase Storage Browser
   - Image Optimization
   - Folder Management

4. **SEO Tools**
   - Meta-Daten Editor
   - Schema.org Preview
   - Sitemap Regeneration

5. **Settings**
   - Site Settings
   - Tracking Configuration
   - User Management

### Technologie-Optionen

| Option | Vorteile | Nachteile |
|--------|----------|-----------|
| **Next.js Admin Route** | Gleiche Codebase, SSR | Mehr Entwicklungsaufwand |
| **Supabase Dashboard** | Sofort verfügbar | Nicht kundenfreundlich |
| **Payload CMS** | Headless, TypeScript | Separate Instanz nötig |
| **Sanity Studio** | Echtzeit, Hosted | Vendor Lock-in |

---

## 📝 Changelog

| Datum | Version | Änderungen |
|-------|---------|------------|
| 2025-11-27 | 1.0.0 | Initial Release - Migration von WordPress |
| 2025-11-27 | 1.0.1 | Lightbox auf yet-another-react-lightbox migriert |
| 2025-11-27 | 1.0.2 | Footer Links korrigiert |
| 2025-11-27 | 1.0.3 | Build-Fehler behoben, Vercel Config erstellt |

---

*Erstellt: 27. November 2025*
*Letztes Update: 27. November 2025*

