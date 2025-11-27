#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Use anon key with proper policies
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function forceUploadImages() {
  console.log('💪 FORCE uploading images with service role...\n');

  // Critical images
  const images = [
    { file: 'IMG_7982-300x200.jpg', category: 'weddings' },
    { file: 'DDZ_0023-1-400x284.jpg', category: 'locations' },
    { file: 'DDZ_0039-1-400x284.jpg', category: 'locations' },
    { file: 'DDZ_0062-400x284.jpg', category: 'locations' },
  ];

  for (const { file, category } of images) {
    console.log(`🚀 Force uploading ${file}...`);
    
    const localPath = path.join(process.cwd(), 'downloads', 'images', category, file);
    
    if (!fs.existsSync(localPath)) {
      console.log(`  ❌ File not found: ${localPath}`);
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(localPath);
      const supabasePath = `${category}/${file}`;

      console.log(`  📏 File size: ${fileBuffer.length} bytes`);
      
      // Force upload with service role
      const { data, error } = await supabase.storage
        .from('images')
        .upload(supabasePath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.log(`  ❌ Upload error: ${error.message}`);
        console.log(`  🔍 Error details:`, error);
      } else {
        console.log(`  ✅ SUCCESS: ${data.path}`);
        
        // Test public URL
        const { data: publicUrl } = supabase.storage
          .from('images')
          .getPublicUrl(supabasePath);
        
        console.log(`  🔗 URL: ${publicUrl.publicUrl}`);
      }

    } catch (err) {
      console.log(`  💥 Exception: ${err}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Verify storage contents
  console.log('\n🔍 Checking storage contents...');
  
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.log('❌ Error listing buckets:', bucketsError.message);
  } else {
    console.log('📦 Available buckets:', buckets?.map(b => b.name).join(', '));
  }

  const { data: files, error: filesError } = await supabase.storage.from('images').list('weddings');
  if (filesError) {
    console.log('❌ Error listing files:', filesError.message);
  } else {
    console.log(`📁 Files in weddings: ${files?.length || 0}`);
    files?.forEach(file => console.log(`  - ${file.name} (${file.metadata?.size || 'unknown'} bytes)`));
  }

  const { data: locationFiles, error: locationError } = await supabase.storage.from('images').list('locations');
  if (locationError) {
    console.log('❌ Error listing location files:', locationError.message);
  } else {
    console.log(`📁 Files in locations: ${locationFiles?.length || 0}`);
    locationFiles?.slice(0, 3).forEach(file => console.log(`  - ${file.name}`));
  }

  console.log('\n🎯 Force upload completed!');
}

forceUploadImages().catch(console.error);
