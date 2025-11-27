#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { analyzeMetadata } from './analyze-metadata';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

interface ContentItem {
  filename: string;
  metadata: any;
  contentType: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page' | 'other';
  slug: string;
}

async function migrateMetadataOnly() {
  console.log('🚀 Starting metadata-only migration...');
  
  // Load analysis results
  const analysisPath = path.join(__dirname, '../analysis-results.json');
  if (!fs.existsSync(analysisPath)) {
    console.log('📊 Running metadata analysis first...');
    await analyzeMetadata();
  }
  
  const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
  const { grouped } = analysis;
  
  // Migrate each content type using only metadata
  await migrateWeddingsMetadata(grouped.weddings);
  await migrateLocationsMetadata(grouped.locations);
  await migrateBlogPostsMetadata(grouped.blog);
  await migrateFotoboxServicesMetadata(grouped.fotobox);
  await migrateReviewsMetadata(grouped.reviews);
  await migratePagesMetadata(grouped.pages);
  
  console.log('✅ Metadata migration completed!');
}

async function migrateWeddingsMetadata(weddings: ContentItem[]) {
  console.log(`\n🤵👰 Migrating ${weddings.length} weddings from metadata...`);
  
  for (const wedding of weddings) {
    try {
      const weddingData = {
        slug: wedding.slug,
        title: wedding.metadata.title || '',
        couple_names: extractCoupleNames(wedding.metadata.title),
        description: `Hochzeitsfotos von ${extractCoupleNames(wedding.metadata.title)} - Professionelle Hochzeitsfotografie von Daniel Zangerle`,
        featured: false,
        published: true,
        meta_title: wedding.metadata.title,
        meta_description: `Hochzeitsfotos von ${extractCoupleNames(wedding.metadata.title)} - Professionelle Hochzeitsfotografie von Daniel Zangerle dz-photo`
      };
      
      const { error } = await supabase
        .from('weddings')
        .upsert(weddingData, { onConflict: 'slug' });
      
      if (error) {
        console.error(`❌ Error migrating wedding ${wedding.slug}:`, error);
      } else {
        console.log(`✅ Migrated wedding: ${wedding.slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing wedding ${wedding.slug}:`, error);
    }
  }
}

async function migrateLocationsMetadata(locations: ContentItem[]) {
  console.log(`\n🏰 Migrating ${locations.length} locations from metadata...`);
  
  for (const location of locations) {
    try {
      const locationData = {
        slug: location.slug,
        name: extractLocationName(location.metadata.title),
        region: 'Oberösterreich',
        description: `Hochzeitslocation ${extractLocationName(location.metadata.title)} - Professionelle Hochzeitsfotografie von Daniel Zangerle`,
        featured: false,
        published: true,
        meta_title: location.metadata.title,
        meta_description: `Hochzeitslocation ${extractLocationName(location.metadata.title)} - Professionelle Hochzeitsfotografie von Daniel Zangerle dz-photo`
      };
      
      const { error } = await supabase
        .from('locations')
        .upsert(locationData, { onConflict: 'slug' });
      
      if (error) {
        console.error(`❌ Error migrating location ${location.slug}:`, error);
      } else {
        console.log(`✅ Migrated location: ${location.slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing location ${location.slug}:`, error);
    }
  }
}

async function migrateBlogPostsMetadata(blogPosts: ContentItem[]) {
  console.log(`\n📝 Migrating ${blogPosts.length} blog posts from metadata...`);
  
  for (const post of blogPosts) {
    try {
      const blogData = {
        slug: post.slug,
        number: extractTippNumber(post.slug),
        title: post.metadata.title || '',
        content: `Hochzeitstipp: ${post.metadata.title} - Professionelle Beratung von Daniel Zangerle dz-photo`,
        excerpt: `Hochzeitstipp ${extractTippNumber(post.slug)}: Professionelle Beratung für eure Hochzeit`,
        published: true,
        published_at: new Date().toISOString(),
        meta_title: post.metadata.title,
        meta_description: `${post.metadata.title} - Professionelle Hochzeitstipps von Daniel Zangerle dz-photo`
      };
      
      const { error } = await supabase
        .from('blog_posts')
        .upsert(blogData, { onConflict: 'slug' });
      
      if (error) {
        console.error(`❌ Error migrating blog post ${post.slug}:`, error);
      } else {
        console.log(`✅ Migrated blog post: ${post.slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing blog post ${post.slug}:`, error);
    }
  }
}

async function migrateFotoboxServicesMetadata(services: ContentItem[]) {
  console.log(`\n📸 Migrating ${services.length} fotobox services from metadata...`);
  
  for (const service of services) {
    try {
      const serviceData = {
        slug: service.slug,
        name: extractServiceName(service.metadata.title),
        service_type: extractServiceType(service.slug),
        description: `${extractServiceName(service.metadata.title)} - Professionelle Fotobox Services von Daniel Zangerle`,
        content: `Fotobox Service: ${extractServiceName(service.metadata.title)} - Professionelle Fotobox für eure Hochzeit`,
        popular: service.slug === 'fotobox',
        display_order: getServiceDisplayOrder(service.slug),
        active: true,
        published: true,
        meta_title: service.metadata.title,
        meta_description: `${extractServiceName(service.metadata.title)} - Professionelle Fotobox Services von Daniel Zangerle dz-photo`
      };
      
      const { error } = await supabase
        .from('fotobox_services')
        .upsert(serviceData, { onConflict: 'slug' });
      
      if (error) {
        console.error(`❌ Error migrating fotobox service ${service.slug}:`, error);
      } else {
        console.log(`✅ Migrated fotobox service: ${service.slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing fotobox service ${service.slug}:`, error);
    }
  }
}

async function migrateReviewsMetadata(reviews: ContentItem[]) {
  console.log(`\n⭐ Creating sample reviews...`);
  
  // Create sample reviews based on the testimonials from the website
  const sampleReviews = [
    {
      author_name: 'Julia & Stefan',
      review_text: 'Wir waren äußerst zufrieden mit dem Team von dz-photo. Das Fotografieren auf der Hochzeit war sehr unkompliziert und lustig. Die Fotos selbst sind der OBERHAMMER!!!',
      rating: 5,
      featured: true,
      approved: true,
      display_order: 1,
      source: 'Website',
      published: true
    },
    {
      author_name: 'Anita & Ahmet',
      review_text: 'Noch heute schwärmen die Leute von den Fotos, welche ihr von unseren großen Tag gemacht habt. Ihr habt uns von früh Morgens bis Abends begleitet. Es sind sooo schöne Aufnahmen entstanden.',
      rating: 5,
      featured: true,
      approved: true,
      display_order: 2,
      source: 'Website',
      published: true
    },
    {
      author_name: 'Tanja & Daniel',
      review_text: 'Wir sind so glücklich über die fantastisch gemachten Fotos unserer Hochzeit! Ihr wart die perfekten Begleiter auf unserem Fest, mit viel Fingerspitzengefühl und jeder Menge Spaß.',
      rating: 5,
      featured: true,
      approved: true,
      display_order: 3,
      source: 'Website',
      published: true
    },
    {
      author_name: 'Karin & Horst',
      review_text: 'Mit viel Gespür für schöne Momente, unsere Gäste und uns, Kompetenz und tollen Ideen habt ihr an diesem Tag unsere Hochzeit begleitet. Das Ergebnis sind wunderschöne Erinnerungen!',
      rating: 5,
      featured: true,
      approved: true,
      display_order: 4,
      source: 'Website',
      published: true
    }
  ];
  
  for (const review of sampleReviews) {
    try {
      const { error } = await supabase
        .from('reviews')
        .upsert(review);
      
      if (error) {
        console.error(`❌ Error migrating review:`, error);
      } else {
        console.log(`✅ Migrated review from: ${review.author_name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing review:`, error);
    }
  }
}

async function migratePagesMetadata(pages: ContentItem[]) {
  console.log(`\n📄 Migrating ${pages.length} static pages from metadata...`);
  
  for (const page of pages) {
    try {
      const pageData = {
        slug: page.slug,
        title: page.metadata.title || '',
        content: getPageContent(page.slug, page.metadata.title),
        page_type: getPageType(page.slug),
        published: true,
        meta_title: page.metadata.title,
        meta_description: `${page.metadata.title} - Daniel Zangerle dz-photo`
      };
      
      const { error } = await supabase
        .from('pages')
        .upsert(pageData, { onConflict: 'slug' });
      
      if (error) {
        console.error(`❌ Error migrating page ${page.slug}:`, error);
      } else {
        console.log(`✅ Migrated page: ${page.slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing page ${page.slug}:`, error);
    }
  }
}

// Helper functions
function extractCoupleNames(title: string): string | null {
  const match = title.match(/Hochzeit\s+([^–©]+)/i);
  return match ? match[1].trim() : null;
}

function extractLocationName(title: string): string {
  return title.replace(' – Daniel Zangerle dz-photo', '').trim();
}

function extractTippNumber(slug: string): number | null {
  const match = slug.match(/^(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function extractServiceName(title: string): string {
  return title.replace(' – Daniel Zangerle dz-photo', '').trim();
}

function extractServiceType(slug: string): string {
  if (slug.includes('b2b')) return 'business';
  if (slug.includes('fruehbucher')) return 'early-bird';
  if (slug.includes('blitzangebot')) return 'special-offer';
  return 'package';
}

function getServiceDisplayOrder(slug: string): number {
  const order: { [key: string]: number } = {
    'fotobox': 1,
    'photoboothdz': 2,
    'fotobox-fruehbucher': 3,
    'fotoboxb2b': 4
  };
  return order[slug] || 99;
}

function getPageType(slug: string): string {
  if (slug.includes('kontakt')) return 'contact';
  if (slug.includes('impressum')) return 'legal';
  if (slug.includes('datenschutz')) return 'legal';
  if (slug.includes('agb')) return 'legal';
  if (slug.includes('about')) return 'about';
  if (slug.includes('engagement')) return 'services';
  if (slug.includes('heiraten')) return 'services';
  return 'general';
}

function getPageContent(slug: string, title: string): string {
  const contentMap: { [key: string]: string } = {
    'kontakt-anfrage': 'Kontaktieren Sie uns für Ihre Hochzeitsfotografie. Wir freuen uns auf Ihre Anfrage!',
    'impressum': 'Impressum - Daniel Zangerle dz-photo\n\nAngaben gemäß § 5 TMG:\nDaniel Zangerle\nHochzeitsfotograf\n\nKontakt:\nE-Mail: info@dz-photo.at',
    'datenschutzerklaerung': 'Datenschutzerklärung - Daniel Zangerle dz-photo\n\nWir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.',
    'agb': 'Allgemeine Geschäftsbedingungen - Daniel Zangerle dz-photo\n\nDiese AGB gelten für alle Leistungen von Daniel Zangerle dz-photo.',
    'about': 'Über uns - Daniel Zangerle dz-photo\n\nProfessionelle Hochzeitsfotografie mit Leidenschaft und Erfahrung.',
    'engagement-shooting-info': 'Engagement Shooting - Daniel Zangerle dz-photo\n\nEin Engagement Shooting bietet viele Vorteile vor eurer Hochzeit.'
  };
  
  return contentMap[slug] || `${title}\n\nProfessionelle Hochzeitsfotografie von Daniel Zangerle dz-photo.`;
}

// Run migration
if (require.main === module) {
  migrateMetadataOnly().catch(console.error);
}

export { migrateMetadataOnly };
