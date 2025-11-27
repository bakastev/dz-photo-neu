# DZ-PHOTO.AT - Website Analysis & Next.js Migration Plan

**Generated:** 2025-11-26 21:36:54
**Analyzed Pages:** 95 (unique, cleaned)
**Source:** Firecrawl scrape with 77.9% cache hit rate

---

## 📊 Executive Summary

DZ-Photo.at is a WordPress-based photography website using Elementor page builder. The site consists of 95 unique content pages with a focus on wedding photography portfolios (26 items), blogging tips (31 posts), and fotobox rental services.

**Key Findings:**
- Simple, mostly flat URL structure (80% single-level)
- Medium complexity - suitable for static generation
- Image-heavy content (46% of pages have images)
- Limited interactive features (mainly contact forms)
- Good candidate for Next.js migration with significant performance gains

---

## 🗂️ Content Structure

### Page Type Distribution

| Page Type | Count | Percentage | Avg Words | Avg Headings |
|-----------|-------|------------|-----------|--------------|
| **Tipps/Blog** | 31 | 32.6% | 138 | 1 |
| **Hochzeit Portfolio** | 26 | 27.4% | 149 | 2 |
| **Other** | 27 | 28.4% | - | - |
| **Fotobox** | 6 | 6.3% | 278 | 5 |
| **Rezensionen** | 2 | 2.1% | 559 | 4 |
| **Kontakt** | 2 | 2.1% | 69 | 3 |
| **Homepage** | 1 | 1.1% | 1211 | 18 |
| **Total** | **95** | **100%** | - | - |

### Content Statistics

- **Word Count Range:** 7 - 2,398 words (Avg: 217)
- **Content Length:** 143 - 19,355 characters (Avg: 2,422)
- **Headings per Page:** 0 - 18 (Avg: 2)
- **Links per Page:** 0 - 44 (Avg: 6)
- **Pages with Images:** 44/95 (46%)

---

## 🛠️ Current Technology Stack

### Detected Technologies
- **CMS:** WordPress
- **Page Builder:** Elementor
- **Server:** Unknown (likely Apache/nginx)
- **Language:** PHP (WordPress)

### WordPress Elements Found
- wp-content paths
- Elementor classes and data attributes
- WordPress generator meta tags

---

## 🔗 URL Structure Analysis

### URL Depth Distribution
- **Level 1 (flat):** 80 pages (84%)
- **Level 2:** 4 pages (4%)
- **Level 3:** 11 pages (12%)

### Sample URLs by Type

**Portfolio:**
- `/martina-und-christoph-hochzeit-dz-photo/`
- `/hochzeit-tanja-daniel/`
- `/hochzeit-lisa-patrick-by-dz-photo/`

**Blog/Tipps:**
- `/tipp-26/`
- `/tipp-25-flipflops-schlapfen/`
- `/tipp-21/`

**Fotobox:**
- `/photoboothdz/`
- `/fotobox-mieten/`

**Other:**
- `/rezensionen/`
- `/kontakt-anfrage/`
- `/locations/vedahof/`

---

## 🎯 Next.js Migration Plan

### Recommended Architecture

#### Framework & Rendering
- **Framework:** Next.js 14+ (App Router)
- **Rendering Strategy:**
  - Homepage: SSG with ISR (Incremental Static Regeneration)
  - Portfolio: SSG (build-time generation)
  - Blog: SSG with ISR
  - Static pages: SSG
  - Contact: SSG with Client Components

#### Tech Stack
```
Framework:     Next.js 14+ (TypeScript)
Styling:       Tailwind CSS + shadcn/ui
CMS:           Sanity.io OR Headless WordPress
Images:        next/image + Cloudinary
Forms:         React Hook Form + Zod
Email:         Resend or SendGrid
Hosting:       Vercel
Analytics:     Vercel Analytics
```

---

## 📁 Proposed Next.js File Structure

```
dz-photo-nextjs/
├── app/
│   ├── layout.tsx                 # Root layout (nav, footer)
│   ├── page.tsx                   # Homepage
│   ├── hochzeit/
│   │   └── [slug]/
│   │       └── page.tsx           # Dynamic portfolio (26 items)
│   ├── tipp/
│   │   └── [slug]/
│   │       └── page.tsx           # Dynamic blog posts (31 items)
│   ├── photoboothdz/
│   │   └── page.tsx               # Fotobox main
│   ├── rezensionen/
│   │   └── page.tsx               # Reviews
│   ├── kontakt/
│   │   └── page.tsx               # Contact
│   └── locations/
│       └── [slug]/
│           └── page.tsx           # Dynamic locations
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── portfolio/
│   │   ├── Gallery.tsx
│   │   ├── PortfolioCard.tsx
│   │   └── ImageLightbox.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── BlogContent.tsx
│   ├── fotobox/
│   │   └── PackageCard.tsx
│   ├── forms/
│   │   └── ContactForm.tsx
│   └── ui/
│       └── (shadcn components)
│
├── lib/
│   ├── sanity.ts                  # Sanity client
│   ├── api.ts                     # API functions
│   └── types.ts                   # TypeScript types
│
├── public/
│   └── images/                    # Optimized images
│
└── sanity-studio/                 # CMS (if using Sanity)
    └── schemas/
        ├── portfolio.ts
        ├── blogPost.ts
        ├── fotoboxPackage.ts
        └── review.ts
```

---

## 🗃️ Data Models

