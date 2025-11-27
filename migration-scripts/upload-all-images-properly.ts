#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function uploadAllImages() {
  console.log('🚀 Uploading ALL images to Supabase Storage properly...\n');

  const downloadsDir = path.join(process.cwd(), 'downloads', 'images');
  const categories = ['weddings', 'locations', 'blog', 'reviews', 'pages'];

  let totalUploaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const category of categories) {
    const categoryDir = path.join(downloadsDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️ Directory not found: ${category}`);
      continue;
    }

    const files = fs.readdirSync(categoryDir).filter(f => 
      f.toLowerCase().endsWith('.jpg') || 
      f.toLowerCase().endsWith('.jpeg') || 
      f.toLowerCase().endsWith('.png') ||
      f.toLowerCase().endsWith('.gif') ||
      f.toLowerCase().endsWith('.webp')
    );

    console.log(`📁 ${category.toUpperCase()}: ${files.length} images to upload`);

    let categoryUploaded = 0;
    let categoryFailed = 0;
    let categorySkipped = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(categoryDir, file);
      const supabasePath = `${category}/${file}`;

      try {
        // Check if file already exists
        const { data: existingFile } = await supabase.storage
          .from('images')
          .list(category, { search: file });

        if (existingFile && existingFile.length > 0) {
          console.log(`  ⏭️ [${i+1}/${files.length}] Skipping existing: ${file}`);
          categorySkipped++;
          continue;
        }

        // Read and upload file
        const fileBuffer = fs.readFileSync(filePath);
        const fileSize = fileBuffer.length;
        
        console.log(`  📤 [${i+1}/${files.length}] Uploading ${file} (${Math.round(fileSize/1024)}KB)...`);
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(supabasePath, fileBuffer, {
            contentType: getContentType(file),
            upsert: false
          });

        if (error) {
          console.log(`    ❌ Failed: ${error.message}`);
          categoryFailed++;
        } else {
          console.log(`    ✅ Success: ${data.path}`);
          categoryUploaded++;
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (err) {
        console.log(`    💥 Exception: ${err}`);
        categoryFailed++;
      }
    }

    console.log(`  📊 ${category}: ${categoryUploaded} uploaded, ${categorySkipped} skipped, ${categoryFailed} failed\n`);
    
    totalUploaded += categoryUploaded;
    totalSkipped += categorySkipped;
    totalFailed += categoryFailed;
  }

  console.log(`🎯 TOTAL RESULTS:`);
  console.log(`  ✅ Uploaded: ${totalUploaded}`);
  console.log(`  ⏭️ Skipped: ${totalSkipped}`);
  console.log(`  ❌ Failed: ${totalFailed}`);

  // Final verification
  console.log('\n🔍 Final Storage Verification:');
  for (const category of categories) {
    const { data: files, error } = await supabase.storage.from('images').list(category);
    if (error) {
      console.log(`❌ Error listing ${category}: ${error.message}`);
    } else {
      console.log(`📁 ${category}: ${files?.length || 0} files`);
    }
  }

  console.log('\n🎉 ALL IMAGES UPLOAD COMPLETED!');
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    case '.jpg':
    case '.jpeg':
    default: return 'image/jpeg';
  }
}

uploadAllImages().catch(console.error);
