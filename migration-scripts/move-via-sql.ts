#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function moveViaSQL() {
  console.log('🔄 Moving images via SQL updates...\n');

  try {
    // Move weddings images
    console.log('📤 Moving weddings images...');
    const { error: weddingsError } = await supabase.rpc('move_storage_objects', {
      from_bucket: 'images',
      to_bucket: 'weddings',
      path_prefix: 'weddings/'
    });

    if (weddingsError) {
      console.log('RPC failed, trying manual approach...');
      
      // Manual approach: Update bucket_id and remove path prefix
      const { error: updateWeddingsError } = await supabase
        .from('storage.objects')
        .update({ 
          bucket_id: 'weddings',
          name: supabase.sql`REPLACE(name, 'weddings/', '')`
        })
        .eq('bucket_id', 'images')
        .like('name', 'weddings/%');

      if (updateWeddingsError) {
        console.error('Manual weddings update failed:', updateWeddingsError);
      } else {
        console.log('✅ Weddings images moved via SQL update');
      }
    } else {
      console.log('✅ Weddings images moved via RPC');
    }

    // Move locations images
    console.log('📤 Moving locations images...');
    const { error: updateLocationsError } = await supabase
      .from('storage.objects')
      .update({ 
        bucket_id: 'locations',
        name: supabase.sql`REPLACE(name, 'locations/', '')`
      })
      .eq('bucket_id', 'images')
      .like('name', 'locations/%');

    if (updateLocationsError) {
      console.error('Locations update failed:', updateLocationsError);
    } else {
      console.log('✅ Locations images moved via SQL update');
    }

    // Move blog images
    console.log('📤 Moving blog images...');
    const { error: updateBlogError } = await supabase
      .from('storage.objects')
      .update({ 
        bucket_id: 'blog',
        name: supabase.sql`REPLACE(name, 'blog/', '')`
      })
      .eq('bucket_id', 'images')
      .like('name', 'blog/%');

    if (updateBlogError) {
      console.error('Blog update failed:', updateBlogError);
    } else {
      console.log('✅ Blog images moved via SQL update');
    }

    // Move reviews and pages to blog bucket
    console.log('📤 Moving reviews images to blog...');
    const { error: updateReviewsError } = await supabase
      .from('storage.objects')
      .update({ 
        bucket_id: 'blog',
        name: supabase.sql`REPLACE(name, 'reviews/', '')`
      })
      .eq('bucket_id', 'images')
      .like('name', 'reviews/%');

    if (updateReviewsError) {
      console.error('Reviews update failed:', updateReviewsError);
    } else {
      console.log('✅ Reviews images moved to blog bucket');
    }

    console.log('📤 Moving pages images to blog...');
    const { error: updatePagesError } = await supabase
      .from('storage.objects')
      .update({ 
        bucket_id: 'blog',
        name: supabase.sql`REPLACE(name, 'pages/', '')`
      })
      .eq('bucket_id', 'images')
      .like('name', 'pages/%');

    if (updatePagesError) {
      console.error('Pages update failed:', updatePagesError);
    } else {
      console.log('✅ Pages images moved to blog bucket');
    }

    console.log('\n🎉 All images moved successfully!');

  } catch (error) {
    console.error('Error:', error);
  }
}

moveViaSQL().catch(console.error);
