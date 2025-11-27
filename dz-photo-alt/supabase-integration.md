# Next.js + Supabase Migrations-Strategie fÃ¼r DZ-Photo

## ðŸ¤” Die Zwei AnsÃ¤tze im Vergleich

### Ansatz A: Statische Seiten â†’ Backend (âŒ NICHT empfohlen)
**Workflow:**
1. Statische Next.js Seiten bauen
2. Hardcoded Content in Components
3. SpÃ¤ter: Content in Supabase migrieren
4. Components umschreiben fÃ¼r dynamische Daten

**Probleme:**
- âŒ Doppelte Arbeit (erst statisch, dann dynamisch)
- âŒ Schwierig zu refactoren (viel Code-Ã„nderung)
- âŒ Inkonsistente Datenstrukturen
- âŒ Kein Content-Management wÃ¤hrend Entwicklung
- âŒ Zeitverschwendung: ~30% mehr Aufwand

### Ansatz B: Backend-First â†’ Frontend (âœ… EMPFOHLEN)
**Workflow:**
1. Supabase Schema & Tables aufsetzen
2. WordPress Content migrieren â†’ Supabase
3. API Functions/Routes erstellen
4. Components mit echten Daten bauen

**Vorteile:**
- âœ… Einmalige Arbeit, richtig gemacht
- âœ… Echte Daten von Anfang an
- âœ… Saubere Architektur
- âœ… Content sofort verwaltbar
- âœ… Iteratives Development mÃ¶glich
- âœ… ~30% schneller fertig

---

## ðŸŽ¯ **Meine Empfehlung: Hybrider "Backend-First" Ansatz**

```
Phase 1: Backend Foundation (Woche 1-2)
â”œâ”€ Supabase Setup
â”œâ”€ Database Schema
â”œâ”€ Content Migration
â””â”€ API Functions

Phase 2: Frontend Development (Woche 3-4)
â”œâ”€ Components mit echten Daten
â”œâ”€ Pages mit Supabase Queries
â””â”€ Iteratives Styling

Phase 3: Polish & Deploy (Woche 5-6)
```

---

## ðŸ“Š Supabase Schema fÃ¼r DZ-Photo

### Tabellen-Struktur

#### 1. `portfolios` (26 Items)
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Content
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  couple_names TEXT,
  wedding_date DATE,
  location TEXT,
  description TEXT,

  -- Media
  cover_image TEXT, -- Supabase Storage URL
  images JSONB, -- Array of image objects

  -- Meta
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Indexes
  CONSTRAINT portfolios_slug_key UNIQUE (slug)
);

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read" ON portfolios
  FOR SELECT USING (published = true);

-- Indexes for performance
CREATE INDEX portfolios_slug_idx ON portfolios(slug);
CREATE INDEX portfolios_published_idx ON portfolios(published);
CREATE INDEX portfolios_featured_idx ON portfolios(featured);
```

#### 2. `blog_posts` (31 Tipps)
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Content
  slug TEXT UNIQUE NOT NULL,
  number INTEGER, -- For "Tipp-26" format
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,

  -- Media
  featured_image TEXT,
  images JSONB,

  -- Meta
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Indexes
  CONSTRAINT blog_posts_slug_key UNIQUE (slug)
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON blog_posts
  FOR SELECT USING (published = true);

CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX blog_posts_number_idx ON blog_posts(number);
```

#### 3. `fotobox_packages` (3 Packages)
```sql
CREATE TABLE fotobox_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Content
  name TEXT NOT NULL, -- "Silber", "Gold", "Platin"
  tier TEXT NOT NULL, -- "silver", "gold", "platinum"
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  features JSONB, -- Array of features
  description TEXT,

  -- Display
  popular BOOLEAN DEFAULT false,
  display_order INTEGER,
  active BOOLEAN DEFAULT true,

  -- Meta
  meta_title TEXT,
  meta_description TEXT
);

ALTER TABLE fotobox_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON fotobox_packages
  FOR SELECT USING (active = true);
```

