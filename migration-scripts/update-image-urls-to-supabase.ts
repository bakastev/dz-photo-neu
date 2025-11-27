#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

function convertToSupabaseUrl(originalUrl: string): string {
  if (!originalUrl || !originalUrl.includes('dz-photo.at')) {
    return originalUrl;
  }
  
  // Extract filename from WordPress URL
  const filename = originalUrl.split('/').pop();
  if (!filename) return originalUrl;
  
  // Determine category based on current usage patterns
  let category = 'weddings'; // default
  
  // Map to Supabase Storage URL
  return `https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/${category}/${filename}`;
}

async function updateImageUrls() {
  console.log('🔄 Updating image URLs to Supabase Storage...\n');

  // 1. Update weddings
  console.log('💒 Updating wedding images...');
  const { data: weddings, error: weddingsError } = await supabase
    .from('weddings')
    .select('id, couple_names, cover_image, images')
    .not('cover_image', 'is', null);

  if (weddingsError) {
    console.log('❌ Error fetching weddings:', weddingsError.message);
  } else {
    console.log(`Found ${weddings?.length || 0} weddings with images`);
    
    for (const wedding of weddings || []) {
      let updated = false;
      let newCoverImage = wedding.cover_image;
      let newImages = wedding.images;

      // Update cover image
      if (wedding.cover_image && wedding.cover_image.includes('dz-photo.at')) {
        const filename = wedding.cover_image.split('/').pop();
        newCoverImage = `https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/weddings/${filename}`;
        updated = true;
      }

      // Update images array
      if (wedding.images && Array.isArray(wedding.images)) {
        newImages = wedding.images.map((img: any) => {
          if (img.url && img.url.includes('dz-photo.at')) {
            const filename = img.url.split('/').pop();
            return {
              ...img,
              url: `https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/weddings/${filename}`
            };
          }
          return img;
        });
        updated = true;
      }

      if (updated) {
        const { error: updateError } = await supabase
          .from('weddings')
          .update({
            cover_image: newCoverImage,
            images: newImages
          })
          .eq('id', wedding.id);

        if (updateError) {
          console.log(`  ❌ Error updating ${wedding.couple_names}:`, updateError.message);
        } else {
          console.log(`  ✅ Updated ${wedding.couple_names}`);
        }
      }
    }
  }

  // 2. Update locations with generic images
  console.log('\n📍 Updating location images...');
  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('id, name, cover_image, images');

  if (locationsError) {
    console.log('❌ Error fetching locations:', locationsError.message);
  } else {
    console.log(`Found ${locations?.length || 0} locations`);
    
    // Get list of available location images
    const locationImagesDir = path.join(process.cwd(), 'downloads', 'images', 'locations');
    const availableImages = fs.readdirSync(locationImagesDir).filter(f => 
      f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')
    );
    
    console.log(`Available location images: ${availableImages.length}`);
    
    let imageIndex = 0;
    for (const location of locations || []) {
      if (!location.cover_image) {
        // Assign a rotating image from available images
        const selectedImage = availableImages[imageIndex % availableImages.length];
        const supabaseUrl = `https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/locations/${selectedImage}`;
        
        const { error: updateError } = await supabase
          .from('locations')
          .update({
            cover_image: supabaseUrl,
            images: [{
              url: supabaseUrl,
              alt: `${location.name} - Hochzeitslocation`,
              order: 0
            }]
          })
          .eq('id', location.id);

        if (updateError) {
          console.log(`  ❌ Error updating ${location.name}:`, updateError.message);
        } else {
          console.log(`  ✅ Updated ${location.name} with ${selectedImage}`);
        }
        
        imageIndex++;
      } else {
        console.log(`  ⏭️ ${location.name} already has image`);
      }
    }
  }

  // 3. Update blog posts
  console.log('\n📝 Updating blog post images...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('id, title, featured_image, images')
    .not('featured_image', 'is', null);

  if (blogError) {
    console.log('❌ Error fetching blog posts:', blogError.message);
  } else {
    console.log(`Found ${blogPosts?.length || 0} blog posts with images`);
    
    for (const post of blogPosts || []) {
      let updated = false;
      let newFeaturedImage = post.featured_image;
      let newImages = post.images;

      // Update featured image
      if (post.featured_image && post.featured_image.includes('dz-photo.at')) {
        const filename = post.featured_image.split('/').pop();
        newFeaturedImage = `https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/blog/${filename}`;
        updated = true;
      }

      if (updated) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            featured_image: newFeaturedImage,
            images: newImages
          })
          .eq('id', post.id);

        if (updateError) {
          console.log(`  ❌ Error updating ${post.title}:`, updateError.message);
        } else {
          console.log(`  ✅ Updated ${post.title}`);
        }
      }
    }
  }

  console.log('\n🎉 Image URL updates completed!');
  
  // 4. Verify results
  console.log('\n📊 Verification:');
  const { data: updatedWeddings } = await supabase
    .from('weddings')
    .select('couple_names, cover_image')
    .like('cover_image', '%supabase.co%')
    .limit(3);
    
  console.log('Weddings with Supabase URLs:', updatedWeddings?.length || 0);
  updatedWeddings?.forEach(w => console.log(`  - ${w.couple_names}`));
  
  const { data: updatedLocations } = await supabase
    .from('locations')
    .select('name, cover_image')
    .like('cover_image', '%supabase.co%')
    .limit(3);
    
  console.log('Locations with Supabase URLs:', updatedLocations?.length || 0);
  updatedLocations?.forEach(l => console.log(`  - ${l.name}`));
}

updateImageUrls().catch(console.error);
