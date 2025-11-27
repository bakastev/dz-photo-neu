#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function fixLocationImages() {
  console.log('🖼️ Fixing Location Images...\n');

  // 1. Get all locations from database
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, name, slug, cover_image, images');

  if (error) {
    console.error('Error fetching locations:', error);
    return;
  }

  console.log(`📍 Found ${locations?.length || 0} locations in database`);

  // 2. Map location names to downloaded images
  const downloadsDir = path.join(process.cwd(), 'downloads', 'images', 'locations');
  const downloadedImages = fs.readdirSync(downloadsDir);
  
  console.log(`📥 Found ${downloadedImages.length} downloaded location images`);

  // 3. Process each location
  for (const location of locations || []) {
    console.log(`\n🏛️ Processing: ${location.name}`);
    
    if (location.cover_image) {
      console.log(`  ✅ Already has cover image: ${location.cover_image}`);
      continue;
    }

    // Find matching images by location name
    const locationSlug = location.slug || location.name.toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const replacements: { [key: string]: string } = {
          'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'
        };
        return replacements[match] || match;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Look for images that match the location
    const matchingImages = downloadedImages.filter(img => {
      const imgName = img.toLowerCase();
      const locationName = location.name.toLowerCase();
      
      return imgName.includes(locationSlug) || 
             imgName.includes(locationName.replace(/\s+/g, '')) ||
             imgName.includes(locationName.replace(/\s+/g, '-'));
    });

    console.log(`  🔍 Found ${matchingImages.length} matching images`);
    
    if (matchingImages.length > 0) {
      // Use first image as cover, all as gallery
      const coverImage = `downloads/images/locations/${matchingImages[0]}`;
      const imageGallery = matchingImages.map((img, index) => ({
        url: `downloads/images/locations/${img}`,
        alt: `${location.name} - Bild ${index + 1}`,
        order: index
      }));

      // Update database
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          cover_image: coverImage,
          images: imageGallery
        })
        .eq('id', location.id);

      if (updateError) {
        console.log(`  ❌ Error updating ${location.name}:`, updateError.message);
      } else {
        console.log(`  ✅ Updated ${location.name} with ${imageGallery.length} images`);
        console.log(`     Cover: ${coverImage}`);
      }
    } else {
      console.log(`  ⚠️ No matching images found for ${location.name}`);
      
      // Use a generic location image if available
      const genericImages = downloadedImages.filter(img => 
        img.includes('location') || img.includes('venue') || img.includes('hochzeit')
      );
      
      if (genericImages.length > 0) {
        const coverImage = `downloads/images/locations/${genericImages[0]}`;
        
        const { error: updateError } = await supabase
          .from('locations')
          .update({
            cover_image: coverImage,
            images: [{
              url: coverImage,
              alt: `${location.name} - Hochzeitslocation`,
              order: 0
            }]
          })
          .eq('id', location.id);

        if (!updateError) {
          console.log(`  ✅ Used generic image: ${coverImage}`);
        }
      }
    }
  }

  // 4. Verify results
  console.log('\n📊 Final verification:');
  const { data: updatedLocations } = await supabase
    .from('locations')
    .select('name, cover_image')
    .not('cover_image', 'is', null);

  console.log(`✅ Locations with images: ${updatedLocations?.length || 0}`);
  updatedLocations?.forEach(loc => {
    console.log(`  - ${loc.name}: ${loc.cover_image}`);
  });

  console.log('\n🎉 Location image mapping completed!');
}

fixLocationImages().catch(console.error);