#### 4. `reviews` (Testimonials)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Content
  author_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  wedding_date DATE,

  -- Relations
  portfolio_id UUID REFERENCES portfolios(id),

  -- Display
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  display_order INTEGER,

  -- Meta
  source TEXT -- "Google", "Facebook", "Email", etc.
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read approved reviews" ON reviews
  FOR SELECT USING (approved = true);
```

#### 5. `pages` (Static Pages)
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Content
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,

  -- Type
  page_type TEXT, -- "contact", "about", "services", etc.

  -- Meta
  published BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON pages
  FOR SELECT USING (published = true);
```

#### 6. `contact_submissions` (Kontaktformular)
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Form Data
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  wedding_date DATE,
  message TEXT NOT NULL,

  -- Inquiry Type
  inquiry_type TEXT, -- "hochzeit", "fotobox", "general"

  -- Status
  status TEXT DEFAULT 'new', -- "new", "read", "replied", "archived"
  notes TEXT,

  -- Anti-Spam
  ip_address INET,
  user_agent TEXT
);

-- Only authenticated users can read (admin panel)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## ðŸ”§ Detaillierter Migrations-Plan

### **Phase 1: Backend Setup (Woche 1-2)**

#### Tag 1-2: Supabase Projekt Setup
```bash
# 1. Supabase Projekt erstellen
https://supabase.com/dashboard

# 2. Local Development Setup
npx supabase init
npx supabase start

# 3. Schema erstellen
# Alle obigen CREATE TABLE statements in Supabase SQL Editor
```

#### Tag 3-5: Content Migration Script
```typescript
// scripts/migrate-wordpress-to-supabase.ts
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only!
)

// 1. Load scraped data
const scrapedData = JSON.parse(
  fs.readFileSync('./cleaned_pages.json', 'utf-8')
)

// 2. Parse and categorize
async function migratePortfolio() {
  const portfolioPages = scrapedData.filter(p => 
    p.metadata.url.includes('/hochzeit/')
  )

  for (const page of portfolioPages) {
    const slug = extractSlug(page.metadata.url)
    const title = page.metadata.title
    const markdown = page.markdown

    // Extract data from markdown/html
    const data = {
      slug,
      title,
      couple_names: extractCoupleNames(title),
      description: extractDescription(markdown),
      images: extractImages(page.html),
      published: true,
      meta_title: title,
      meta_description: extractDescription(markdown)?.substring(0, 160)
    }

    const { error } = await supabase
      .from('portfolios')
      .insert(data)

    if (error) console.error('Error:', error)
    else console.log('âœ… Migrated:', slug)
  }
}

// 3. Similar functions for blog_posts, etc.
async function migrateBlogPosts() { /* ... */ }
async function migrateFotobox() { /* ... */ }

// 4. Run migration
await migratePortfolio()
await migrateBlogPosts()
await migrateFotobox()
```

#### Tag 6-7: Bilder zu Supabase Storage
```typescript
// scripts/upload-images.ts
import { createClient } from '@supabase/supabase-js'

async function uploadImages() {
  // 1. Download from WordPress
  const images = await downloadWordPressImages()

  // 2. Optimize (resize, convert to WebP)
  const optimized = await optimizeImages(images)

  // 3. Upload to Supabase Storage
  for (const img of optimized) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`portfolio/${img.name}`, img.file)

    if (!error) {
      // 4. Update database with public URL
      const publicUrl = supabase.storage
        .from('images')
        .getPublicUrl(`portfolio/${img.name}`)

      await updateImageUrl(img.portfolioId, publicUrl.data.publicUrl)
    }
  }
}
```

#### Tag 8-10: API Setup
```typescript
// lib/supabase/api.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Portfolio API
export async function getPortfolios() {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('published', true)
    .order('wedding_date', { ascending: false })

  return { data, error }
}

export async function getPortfolioBySlug(slug: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data, error }
}

// Blog API
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('number', { ascending: false })

  return { data, error }
}

// Fotobox API
export async function getFotoboxPackages() {
  const { data, error } = await supabase
    .from('fotobox_packages')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  return { data, error }
}

// Contact Form API
export async function submitContactForm(formData: ContactFormData) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(formData)

  return { data, error }
}
```