### 1. Portfolio (Hochzeit)
```typescript
interface Portfolio {
  slug: string
  title: string
  coupleNames: string
  date: Date
  location?: string
  description?: string
  images: Image[]
  featured: boolean
  seo: {
    title: string
    description: string
  }
}
```
**Count:** 26 items

### 2. Blog Post (Tipp)
```typescript
interface BlogPost {
  slug: string
  number: number
  title: string
  content: string
  excerpt?: string
  publishedAt: Date
  images: Image[]
  seo: {
    title: string
    description: string
  }
}
```
**Count:** 31 items

### 3. Fotobox Package
```typescript
interface FotoboxPackage {
  name: string
  tier: 'silver' | 'gold' | 'platinum'
  price: number
  features: string[]
  description: string
  popular?: boolean
}
```
**Count:** 3 packages

### 4. Review
```typescript
interface Review {
  author: string
  text: string
  rating: number
  date: Date
  wedding?: string
}
```
**Count:** Estimated 10-20 reviews

---

## 🚀 Migration Steps

### Phase 1: Planning & Setup (Week 1)
1. ✅ Content audit (completed)
2. Choose CMS (Sanity.io recommended)
3. Set up Next.js project with TypeScript
4. Install dependencies (Tailwind, shadcn/ui, etc.)

### Phase 2: Content Migration (Week 2)
5. Export all images from WordPress
6. Optimize images (WebP conversion, compression)
7. Create content schemas in Sanity
8. Import portfolio items
9. Import blog posts
10. Import fotobox packages

### Phase 3: Development (Week 3-4)
11. Build layout components (Header, Footer)
12. Create reusable UI components
13. Implement homepage
14. Implement portfolio pages with gallery
15. Implement blog pages
16. Implement fotobox pages
17. Implement contact form with email
18. Add SEO metadata

### Phase 4: Testing & Optimization (Week 5)
19. Performance testing (Lighthouse)
20. Accessibility testing
21. Mobile responsiveness
22. Cross-browser testing
23. Image optimization verification

### Phase 5: Deployment (Week 6)
24. Deploy to Vercel
25. Set up custom domain
26. Configure redirects (if needed)
27. Set up analytics
28. Final testing in production

---

## 📈 Expected Performance Improvements

| Metric | Current (WordPress) | Expected (Next.js) | Improvement |
|--------|--------------------|--------------------|-------------|
| **Lighthouse Score** | ~70-80 | 95-100 | +20-30% |
| **First Contentful Paint** | ~2-3s | ~0.5-1s | 60-75% faster |
| **Time to Interactive** | ~3-5s | ~1-2s | 60% faster |
| **Page Size** | ~2-3MB | ~500KB-1MB | 50-75% smaller |
| **Image Optimization** | None/Basic | next/image | 60-80% smaller |
| **Build Time** | N/A (dynamic) | ~2-3 min | Static generation |

---

## ⚠️ Migration Challenges

### 1. Image Migration
- **Challenge:** ~1000+ images need downloading and optimization
- **Solution:** Automated script to download, convert to WebP, optimize
- **Time:** 1-2 days

### 2. Elementor Dependencies
- **Challenge:** Complex layouts may be hard to replicate
- **Solution:** Manual recreation with Tailwind CSS, possibly simpler design
- **Time:** 3-5 days

### 3. Form Handling
- **Challenge:** Need backend for contact form
- **Solution:** Serverless function with Resend/SendGrid
- **Time:** 1 day

### 4. URL Structure
- **Challenge:** Some URLs may need to change
- **Solution:** Set up redirects in next.config.js
- **Time:** 1 day

---

## 💡 Recommendations

### Must-Have Features
1. ✅ Fast image loading (next/image)
2. ✅ Image gallery with lightbox
3. ✅ Contact form with email
4. ✅ Mobile-first responsive design
5. ✅ SEO optimization (metadata, sitemap)
6. ✅ Smooth page transitions
7. ✅ Loading states

### Nice-to-Have Features
- Blog search functionality
- Portfolio filtering by year/location
- Testimonials carousel
- Instagram feed integration
- Online booking system for fotobox
- Multi-language support (DE/EN)

### CMS Recommendation: Sanity.io

**Why Sanity?**
- ✅ Excellent for image-heavy portfolios
- ✅ Real-time preview
- ✅ Structured content modeling
- ✅ Great DX (Developer Experience)
- ✅ Free tier sufficient for this site
- ✅ Portable Query Language (GROQ)

**Alternative:** Headless WordPress
- Keep existing content
- Use WPGraphQL plugin
- Requires WordPress hosting

---

## 📝 Next Steps

1. **Decision:** Choose CMS (Sanity recommended)
2. **Setup:** Create Next.js + TypeScript project
3. **Design:** Create component library with Tailwind
4. **Content:** Start migrating portfolio items
5. **Development:** Build pages incrementally
6. **Testing:** Performance and accessibility
7. **Launch:** Deploy to Vercel

---

## 📞 Questions to Answer Before Starting

1. Do you want to keep WordPress as backend (headless) or switch CMS?
2. Are there any custom features/plugins that need to be migrated?
3. What's the priority: fast launch or pixel-perfect design match?
4. Do you need multi-language support?
5. Any integrations needed (Google Analytics, booking systems, etc.)?
6. Budget for hosting (Vercel Pro ~$20/month)?

---

**Analysis Complete** ✅
