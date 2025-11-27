/**
 * Script to update database records with correct image paths from Supabase Storage
 * The images are already uploaded, we just need to update the database references
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Hardcoded for migration script - use anon key since we just need to update public tables
const supabaseUrl = 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load the image mapping
const mappingPath = path.join(process.cwd(), 'image-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

interface ImageMapping {
  url: string;
  filename: string;
  alt: string;
  contentType: string;
  slug: string;
  htmlFile: string;
}

// Group images by content type and slug
function groupImagesBySlug(images: ImageMapping[]): Map<string, ImageMapping[]> {
  const grouped = new Map<string, ImageMapping[]>();
  
  for (const img of images) {
    const key = `${img.contentType}:${img.slug}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(img);
  }
  
  return grouped;
}

async function updateWeddings() {
  console.log('\n📸 Updating Weddings with images...');
  
  const weddingImages = mapping.grouped.weddings || [];
  const grouped = groupImagesBySlug(weddingImages);
  
  // Get all weddings from database
  const { data: weddings, error } = await supabase
    .from('weddings')
    .select('id, slug, title');
  
  if (error) {
    console.error('Error fetching weddings:', error);
    return;
  }
  
  let updated = 0;
  
  for (const wedding of weddings || []) {
    // Find images for this wedding slug
    const key = `weddings:${wedding.slug}`;
    const images = grouped.get(key) || [];
    
    // Also try without the content type prefix in slug matching
    let allImages: ImageMapping[] = [...images];
    
    // Search through all wedding images for matching slug patterns
    for (const img of weddingImages) {
      const slugMatch = wedding.slug.toLowerCase().includes(img.slug.toLowerCase()) ||
                       img.slug.toLowerCase().includes(wedding.slug.toLowerCase());
      if (slugMatch && !allImages.find(i => i.filename === img.filename)) {
        allImages.push(img);
      }
    }
    
    if (allImages.length > 0) {
      // Use the first image as cover_image
      const coverImage = `weddings/${allImages[0].filename}`;
      const imageArray = allImages.map(img => `weddings/${img.filename}`);
      
      const { error: updateError } = await supabase
        .from('weddings')
        .update({
          cover_image: coverImage,
          images: imageArray
        })
        .eq('id', wedding.id);
      
      if (updateError) {
        console.error(`  ❌ Error updating ${wedding.slug}:`, updateError);
      } else {
        console.log(`  ✅ ${wedding.slug}: ${allImages.length} images`);
        updated++;
      }
    }
  }
  
  console.log(`  📊 Updated ${updated}/${weddings?.length || 0} weddings`);
}

async function updateLocations() {
  console.log('\n📍 Updating Locations with images...');
  
  const locationImages = mapping.grouped.locations || [];
  
  // Get all locations from database
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, slug, name');
  
  if (error) {
    console.error('Error fetching locations:', error);
    return;
  }
  
  let updated = 0;
  
  for (const location of locations || []) {
    // Find images for this location
    // Match by slug or by name similarity
    const matchingImages = locationImages.filter((img: ImageMapping) => {
      const slugMatch = img.slug.toLowerCase() === location.slug.toLowerCase();
      const nameMatch = location.name.toLowerCase().includes(img.slug.toLowerCase()) ||
                       img.slug.toLowerCase().includes(location.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
      return slugMatch || nameMatch;
    });
    
    if (matchingImages.length > 0) {
      const coverImage = `locations/${matchingImages[0].filename}`;
      const imageArray = matchingImages.map((img: ImageMapping) => `locations/${img.filename}`);
      
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          cover_image: coverImage,
          images: imageArray
        })
        .eq('id', location.id);
      
      if (updateError) {
        console.error(`  ❌ Error updating ${location.slug}:`, updateError);
      } else {
        console.log(`  ✅ ${location.slug} (${location.name}): ${matchingImages.length} images`);
        updated++;
      }
    }
  }
  
  console.log(`  📊 Updated ${updated}/${locations?.length || 0} locations`);
}

async function updateBlogPosts() {
  console.log('\n📝 Updating Blog Posts with images...');
  
  const blogImages = mapping.grouped.blog || [];
  const grouped = groupImagesBySlug(blogImages);
  
  // Get all blog posts from database
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title');
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    return;
  }
  
  let updated = 0;
  
  for (const post of posts || []) {
    // Find images for this blog post
    const key = `blog:${post.slug}`;
    const images = grouped.get(key) || [];
    
    if (images.length > 0) {
      const featuredImage = `blog/${images[0].filename}`;
      
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          featured_image: featuredImage,
          images: images.map(img => `blog/${img.filename}`)
        })
        .eq('id', post.id);
      
      if (updateError) {
        console.error(`  ❌ Error updating ${post.slug}:`, updateError);
      } else {
        console.log(`  ✅ ${post.slug}: ${images.length} images`);
        updated++;
      }
    }
  }
  
  console.log(`  📊 Updated ${updated}/${posts?.length || 0} blog posts`);
}

async function listStorageBuckets() {
  console.log('\n🗂️ Checking Storage Buckets...');
  
  const buckets = ['weddings', 'locations', 'blog', 'reviews', 'pages'];
  
  for (const bucket of buckets) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', { limit: 100 });
    
    if (error) {
      console.log(`  ❌ ${bucket}: Error - ${error.message}`);
    } else {
      console.log(`  ✅ ${bucket}: ${data?.length || 0} files`);
    }
  }
}

async function main() {
  console.log('🚀 Starting database image update...');
  console.log(`📁 Using mapping from: ${mappingPath}`);
  console.log(`📊 Total images in mapping: ${mapping.total}`);
  console.log(`✅ Downloaded: ${mapping.downloaded}`);
  console.log(`❌ Failed: ${mapping.failed}`);
  
  // Check storage first
  await listStorageBuckets();
  
  // Update each content type
  await updateWeddings();
  await updateLocations();
  await updateBlogPosts();
  
  console.log('\n✅ Database update complete!');
}

main().catch(console.error);

