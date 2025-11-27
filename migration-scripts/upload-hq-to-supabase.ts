#!/usr/bin/env npx tsx
/**
 * Script 3: Upload high-quality images to Supabase Storage
 * and update database with correct paths
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Use anon key - buckets are public
const supabaseUrl = 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

// Try service role key from env, fallback to anon
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

const supabase = createClient(supabaseUrl, supabaseKey);

const HQ_IMAGES_DIR = path.join(process.cwd(), 'downloads', 'images-hq');
const BUCKET_NAME = 'images';

interface UploadResult {
  localPath: string;
  storagePath: string;
  success: boolean;
  error?: string;
}

interface SlugImages {
  slug: string;
  contentType: string;
  images: string[];
  coverImage: string;
}

async function uploadFile(localPath: string, storagePath: string): Promise<UploadResult> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const contentType = localPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (error) {
      return { localPath, storagePath, success: false, error: error.message };
    }
    
    return { localPath, storagePath, success: true };
  } catch (err: any) {
    return { localPath, storagePath, success: false, error: err.message };
  }
}

async function uploadFolder(contentType: string, folderPath: string): Promise<Map<string, SlugImages>> {
  const results = new Map<string, SlugImages>();
  
  if (!fs.existsSync(folderPath)) {
    console.log(`  ⚠️ Folder not found: ${folderPath}`);
    return results;
  }
  
  const items = fs.readdirSync(folderPath);
  
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // This is a slug folder (e.g., location/feichthub/)
      const slug = item;
      const images: string[] = [];
      
      const files = fs.readdirSync(itemPath).filter(f => 
        f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
      );
      
      console.log(`    📁 ${slug}: ${files.length} images`);
      
      for (const file of files) {
        const localPath = path.join(itemPath, file);
        const storagePath = `${contentType}/${slug}/${file}`;
        
        const result = await uploadFile(localPath, storagePath);
        if (result.success) {
          images.push(storagePath);
        } else {
          console.log(`      ❌ Failed: ${file} - ${result.error}`);
        }
      }
      
      if (images.length > 0) {
        results.set(slug, {
          slug,
          contentType,
          images,
          coverImage: images[0]
        });
      }
    } else if (stat.isFile() && (item.endsWith('.jpg') || item.endsWith('.jpeg') || item.endsWith('.png'))) {
      // Direct file in content type folder (no slug subfolder)
      const storagePath = `${contentType}/${item}`;
      const result = await uploadFile(itemPath, storagePath);
      
      if (!result.success) {
        console.log(`    ❌ Failed: ${item} - ${result.error}`);
      }
    }
  }
  
  return results;
}

async function updateDatabase(contentType: string, slugImages: Map<string, SlugImages>) {
  console.log(`\n  📝 Updating ${contentType} database entries...`);
  
  const tableName = contentType === 'location' ? 'locations' : 
                    contentType === 'wedding' ? 'weddings' : 
                    contentType === 'blog' ? 'blog_posts' :
                    contentType === 'fotobox' ? 'fotobox_services' : null;
  
  if (!tableName) {
    console.log(`    ⚠️ Unknown content type: ${contentType}`);
    return;
  }
  
  for (const [slug, data] of slugImages) {
    const imageArray = data.images.map(img => `${img}`);
    
    const { error } = await supabase
      .from(tableName)
      .update({
        cover_image: data.coverImage,
        images: imageArray
      })
      .eq('slug', slug);
    
    if (error) {
      console.log(`    ❌ Failed to update ${slug}: ${error.message}`);
    } else {
      console.log(`    ✅ Updated ${slug}: ${data.images.length} images`);
    }
  }
}

async function main() {
  console.log('🚀 Uploading high-quality images to Supabase Storage...\n');
  
  const contentTypes = ['location', 'wedding', 'fotobox', 'blog'];
  const allResults = new Map<string, Map<string, SlugImages>>();
  
  for (const contentType of contentTypes) {
    const folderPath = path.join(HQ_IMAGES_DIR, contentType);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️ Skipping ${contentType} - folder not found`);
      continue;
    }
    
    console.log(`\n📂 Processing ${contentType.toUpperCase()}...`);
    
    const results = await uploadFolder(contentType, folderPath);
    allResults.set(contentType, results);
    
    // Update database
    if (results.size > 0) {
      await updateDatabase(contentType, results);
    }
  }
  
  // Also handle "other" folder - upload to root of bucket
  const otherPath = path.join(HQ_IMAGES_DIR, 'other');
  if (fs.existsSync(otherPath)) {
    console.log(`\n📂 Processing OTHER images...`);
    const files = fs.readdirSync(otherPath).filter(f => 
      f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
    );
    
    let uploaded = 0;
    for (const file of files) {
      const localPath = path.join(otherPath, file);
      const storagePath = `other/${file}`;
      const result = await uploadFile(localPath, storagePath);
      if (result.success) uploaded++;
    }
    console.log(`  ✅ Uploaded ${uploaded}/${files.length} other images`);
  }
  
  // Summary
  console.log('\n📊 UPLOAD SUMMARY\n');
  
  let totalImages = 0;
  let totalSlugs = 0;
  
  for (const [contentType, slugMap] of allResults) {
    const slugCount = slugMap.size;
    const imageCount = Array.from(slugMap.values()).reduce((sum, s) => sum + s.images.length, 0);
    
    totalSlugs += slugCount;
    totalImages += imageCount;
    
    console.log(`${contentType}: ${slugCount} slugs, ${imageCount} images`);
  }
  
  console.log(`\n✅ Total: ${totalSlugs} content items, ${totalImages} images uploaded`);
}

main().catch(console.error);

