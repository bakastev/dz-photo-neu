#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { analyzeMetadata } from './analyze-metadata';
import * as cheerio from 'cheerio';

// Supabase client - using anon key for now (will need service role key for production)
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

interface ContentItem {
  filename: string;
  metadata: any;
  contentType: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page' | 'other';
  slug: string;
}

async function migrateContent() {
  console.log('🚀 Starting content migration...');
  
  // Load analysis results
  const analysisPath = path.join(__dirname, '../analysis-results.json');
  if (!fs.existsSync(analysisPath)) {
    console.log('📊 Running metadata analysis first...');
    await analyzeMetadata();
  }
  
  const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
  const { grouped } = analysis;
  
  // Migrate each content type
  await migrateWeddings(grouped.weddings);
  await migrateLocations(grouped.locations);
  await migrateBlogPosts(grouped.blog);
  await migrateFotoboxServices(grouped.fotobox);
  await migrateReviews(grouped.reviews);
  await migratePages(grouped.pages);
  
  console.log('✅ Content migration completed!');
}

async function migrateWeddings(weddings: ContentItem[]) {
  console.log(`\n🤵👰 Migrating ${weddings.length} weddings...`);
  
  for (const wedding of weddings) {
    try {
      const htmlContent = await loadHtmlContent(wedding.filename);
      const $ = cheerio.load(htmlContent);
      
      // Extract wedding data
      const weddingData = {
        slug: wedding.slug,
        title: wedding.metadata.title || '',
        couple_names: extractCoupleNames(wedding.metadata.title),
        wedding_date: extractWeddingDate($),
        location: extractLocation($),
        description: extractDescription($),
        images: extractImages($),
        cover_image: extractCoverImage($),
        featured: false,
        published: true,
        meta_title: wedding.metadata.title,
        meta_description: extractMetaDescription($, wedding.metadata.title)
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

async function migrateLocations(locations: ContentItem[]) {
  console.log(`\n🏰 Migrating ${locations.length} locations...`);
  
  for (const location of locations) {
    try {
      const htmlContent = await loadHtmlContent(location.filename);
      const $ = cheerio.load(htmlContent);
      
      const locationData = {
        slug: location.slug,
        name: extractLocationName(location.metadata.title),
        address: extractAddress($),
        city: extractCity($),
        region: 'Oberösterreich', // Default region
        description: extractDescription($),
        features: extractLocationFeatures($),
        images: extractImages($),
        cover_image: extractCoverImage($),
        website: extractWebsite($),
        phone: extractPhone($),
        email: extractEmail($),
        capacity_min: extractCapacityMin($),
        capacity_max: extractCapacityMax($),
        featured: false,
        published: true,
        meta_title: location.metadata.title,
        meta_description: extractMetaDescription($, location.metadata.title)
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

async function migrateBlogPosts(blogPosts: ContentItem[]) {
  console.log(`\n📝 Migrating ${blogPosts.length} blog posts...`);
  
  for (const post of blogPosts) {
    try {
      const htmlContent = await loadHtmlContent(post.filename);
      const $ = cheerio.load(htmlContent);
      
      const blogData = {
        slug: post.slug,
        number: extractTippNumber(post.slug),
        title: post.metadata.title || '',
        content: extractBlogContent($),
        excerpt: extractExcerpt($),
        featured_image: extractCoverImage($),
        images: extractImages($),
        published: true,
        published_at: new Date().toISOString(),
        meta_title: post.metadata.title,
        meta_description: extractMetaDescription($, post.metadata.title)
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

async function migrateFotoboxServices(services: ContentItem[]) {
  console.log(`\n📸 Migrating ${services.length} fotobox services...`);
  
  for (const service of services) {
    try {
      const htmlContent = await loadHtmlContent(service.filename);
      const $ = cheerio.load(htmlContent);
      
      const serviceData = {
        slug: service.slug,
        name: extractServiceName(service.metadata.title),
        service_type: extractServiceType(service.slug),
        price: extractPrice($),
        currency: 'EUR',
        features: extractServiceFeatures($),
        description: extractDescription($),
        content: extractBlogContent($),
        featured_image: extractCoverImage($),
        images: extractImages($),
        popular: service.slug === 'fotobox', // Main fotobox service is popular
        display_order: getServiceDisplayOrder(service.slug),
        active: true,
        published: true,
        meta_title: service.metadata.title,
        meta_description: extractMetaDescription($, service.metadata.title)
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

async function migrateReviews(reviews: ContentItem[]) {
  console.log(`\n⭐ Migrating ${reviews.length} review pages...`);
  
  for (const review of reviews) {
    try {
      const htmlContent = await loadHtmlContent(review.filename);
      const $ = cheerio.load(htmlContent);
      
      // Extract individual reviews from the page
      const individualReviews = extractIndividualReviews($);
      
      for (const reviewData of individualReviews) {
        const { error } = await supabase
          .from('reviews')
          .upsert(reviewData, { onConflict: 'id' });
        
        if (error) {
          console.error(`❌ Error migrating review:`, error);
        } else {
          console.log(`✅ Migrated review from: ${reviewData.author_name}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing reviews ${review.slug}:`, error);
    }
  }
}

async function migratePages(pages: ContentItem[]) {
  console.log(`\n📄 Migrating ${pages.length} static pages...`);
  
  for (const page of pages) {
    try {
      const htmlContent = await loadHtmlContent(page.filename);
      const $ = cheerio.load(htmlContent);
      
      const pageData = {
        slug: page.slug,
        title: page.metadata.title || '',
        content: extractBlogContent($),
        page_type: getPageType(page.slug),
        published: true,
        meta_title: page.metadata.title,
        meta_description: extractMetaDescription($, page.metadata.title)
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
async function loadHtmlContent(filename: string): Promise<string> {
  const htmlPath = path.join(__dirname, '../dz-photo-alt/html', filename.replace('__metadata.json', '.html'));
  if (fs.existsSync(htmlPath)) {
    return fs.readFileSync(htmlPath, 'utf-8');
  }
  return '';
}

function extractCoupleNames(title: string): string | null {
  const match = title.match(/Hochzeit\s+([^–©]+)/i);
  return match ? match[1].trim() : null;
}

function extractWeddingDate($: cheerio.CheerioAPI): Date | null {
  // Try to find date in various formats
  const dateText = $('time, .date, .wedding-date').first().text();
  if (dateText) {
    const date = new Date(dateText);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function extractLocation($: cheerio.CheerioAPI): string | null {
  const locationText = $('.location, .venue, .ort').first().text().trim();
  return locationText || null;
}

function extractDescription($: cheerio.CheerioAPI): string | null {
  // Try to find description in various selectors
  const description = $('meta[name="description"]').attr('content') ||
                     $('.description, .excerpt, .intro').first().text().trim() ||
                     $('p').first().text().trim();
  
  return description && description.length > 20 ? description.substring(0, 300) : null;
}

function extractImages($: cheerio.CheerioAPI): any[] {
  const images: any[] = [];
  
  $('img').each((i, img) => {
    const src = $(img).attr('src');
    const alt = $(img).attr('alt') || '';
    
    if (src && src.includes('wp-content/uploads')) {
      images.push({
        url: src,
        alt: alt,
        order: i
      });
    }
  });
  
  return images;
}

function extractCoverImage($: cheerio.CheerioAPI): string | null {
  const firstImage = $('img').first().attr('src');
  return firstImage && firstImage.includes('wp-content/uploads') ? firstImage : null;
}

function extractMetaDescription($: cheerio.CheerioAPI, title: string): string {
  const metaDesc = $('meta[name="description"]').attr('content');
  if (metaDesc && metaDesc.length > 20) {
    return metaDesc.substring(0, 160);
  }
  
  const firstParagraph = $('p').first().text().trim();
  if (firstParagraph && firstParagraph.length > 20) {
    return firstParagraph.substring(0, 160);
  }
  
  return `${title} - Professionelle Hochzeitsfotografie von Daniel Zangerle dz-photo`;
}

function extractLocationName(title: string): string {
  return title.replace(' – Daniel Zangerle dz-photo', '').trim();
}

function extractAddress($: cheerio.CheerioAPI): string | null {
  const address = $('.address, .adresse').first().text().trim();
  return address || null;
}

function extractCity($: cheerio.CheerioAPI): string | null {
  const city = $('.city, .stadt, .ort').first().text().trim();
  return city || null;
}

function extractLocationFeatures($: cheerio.CheerioAPI): any[] {
  const features: string[] = [];
  
  $('.features li, .ausstattung li, .feature').each((i, el) => {
    const feature = $(el).text().trim();
    if (feature) features.push(feature);
  });
  
  return features;
}

function extractWebsite($: cheerio.CheerioAPI): string | null {
  const website = $('a[href*="http"]').first().attr('href');
  return website && !website.includes('dz-photo.at') ? website : null;
}

function extractPhone($: cheerio.CheerioAPI): string | null {
  const phoneText = $('.phone, .telefon, .tel').first().text().trim();
  const phoneMatch = phoneText.match(/[\d\s\+\-\(\)]+/);
  return phoneMatch ? phoneMatch[0].trim() : null;
}

function extractEmail($: cheerio.CheerioAPI): string | null {
  const emailMatch = $.html().match(/[\w\.-]+@[\w\.-]+\.\w+/);
  return emailMatch ? emailMatch[0] : null;
}

function extractCapacityMin($: cheerio.CheerioAPI): number | null {
  const capacityText = $('.capacity, .kapazitaet').first().text();
  const match = capacityText.match(/(\d+)\s*-\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function extractCapacityMax($: cheerio.CheerioAPI): number | null {
  const capacityText = $('.capacity, .kapazitaet').first().text();
  const match = capacityText.match(/(\d+)\s*-\s*(\d+)/);
  return match ? parseInt(match[2]) : null;
}

function extractTippNumber(slug: string): number | null {
  const match = slug.match(/^(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function extractBlogContent($: cheerio.CheerioAPI): string {
  // Remove script and style elements
  $('script, style, nav, header, footer').remove();
  
  // Get main content
  const content = $('.content, .post-content, .entry-content, main, article').first();
  if (content.length) {
    return content.text().trim();
  }
  
  // Fallback to body content
  return $('body').text().trim().substring(0, 5000);
}

function extractExcerpt($: cheerio.CheerioAPI): string | null {
  const firstParagraph = $('p').first().text().trim();
  return firstParagraph && firstParagraph.length > 20 ? 
    firstParagraph.substring(0, 200) + '...' : null;
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

function extractPrice($: cheerio.CheerioAPI): number | null {
  const priceText = $('.price, .preis').first().text();
  const match = priceText.match(/(\d+(?:,\d+)?)\s*€/);
  return match ? parseFloat(match[1].replace(',', '.')) : null;
}

function extractServiceFeatures($: cheerio.CheerioAPI): any[] {
  const features: string[] = [];
  
  $('.features li, .leistungen li, ul li').each((i, el) => {
    const feature = $(el).text().trim();
    if (feature && feature.length > 3 && feature.length < 100) {
      features.push(feature);
    }
  });
  
  return features.slice(0, 10); // Limit to 10 features
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

function extractIndividualReviews($: cheerio.CheerioAPI): any[] {
  const reviews: any[] = [];
  
  $('.review, .testimonial, .rezension').each((i, el) => {
    const $review = $(el);
    const authorName = $review.find('.author, .name, h3, h4').first().text().trim();
    const reviewText = $review.find('.text, .content, p').first().text().trim();
    
    if (authorName && reviewText && reviewText.length > 20) {
      reviews.push({
        author_name: authorName,
        review_text: reviewText,
        rating: 5, // Default to 5 stars
        featured: true,
        approved: true,
        display_order: i + 1,
        source: 'Website',
        published: true
      });
    }
  });
  
  return reviews;
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

// Run migration
if (require.main === module) {
  migrateContent().catch(console.error);
}

export { migrateContent };
