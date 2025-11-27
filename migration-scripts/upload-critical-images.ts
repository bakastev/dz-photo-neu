#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client with correct credentials
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function uploadCriticalImages() {
  console.log('🚀 Uploading CRITICAL images to Supabase Storage...\n');

  // Critical images that are referenced in the database
  const criticalImages = [
    { file: 'IMG_7982-300x200.jpg', category: 'weddings' },
    { file: 'DDZ_0106-1.jpg', category: 'weddings' },
    { file: 'DDZ_0039.jpg', category: 'weddings' },
    { file: 'DDZ_0023-1-400x284.jpg', category: 'locations' },
    { file: 'DDZ_0039-1-400x284.jpg', category: 'locations' },
    { file: 'DDZ_0062-400x284.jpg', category: 'locations' },
    { file: 'DDZ_0081-400x284.jpg', category: 'locations' },
    { file: 'DDZ_0082-400x284.jpg', category: 'locations' }
  ];

  let uploaded = 0;
  let failed = 0;

  for (const { file, category } of criticalImages) {
    console.log(`📤 Uploading ${file} to ${category}...`);
    
    const localPath = path.join(process.cwd(), 'downloads', 'images', category, file);
    
    if (!fs.existsSync(localPath)) {
      console.log(`  ❌ File not found: ${localPath}`);
      failed++;
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(localPath);
      const supabasePath = `${category}/${file}`;

      // Delete existing file first (if any)
      await supabase.storage.from('images').remove([supabasePath]);

      // Upload new file
      const { data, error } = await supabase.storage
        .from('images')
        .upload(supabasePath, fileBuffer, {
          contentType: file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.log(`  ❌ Upload failed: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ Uploaded successfully: ${data.path}`);
        
        // Test public URL
        const { data: publicUrl } = supabase.storage
          .from('images')
          .getPublicUrl(supabasePath);
        
        console.log(`  🔗 Public URL: ${publicUrl.publicUrl}`);
        uploaded++;
      }

    } catch (err) {
      console.log(`  💥 Exception: ${err}`);
      failed++;
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Results: ${uploaded} uploaded, ${failed} failed`);

  // Verify uploads
  console.log('\n🔍 Verifying uploads...');
  const { data: files, error } = await supabase.storage.from('images').list('weddings');
  
  if (error) {
    console.log('❌ Error listing files:', error.message);
  } else {
    console.log(`✅ Files in weddings bucket: ${files?.length || 0}`);
    files?.slice(0, 5).forEach(file => console.log(`  - ${file.name}`));
  }

  console.log('\n🎉 Critical image upload completed!');
}

uploadCriticalImages().catch(console.error);
