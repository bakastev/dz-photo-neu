#!/usr/bin/env npx tsx
/**
 * Script 1: Analyze all image sources from scraped HTML files
 * Extracts all image URLs, groups them by base filename, and identifies quality variants
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const HTML_DIR = path.join(process.cwd(), 'dz-photo-alt', 'html');
const OUTPUT_FILE = path.join(process.cwd(), 'comprehensive-image-analysis.json');

interface ImageVariant {
  url: string;
  width?: number;
  height?: number;
  suffix: string; // e.g., "-scaled", "-400x284", ""
  estimatedSize: 'original' | 'scaled' | 'large' | 'medium' | 'small' | 'thumbnail';
}

interface ImageGroup {
  baseFilename: string;
  variants: ImageVariant[];
  bestQuality: string | null;
  contentType: 'wedding' | 'location' | 'blog' | 'fotobox' | 'page' | 'unknown';
  slug: string;
  sourceFile: string;
}

interface AnalysisResult {
  totalUrls: number;
  uniqueBaseImages: number;
  byContentType: Record<string, number>;
  byQuality: Record<string, number>;
  images: ImageGroup[];
  missingHighQuality: ImageGroup[];
}

function extractBaseFilename(url: string): { base: string; suffix: string; width?: number; height?: number } {
  const filename = url.split('/').pop() || '';
  
  // Match patterns like: DDZ_1234-400x284.jpg, DDZ_1234-scaled.jpg, DDZ_1234.jpg
  const sizeMatch = filename.match(/^(.+?)-(\d+)x(\d+)\.(jpg|jpeg|png|gif|webp)$/i);
  if (sizeMatch) {
    return {
      base: sizeMatch[1],
      suffix: `-${sizeMatch[2]}x${sizeMatch[3]}`,
      width: parseInt(sizeMatch[2]),
      height: parseInt(sizeMatch[3])
    };
  }
  
  const scaledMatch = filename.match(/^(.+?)-scaled\.(jpg|jpeg|png|gif|webp)$/i);
  if (scaledMatch) {
    return { base: scaledMatch[1], suffix: '-scaled' };
  }
  
  const plainMatch = filename.match(/^(.+?)\.(jpg|jpeg|png|gif|webp)$/i);
  if (plainMatch) {
    return { base: plainMatch[1], suffix: '' };
  }
  
  return { base: filename, suffix: '' };
}

function estimateQuality(variant: ImageVariant): ImageVariant['estimatedSize'] {
  if (variant.suffix === '' && !variant.width) return 'original';
  if (variant.suffix === '-scaled') return 'scaled';
  if (variant.width && variant.width >= 1024) return 'large';
  if (variant.width && variant.width >= 600) return 'medium';
  if (variant.width && variant.width >= 300) return 'small';
  return 'thumbnail';
}

function getContentType(htmlFile: string, url: string): { type: ImageGroup['contentType']; slug: string } {
  const filename = htmlFile.toLowerCase();
  
  if (filename.includes('_locations_')) {
    const match = filename.match(/_locations_([^_]+)_/);
    return { type: 'location', slug: match?.[1] || 'unknown' };
  }
  
  if (filename.includes('hochzeit-') && !filename.includes('locations')) {
    const match = filename.match(/hochzeit-([^_]+)/);
    return { type: 'wedding', slug: match?.[1]?.replace(/_$/, '') || 'unknown' };
  }
  
  if (filename.includes('tipp-') || filename.includes('_tipp')) {
    const match = filename.match(/tipp-?(\d+)/);
    return { type: 'blog', slug: match?.[1] || 'unknown' };
  }
  
  if (filename.includes('photobooth') || filename.includes('fotobox')) {
    return { type: 'fotobox', slug: 'fotobox' };
  }
  
  return { type: 'unknown', slug: 'unknown' };
}

function extractImagesFromHtml(htmlPath: string): Map<string, ImageGroup> {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const $ = cheerio.load(html);
  const filename = path.basename(htmlPath);
  
  const imageGroups = new Map<string, ImageGroup>();
  
  // Extract from img src
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    const srcset = $(el).attr('srcset');
    
    if (src && src.includes('dz-photo.at/wp-content/uploads')) {
      processUrl(src, filename, imageGroups);
    }
    
    // Parse srcset for additional sizes
    if (srcset) {
      const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
      urls.forEach(url => {
        if (url.includes('dz-photo.at/wp-content/uploads')) {
          processUrl(url, filename, imageGroups);
        }
      });
    }
  });
  
  // Extract from a href (lightbox links)
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('dz-photo.at/wp-content/uploads') && 
        (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png'))) {
      processUrl(href, filename, imageGroups);
    }
  });
  
  // Extract from data attributes
  $('[data-src], [data-large-file], [data-medium-file]').each((_, el) => {
    ['data-src', 'data-large-file', 'data-medium-file'].forEach(attr => {
      const url = $(el).attr(attr);
      if (url && url.includes('dz-photo.at/wp-content/uploads')) {
        processUrl(url, filename, imageGroups);
      }
    });
  });
  
  return imageGroups;
}

function processUrl(url: string, sourceFile: string, groups: Map<string, ImageGroup>) {
  const { base, suffix, width, height } = extractBaseFilename(url);
  const { type, slug } = getContentType(sourceFile, url);
  
  const variant: ImageVariant = {
    url,
    suffix,
    width,
    height,
    estimatedSize: 'original' // will be set properly below
  };
  variant.estimatedSize = estimateQuality(variant);
  
  if (!groups.has(base)) {
    groups.set(base, {
      baseFilename: base,
      variants: [],
      bestQuality: null,
      contentType: type,
      slug,
      sourceFile
    });
  }
  
  const group = groups.get(base)!;
  
  // Only add if this exact URL isn't already in variants
  if (!group.variants.some(v => v.url === url)) {
    group.variants.push(variant);
  }
  
  // Update content type if we have better info
  if (type !== 'unknown' && group.contentType === 'unknown') {
    group.contentType = type;
    group.slug = slug;
  }
}

function determineBestQuality(group: ImageGroup): string | null {
  const priority: ImageVariant['estimatedSize'][] = ['original', 'scaled', 'large', 'medium', 'small', 'thumbnail'];
  
  for (const quality of priority) {
    const variant = group.variants.find(v => v.estimatedSize === quality);
    if (variant) return variant.url;
  }
  
  return group.variants[0]?.url || null;
}

async function main() {
  console.log('🔍 Analyzing image sources from HTML files...\n');
  
  const htmlFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
  console.log(`📁 Found ${htmlFiles.length} HTML files to analyze\n`);
  
  const allGroups = new Map<string, ImageGroup>();
  
  for (const file of htmlFiles) {
    const filePath = path.join(HTML_DIR, file);
    const groups = extractImagesFromHtml(filePath);
    
    // Merge into allGroups
    groups.forEach((group, base) => {
      if (allGroups.has(base)) {
        const existing = allGroups.get(base)!;
        group.variants.forEach(v => {
          if (!existing.variants.some(ev => ev.url === v.url)) {
            existing.variants.push(v);
          }
        });
        if (group.contentType !== 'unknown' && existing.contentType === 'unknown') {
          existing.contentType = group.contentType;
          existing.slug = group.slug;
        }
      } else {
        allGroups.set(base, group);
      }
    });
  }
  
  // Determine best quality for each group
  allGroups.forEach(group => {
    group.bestQuality = determineBestQuality(group);
  });
  
  // Build analysis result
  const images = Array.from(allGroups.values());
  
  const byContentType: Record<string, number> = {};
  const byQuality: Record<string, number> = {};
  
  images.forEach(img => {
    byContentType[img.contentType] = (byContentType[img.contentType] || 0) + 1;
    img.variants.forEach(v => {
      byQuality[v.estimatedSize] = (byQuality[v.estimatedSize] || 0) + 1;
    });
  });
  
  const missingHighQuality = images.filter(img => {
    const hasHighQuality = img.variants.some(v => 
      v.estimatedSize === 'original' || v.estimatedSize === 'scaled' || v.estimatedSize === 'large'
    );
    return !hasHighQuality;
  });
  
  const result: AnalysisResult = {
    totalUrls: images.reduce((sum, img) => sum + img.variants.length, 0),
    uniqueBaseImages: images.length,
    byContentType,
    byQuality,
    images,
    missingHighQuality
  };
  
  // Write results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  
  // Print summary
  console.log('📊 ANALYSIS SUMMARY\n');
  console.log(`Total unique URLs found: ${result.totalUrls}`);
  console.log(`Unique base images: ${result.uniqueBaseImages}`);
  console.log(`\n📁 By Content Type:`);
  Object.entries(byContentType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log(`\n📐 By Quality:`);
  Object.entries(byQuality).sort((a, b) => {
    const order = ['original', 'scaled', 'large', 'medium', 'small', 'thumbnail'];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  }).forEach(([quality, count]) => {
    const icon = ['original', 'scaled', 'large'].includes(quality) ? '✅' : '⚠️';
    console.log(`  ${icon} ${quality}: ${count}`);
  });
  
  console.log(`\n⚠️ Images missing high-quality version: ${missingHighQuality.length}`);
  
  // Show sample of locations with their image counts
  console.log(`\n📍 LOCATIONS IMAGE COUNT:`);
  const locationImages = images.filter(img => img.contentType === 'location');
  const locationsBySlug = new Map<string, ImageGroup[]>();
  locationImages.forEach(img => {
    if (!locationsBySlug.has(img.slug)) {
      locationsBySlug.set(img.slug, []);
    }
    locationsBySlug.get(img.slug)!.push(img);
  });
  
  locationsBySlug.forEach((imgs, slug) => {
    const highQuality = imgs.filter(img => 
      img.variants.some(v => ['original', 'scaled', 'large'].includes(v.estimatedSize))
    ).length;
    console.log(`  ${slug}: ${imgs.length} images (${highQuality} high-quality)`);
  });
  
  // Show sample of weddings
  console.log(`\n💒 WEDDINGS IMAGE COUNT:`);
  const weddingImages = images.filter(img => img.contentType === 'wedding');
  const weddingsBySlug = new Map<string, ImageGroup[]>();
  weddingImages.forEach(img => {
    if (!weddingsBySlug.has(img.slug)) {
      weddingsBySlug.set(img.slug, []);
    }
    weddingsBySlug.get(img.slug)!.push(img);
  });
  
  weddingsBySlug.forEach((imgs, slug) => {
    const highQuality = imgs.filter(img => 
      img.variants.some(v => ['original', 'scaled', 'large'].includes(v.estimatedSize))
    ).length;
    console.log(`  ${slug}: ${imgs.length} images (${highQuality} high-quality)`);
  });
  
  console.log(`\n✅ Analysis saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);


