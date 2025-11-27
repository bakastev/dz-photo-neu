#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function debugImageMapping() {
  console.log('🔍 Debugging Image Mapping...\n');

  // 1. Check scraped data for location images
  const scrapedDir = path.join(process.cwd(), 'dz-photo-alt', 'metadata');
  const files = fs.readdirSync(scrapedDir).filter(f => f.endsWith('.json'));
  
  console.log(`📁 Found ${files.length} scraped files`);
  
  // Look for location-related files
  const locationFiles = files.filter(f => 
    f.includes('location') || 
    f.includes('vedahof') || 
    f.includes('ganglbauer') ||
    f.includes('burnerhof') ||
    f.includes('hoamat') ||
    f.includes('stadler')
  );
  
  console.log(`📍 Location files found: ${locationFiles.length}`);
  locationFiles.forEach(f => console.log(`  - ${f}`));
  
  // 2. Check a few location files for images
  if (locationFiles.length > 0) {
    const sampleFile = locationFiles[0];
    const filePath = path.join(scrapedDir, sampleFile);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    console.log(`\n📄 Sample file: ${sampleFile}`);
    console.log('Images found:');
    
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img: any, i: number) => {
        console.log(`  ${i + 1}. ${img.src || img.url || img}`);
      });
    } else {
      console.log('  No images array found');
      console.log('  Available keys:', Object.keys(data));
    }
  }
  
  // 3. Check current database state
  console.log('\n🗄️ Current database state:');
  
  const { data: weddings } = await supabase
    .from('weddings')
    .select('couple_names, cover_image')
    .not('cover_image', 'is', null)
    .limit(3);
    
  console.log(`Weddings with images: ${weddings?.length || 0}`);
  weddings?.forEach(w => console.log(`  - ${w.couple_names}: ${w.cover_image}`));
  
  const { data: locations } = await supabase
    .from('locations')
    .select('name, cover_image')
    .not('cover_image', 'is', null)
    .limit(3);
    
  console.log(`Locations with images: ${locations?.length || 0}`);
  locations?.forEach(l => console.log(`  - ${l.name}: ${l.cover_image}`));
  
  // 4. Check if images were downloaded
  const downloadsDir = path.join(process.cwd(), 'downloads', 'images');
  if (fs.existsSync(downloadsDir)) {
    const downloadedImages = fs.readdirSync(downloadsDir);
    console.log(`\n📥 Downloaded images: ${downloadedImages.length}`);
    
    // Show first few
    downloadedImages.slice(0, 5).forEach(img => console.log(`  - ${img}`));
    if (downloadedImages.length > 5) {
      console.log(`  ... and ${downloadedImages.length - 5} more`);
    }
  } else {
    console.log('\n📥 No downloads/images directory found');
  }
  
  console.log('\n✅ Debug completed!');
}

debugImageMapping().catch(console.error);
