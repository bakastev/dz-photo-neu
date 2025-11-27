#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function moveImagesToCorrectBuckets() {
  console.log('🔄 Moving images from "images" bucket to correct category buckets...\n');

  // Get all files from the "images" bucket using SQL query
  const { data: files, error: listError } = await supabase.rpc('get_storage_objects', {
    bucket_name: 'images'
  });

  if (listError) {
    console.log('RPC failed, trying direct SQL query...');
    
    const { data: sqlFiles, error: sqlError } = await supabase
      .from('storage.objects')
      .select('name, metadata')
      .eq('bucket_id', 'images');

    if (sqlError) {
      console.error('SQL query failed:', sqlError);
      return;
    }

    console.log(`Found ${sqlFiles?.length || 0} files via SQL\n`);

    let moved = 0;
    let failed = 0;

    for (const file of sqlFiles || []) {
      const fileName = file.name;
      
      // Skip if no file extension
      if (!fileName.includes('.')) {
        continue;
      }

      // Determine target bucket based on path
      let targetBucket = '';
      let newPath = '';

      if (fileName.startsWith('weddings/')) {
        targetBucket = 'weddings';
        newPath = fileName.replace('weddings/', '');
      } else if (fileName.startsWith('locations/')) {
        targetBucket = 'locations';
        newPath = fileName.replace('locations/', '');
      } else if (fileName.startsWith('blog/')) {
        targetBucket = 'blog';
        newPath = fileName.replace('blog/', '');
      } else if (fileName.startsWith('reviews/')) {
        targetBucket = 'blog'; // Reviews images go to blog bucket
        newPath = fileName.replace('reviews/', '');
      } else if (fileName.startsWith('pages/')) {
        targetBucket = 'blog'; // Pages images go to blog bucket  
        newPath = fileName.replace('pages/', '');
      } else {
        console.log(`⚠️ Skipping unknown category: ${fileName}`);
        continue;
      }

      console.log(`📤 Moving ${fileName} → ${targetBucket}/${newPath}`);

      try {
        // Download from images bucket
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('images')
          .download(fileName);

        if (downloadError) {
          console.log(`  ❌ Download failed: ${downloadError.message}`);
          failed++;
          continue;
        }

        // Upload to target bucket
        const { error: uploadError } = await supabase.storage
          .from(targetBucket)
          .upload(newPath, fileData, {
            contentType: file.metadata?.mimetype || 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.log(`  ❌ Upload failed: ${uploadError.message}`);
          failed++;
          continue;
        }

        // Delete from images bucket
        const { error: deleteError } = await supabase.storage
          .from('images')
          .remove([fileName]);

        if (deleteError) {
          console.log(`  ⚠️ Delete failed (but file was copied): ${deleteError.message}`);
        }

        console.log(`  ✅ Successfully moved`);
        moved++;

      } catch (error) {
        console.log(`  💥 Exception: ${error}`);
        failed++;
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log(`\n🎯 RESULTS:`);
    console.log(`  ✅ Moved: ${moved}`);
    console.log(`  ❌ Failed: ${failed}`);

    // Verify final state
    console.log('\n🔍 Final bucket verification:');
    const buckets = ['weddings', 'locations', 'blog', 'fotobox'];
    
    for (const bucket of buckets) {
      const { data: bucketFiles, error } = await supabase.storage.from(bucket).list('');
      if (error) {
        console.log(`❌ Error checking ${bucket}: ${error.message}`);
      } else {
        console.log(`📁 ${bucket}: ${bucketFiles?.length || 0} files`);
      }
    }

    console.log('\n🎉 Image reorganization completed!');
  }
}

moveImagesToCorrectBuckets().catch(console.error);
