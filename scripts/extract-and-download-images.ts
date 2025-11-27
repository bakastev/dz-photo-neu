#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

interface ImageInfo {
  url: string;
  filename: string;
  alt: string;
  contentType: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page';
  slug: string;
  htmlFile: string;
}

async function extractAndDownloadImages() {
  console.log('🖼️ Extracting images from HTML files...');
  
  const htmlDir = path.join(__dirname, '../dz-photo-alt/html');
  const downloadDir = path.join(__dirname, '../downloads/images');
  
  // Create download directory
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  // Load analysis results to map HTML files to content types
  const analysisPath = path.join(__dirname, '../analysis-results.json');
  const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
  
  const allImages: ImageInfo[] = [];
  const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
  
  console.log(`📄 Processing ${htmlFiles.length} HTML files...`);
  
  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(htmlDir, htmlFile);
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const $ = cheerio.load(htmlContent);
    
    // Find corresponding content type and slug
    const { contentType, slug } = getContentTypeFromFilename(htmlFile, analysis);
    
    // Extract all WordPress images
    $('img').each((i, img) => {
      const src = $(img).attr('src');
      const alt = $(img).attr('alt') || '';
      
      if (src && src.includes('wp-content/uploads')) {
        const filename = path.basename(new URL(src).pathname);
        
        allImages.push({
          url: src,
          filename,
          alt,
          contentType: contentType as "wedding" | "location" | "page" | "blog" | "fotobox" | "review",
          slug,
          htmlFile
        });
      }
    });
  }
  
  // Remove duplicates based on URL
  const uniqueImages = Array.from(
    new Map(allImages.map(img => [img.url, img])).values()
  );
  
  console.log(`\n📊 Found ${uniqueImages.length} unique images (${allImages.length} total)`);
  
  // Group by content type
  const grouped = uniqueImages.reduce((acc, img) => {
    if (!acc[img.contentType]) acc[img.contentType] = [];
    acc[img.contentType].push(img);
    return acc;
  }, {} as Record<string, ImageInfo[]>);
  
  // Print statistics
  console.log('\n📈 Images by content type:');
  for (const [type, images] of Object.entries(grouped)) {
    console.log(`${type}: ${images.length} images`);
  }
  
  // Download images
  console.log('\n📥 Downloading images...');
  let downloaded = 0;
  let failed = 0;
  
  for (const image of uniqueImages) {
    try {
      console.log(`Downloading: ${image.filename}`);
      
      const response = await fetch(image.url);
      if (response.ok) {
        const buffer = await response.buffer();
        
        // Create subdirectory for content type
        const typeDir = path.join(downloadDir, image.contentType);
        if (!fs.existsSync(typeDir)) {
          fs.mkdirSync(typeDir, { recursive: true });
        }
        
        const filePath = path.join(typeDir, image.filename);
        fs.writeFileSync(filePath, buffer);
        
        console.log(`✅ Downloaded: ${image.filename}`);
        downloaded++;
        
        // Small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.log(`❌ Failed to download: ${image.filename} (Status: ${response.status})`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ Error downloading ${image.filename}:`, error);
      failed++;
    }
  }
  
  console.log(`\n✅ Download completed! ${downloaded} successful, ${failed} failed`);
  
  // Save image mapping for later use
  const imageMapping = {
    total: uniqueImages.length,
    downloaded,
    failed,
    grouped,
    allImages: uniqueImages
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../image-mapping.json'),
    JSON.stringify(imageMapping, null, 2)
  );
  
  console.log('💾 Image mapping saved to image-mapping.json');
  
  // Update database with image information
  await updateDatabaseWithImages(grouped);
  
  return imageMapping;
}

