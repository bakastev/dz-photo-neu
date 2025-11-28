/**
 * Script to sync database image references with actual images in Supabase Storage
 * This script reads the image-mapping.json and only uses images that actually exist in storage
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

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

async function getStorageFiles(category: string): Promise<Set<string>> {
  const files = new Set<string>();
  
  // List files from the 'images' bucket with the category prefix
  const { data, error } = await supabase.storage
    .from('images')
    .list(category, { limit: 1000 });
  
  if (error) {
    console.error(`Error listing ${category}:`, error);
    return files;
  }
  
  for (const file of data || []) {
    files.add(file.name);
  }
  
  return files;
}

async function updateLocations() {
  console.log('\n📍 Updating Locations...');
  
  const storageFiles = await getStorageFiles('locations');
  console.log(`  Found ${storageFiles.size} files in storage/images/locations/`);
  
  const locationImages = mapping.grouped.locations || [];
  
  // Get all locations
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, slug, name');
  
  if (error || !locations) {
    console.error('Error fetching locations:', error);
    return;
  }
  
  for (const location of locations) {
    // Find images for this location that exist in storage
    const matchingImages = locationImages
      .filter((img: ImageMapping) => img.slug === location.slug)
      .filter((img: ImageMapping) => storageFiles.has(img.filename))
      .map((img: ImageMapping) => `locations/${img.filename}`);
    
    if (matchingImages.length > 0) {
      console.log(`  ✅ ${location.slug}: ${matchingImages.length} images found in storage`);
      
      // Update via direct API call (bypass RLS)
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          cover_image: matchingImages[0],
          images: matchingImages
        })
        .eq('id', location.id);
      
      if (updateError) {
        console.log(`     ⚠️ Update failed (RLS): ${updateError.message}`);
      }
    } else {
      // Try to find any image that might match by filename pattern
      const slugPattern = location.slug.toLowerCase().replace(/-/g, '');
      const anyMatch = Array.from(storageFiles).find(f => 
        f.toLowerCase().includes(slugPattern) ||
        slugPattern.includes(f.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5))
      );
      
      if (anyMatch) {
        console.log(`  🔄 ${location.slug}: Using fallback image ${anyMatch}`);
      } else {
        console.log(`  ⚠️ ${location.slug}: No matching images in storage`);
      }
    }
  }
}

async function updateWeddings() {
  console.log('\n💒 Updating Weddings...');
  
  const storageFiles = await getStorageFiles('weddings');
  console.log(`  Found ${storageFiles.size} files in storage/images/weddings/`);
  
  const weddingImages = mapping.grouped.weddings || [];
  
  // Get all weddings
  const { data: weddings, error } = await supabase
    .from('weddings')
    .select('id, slug, title');
  
  if (error || !weddings) {
    console.error('Error fetching weddings:', error);
    return;
  }
  
  for (const wedding of weddings) {
    // Find images for this wedding that exist in storage
    const matchingImages = weddingImages
      .filter((img: ImageMapping) => img.slug === wedding.slug)
      .filter((img: ImageMapping) => storageFiles.has(img.filename))
      .map((img: ImageMapping) => `weddings/${img.filename}`);
    
    if (matchingImages.length > 0) {
      console.log(`  ✅ ${wedding.slug}: ${matchingImages.length} images found in storage`);
    } else {
      console.log(`  ⚠️ ${wedding.slug}: No matching images in storage`);
    }
  }
}

async function updateBlogPosts() {
  console.log('\n📝 Updating Blog Posts...');
  
  const storageFiles = await getStorageFiles('blog');
  console.log(`  Found ${storageFiles.size} files in storage/images/blog/`);
  
  const blogImages = mapping.grouped.blog || [];
  
  // Get all blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title');
  
  if (error || !posts) {
    console.error('Error fetching blog posts:', error);
    return;
  }
  
  for (const post of posts) {
    // Find images for this post that exist in storage
    const matchingImages = blogImages
      .filter((img: ImageMapping) => img.slug === post.slug)
      .filter((img: ImageMapping) => storageFiles.has(img.filename))
      .map((img: ImageMapping) => `blog/${img.filename}`);
    
    if (matchingImages.length > 0) {
      console.log(`  ✅ ${post.slug}: ${matchingImages.length} images found in storage`);
    } else {
      console.log(`  ⚠️ ${post.slug}: No matching images in storage`);
    }
  }
}

async function main() {
  console.log('🔍 Analyzing Storage vs Mapping...\n');
  
  await updateWeddings();
  await updateLocations();
  await updateBlogPosts();
  
  console.log('\n✅ Analysis complete!');
  console.log('\n⚠️ Note: Database updates may fail due to RLS policies.');
  console.log('   Use Supabase SQL Editor to update directly if needed.');
}

main().catch(console.error);