---

### **Phase 2: Frontend Development (Woche 3-4)**

#### Next.js mit echten Supabase Daten

```typescript
// app/hochzeit/[slug]/page.tsx
import { getPortfolioBySlug } from '@/lib/supabase/api'
import { notFound } from 'next/navigation'
import Gallery from '@/components/Gallery'

export async function generateStaticParams() {
  const { data: portfolios } = await getPortfolios()
  return portfolios?.map(p => ({ slug: p.slug })) || []
}

export default async function PortfolioPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { data: portfolio, error } = await getPortfolioBySlug(params.slug)

  if (error || !portfolio) notFound()

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">{portfolio.title}</h1>
      <p className="text-gray-600 mb-8">
        {portfolio.couple_names} â€¢ {portfolio.wedding_date}
      </p>

      {portfolio.description && (
        <p className="text-lg mb-12">{portfolio.description}</p>
      )}

      <Gallery images={portfolio.images} />
    </main>
  )
}
```

---

## âš¡ TypeScript Types (Auto-Generated)

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

```typescript
// types/supabase.ts (auto-generated)
export type Database = {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: string
          slug: string
          title: string
          couple_names: string | null
          // ... etc
        }
        Insert: { /* ... */ }
        Update: { /* ... */ }
      }
      // ... other tables
    }
  }
}
```

---

## ðŸŽ¨ Workflow-Zusammenfassung

### âœ… **Empfohlener Workflow**

1. **Woche 1:**
   - âœ… Supabase Projekt erstellen
   - âœ… Schema definieren (alle 6 Tabellen)
   - âœ… Storage Buckets einrichten
   - âœ… Migration Script schreiben

2. **Woche 2:**
   - âœ… WordPress Content migrieren
   - âœ… Bilder hochladen & optimieren
   - âœ… API Functions erstellen
   - âœ… TypeScript Types generieren

3. **Woche 3:**
   - âœ… Next.js Projekt aufsetzen
   - âœ… Components mit echten Daten
   - âœ… Portfolio Seiten
   - âœ… Blog Seiten

4. **Woche 4:**
   - âœ… Fotobox Seiten
   - âœ… Kontaktformular
   - âœ… Homepage
   - âœ… Styling & Polish

5. **Woche 5-6:**
   - âœ… Testing
   - âœ… SEO Optimierung
   - âœ… Performance Tuning
   - âœ… Deployment

---

## ðŸ’¡ Pro-Tipps

### 1. **WÃ¤hrend Migration: Admin Panel bauen**
```typescript
// app/admin/page.tsx - Simple admin panel
// Mit Supabase Auth kannst du deine Inhalte verwalten
// wÃ¤hrend du entwickelst
```

### 2. **Incremental Static Regeneration (ISR)**
```typescript
// revalidate alle 24 Stunden
export const revalidate = 86400
```

### 3. **Supabase Realtime fÃ¼r Preview**
```typescript
// Live-Updates wÃ¤hrend Content-Editing
const channel = supabase
  .channel('portfolios')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'portfolios' },
    (payload) => {
      console.log('Change received!', payload)
      router.refresh()
    }
  )
  .subscribe()
```

---

## ðŸŽ¯ Fazit

**Backend-First ist der klare Gewinner:**
- âœ… Spart 30% Zeit
- âœ… Sauberer Code von Anfang an
- âœ… Einfacher zu testen
- âœ… Content Management sofort mÃ¶glich
- âœ… Keine Refactoring-Phase

**Next Steps:**
1. Supabase Projekt erstellen
2. Schema implementieren (SQL oben kopieren)
3. Migration Script schreiben
4. Content migrieren
5. Frontend bauen (mit echten Daten!)

---

**Zeitersparnis: ~2 Wochen** gegenÃ¼ber Static-First Ansatz!