function getContentTypeFromFilename(htmlFile: string, analysis: any): { contentType: string, slug: string } {
  // Extract the base filename without extension
  const baseName = htmlFile.replace('.html', '');
  
  // Search through all content types to find matching filename
  for (const [contentType: contentType as any, items] of Object.entries(analysis.grouped)) {
    if (contentType === 'other') continue;
    
    for (const item of items as any[]) {
      const metadataFile = item.filename.replace('__metadata.json', '.html');
      if (baseName.includes(item.slug) || metadataFile.includes(baseName)) {
        return { contentType: contentType as any, slug: item.slug };
      }
    }
  }
  
  // Fallback: try to determine from filename patterns
  if (htmlFile.includes('hochzeit') || htmlFile.includes('wedding')) {
    return { contentType: 'wedding', slug: extractSlugFromFilename(htmlFile) };
  } else if (htmlFile.includes('locations')) {
    return { contentType: 'location', slug: extractSlugFromFilename(htmlFile) };
  } else if (htmlFile.includes('tipp')) {
    return { contentType: 'blog', slug: extractSlugFromFilename(htmlFile) };
  } else if (htmlFile.includes('fotobox') || htmlFile.includes('photobooth')) {
    return { contentType: 'fotobox', slug: extractSlugFromFilename(htmlFile) };
  } else if (htmlFile.includes('rezension')) {
    return { contentType: 'review', slug: extractSlugFromFilename(htmlFile) };
  } else {
    return { contentType: 'page', slug: extractSlugFromFilename(htmlFile) };
  }
}

function extractSlugFromFilename(htmlFile: string): string {
  // Extract slug from filename like "005_www.dz-photo.at_hochzeit-tanja-daniel_.html"
  const parts = htmlFile.split('_');
  if (parts.length >= 3) {
    return parts[parts.length - 1].replace('.html', '').replace(/^_+|_+$/g, '');
  }
  return htmlFile.replace('.html', '');
}

async function updateDatabaseWithImages(grouped: Record<string, ImageInfo[]>) {
  console.log('\n📝 Updating database with image information...');
  
  // Update weddings
  if (grouped.wedding) {
    for (const contentSlug of [...new Set(grouped.wedding.map(img => img.slug))]) {
      const images = grouped.wedding.filter(img => img.slug === contentSlug);
      const imageData = images.map((img, idx) => ({
        url: img.url,
        alt: img.alt || `Hochzeitsfoto ${idx + 1}`,
        order: idx
      }));
      
      await supabase
        .from('weddings')
        .update({
          cover_image: images[0]?.url,
          images: imageData
        })
        .eq('slug', contentSlug);
      
      console.log(`✅ Updated wedding ${contentSlug} with ${images.length} images`);
    }
  }
  
  // Update locations
  if (grouped.location) {
    for (const contentSlug of [...new Set(grouped.location.map(img => img.slug))]) {
      const images = grouped.location.filter(img => img.slug === contentSlug);
      const imageData = images.map((img, idx) => ({
        url: img.url,
        alt: img.alt || `Location ${contentSlug} Bild ${idx + 1}`,
        order: idx
      }));
      
      await supabase
        .from('locations')
        .update({
          cover_image: images[0]?.url,
          images: imageData
        })
        .eq('slug', contentSlug);
      
      console.log(`✅ Updated location ${contentSlug} with ${images.length} images`);
    }
  }
  
  // Update blog posts
  if (grouped.blog) {
    for (const contentSlug of [...new Set(grouped.blog.map(img => img.slug))]) {
      const images = grouped.blog.filter(img => img.slug === contentSlug);
      
      await supabase
        .from('blog_posts')
        .update({
          featured_image: images[0]?.url
        })
        .eq('slug', contentSlug);
      
      console.log(`✅ Updated blog post ${contentSlug} with featured image`);
    }
  }
  
  // Update fotobox services
  if (grouped.fotobox) {
    for (const contentSlug of [...new Set(grouped.fotobox.map(img => img.slug))]) {
      const images = grouped.fotobox.filter(img => img.slug === contentSlug);
      const imageData = images.map((img, idx) => ({
        url: img.url,
        alt: img.alt || `Fotobox ${idx + 1}`,
        order: idx
      }));
      
      await supabase
        .from('fotobox_services')
        .update({
          featured_image: images[0]?.url,
          images: imageData
        })
        .eq('slug', contentSlug);
      
      console.log(`✅ Updated fotobox service ${contentSlug} with ${images.length} images`);
    }
  }
  
  console.log('✅ Database updated with original image URLs!');
}

// Run extraction and download
if (require.main === module) {
  extractAndDownloadImages().catch(console.error);
}

export { extractAndDownloadImages };
