#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client with service role for uploads
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function uploadImagesToSupabase() {
  console.log('📤 Uploading images to Supabase Storage...\n');

  const downloadsDir = path.join(process.cwd(), 'downloads', 'images');
  const categories = ['weddings', 'locations', 'blog', 'reviews', 'pages'];

  for (const category of categories) {
    const categoryDir = path.join(downloadsDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️ Directory not found: ${category}`);
      continue;
    }

    const files = fs.readdirSync(categoryDir).filter(f => 
      f.toLowerCase().endsWith('.jpg') || 
      f.toLowerCase().endsWith('.jpeg') || 
      f.toLowerCase().endsWith('.png')
    );

    console.log(`📁 ${category}: ${files.length} images`);

    let uploaded = 0;
    let skipped = 0;

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const supabasePath = `${category}/${file}`;

      try {
        // Check if file already exists
        const { data: existingFile } = await supabase.storage
          .from('images')
          .list(category, { search: file });

        if (existingFile && existingFile.length > 0) {
          console.log(`  ⏭️ Skipping existing: ${file}`);
          skipped++;
          continue;
        }

        // Read and upload file
        const fileBuffer = fs.readFileSync(filePath);
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(supabasePath, fileBuffer, {
            contentType: file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
            upsert: false
          });

        if (error) {
          console.log(`  ❌ Error uploading ${file}:`, error.message);
        } else {
          console.log(`  ✅ Uploaded: ${file}`);
          uploaded++;
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.log(`  💥 Exception uploading ${file}:`, err);
      }
    }

    console.log(`  📊 ${category}: ${uploaded} uploaded, ${skipped} skipped\n`);
  }

  console.log('🎉 Upload completed!');
}

uploadImagesToSupabase().catch(console.error);
