#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

const METADATA_DIR = './dz-photo-alt/metadata';

async function fixContentCategorization() {
  console.log('🔧 Fixing content categorization...');
  
  // 1. Add missing homepage
  console.log('\n🏠 Adding missing homepage...');
  await addHomepage();
  
  // 2. Move location pages from pages to locations
  console.log('\n🏰 Moving location pages to locations table...');
  await moveLocationPages();
  
  // 3. Clean up pages table
  console.log('\n🧹 Cleaning up pages table...');
  await cleanupPages();
  
  console.log('\n✅ Content categorization fixed!');
}

async function addHomepage() {
  // Check if homepage metadata exists
  const homeMetadataFiles = fs.readdirSync(METADATA_DIR)
    .filter(file => file.includes('www.dz-photo.at__metadata.json') && !file.includes('_'));
  
  let homeMetadata = null;
  if (homeMetadataFiles.length > 0) {
    const homeMetadataPath = path.join(METADATA_DIR, homeMetadataFiles[0]);
    homeMetadata = JSON.parse(fs.readFileSync(homeMetadataPath, 'utf-8'));
  }
  
  // Create homepage entry
  const { data, error } = await supabase
    .from('pages')
    .upsert({
      slug: 'home',
      title: homeMetadata?.title || 'Daniel Zangerle - Hochzeitsfotograf in Oberösterreich',
      content: 'Professionelle Hochzeitsfotografie in Oberösterreich und Umgebung. Natürliche und emotionale Bilder für euren besonderen Tag.',
      page_type: 'home',
      meta_title: homeMetadata?.title || 'Daniel Zangerle - Hochzeitsfotograf',
      meta_description: 'Professionelle Hochzeitsfotografie in Oberösterreich. Natürliche Bilder für euren besonderen Tag. Jetzt unverbindlich anfragen!',
      featured: true,
      published: true
    }, {
      onConflict: 'slug'
    });
  
  if (error) {
    console.error('❌ Error adding homepage:', error);
  } else {
    console.log('✅ Homepage added successfully');
  }
}

async function moveLocationPages() {
  const locationSlugs = [
    'heiraten-im-burnerhof',
    'heiraten-im-gut-kuehstein', 
    'heiraten-in-der-hoamat',
    'heiraten-in-tegernbach'
  ];
  
  for (const slug of locationSlugs) {
    // Get page data
    const { data: pageData } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (pageData) {
      console.log(`📍 Moving ${slug} to locations...`);
      
      // Extract location name from slug and title
      let locationName = '';
      let city = '';
      let region = 'Oberösterreich';
      
      if (slug === 'heiraten-im-burnerhof') {
        locationName = 'Burnerhof';
        city = 'Lambach';
      } else if (slug === 'heiraten-im-gut-kuehstein') {
        locationName = 'Gut Kühstein';
        city = 'Kühstein';
      } else if (slug === 'heiraten-in-der-hoamat') {
        locationName = 'Hoamat';
        city = 'Hinzenbach';
      } else if (slug === 'heiraten-in-tegernbach') {
        locationName = 'Tegernbach';
        city = 'Tegernbach';
      }
      
      // Check if location already exists
      const { data: existingLocation } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', locationName.toLowerCase())
        .single();
      
      if (!existingLocation) {
        // Create new location
        const { error: locationError } = await supabase
          .from('locations')
          .insert({
            slug: locationName.toLowerCase().replace(/\s+/g, '-'),
            name: locationName,
            description: pageData.content || `Traumhafte Hochzeitslocation ${locationName} in ${city}`,
            city: city,
            region: region,
            address: `${city}, ${region}`,
            website: null,
            phone: null,
            email: null,
            capacity_min: null,
            capacity_max: null,
            features: [],
            cover_image: null,
            images: [],
            meta_title: pageData.meta_title,
            meta_description: pageData.meta_description,
            featured: false,
            published: true
          });
        
        if (locationError) {
          console.error(`❌ Error creating location ${locationName}:`, locationError);
        } else {
          console.log(`✅ Created location: ${locationName}`);
        }
      } else {
        console.log(`ℹ️ Location ${locationName} already exists`);
      }
      
      // Delete from pages table
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('slug', slug);
      
      if (deleteError) {
        console.error(`❌ Error deleting page ${slug}:`, deleteError);
      } else {
        console.log(`✅ Deleted page: ${slug}`);
      }
    }
  }
}

async function cleanupPages() {
  // Get current pages
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, title, page_type');
  
  console.log('\n📄 Remaining pages after cleanup:');
  pages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.page_type}): ${page.title}`);
  });
  
  // Update page types for better categorization
  const pageTypeUpdates = [
    { slug: 'about', page_type: 'about' },
    { slug: 'impressum', page_type: 'legal' },
    { slug: 'datenschutzerklaerung', page_type: 'legal' },
    { slug: 'agb', page_type: 'legal' },
    { slug: 'kontakt-anfrage', page_type: 'contact' },
    { slug: 'kontaktpaar', page_type: 'contact' },
    { slug: 'engagement-shooting-info', page_type: 'services' },
    { slug: 'brautpaarshooting-tag-x', page_type: 'services' },
    { slug: 'informationen', page_type: 'general' }
  ];
  
  for (const update of pageTypeUpdates) {
    const { error } = await supabase
      .from('pages')
      .update({ page_type: update.page_type })
      .eq('slug', update.slug);
    
    if (error) {
      console.error(`❌ Error updating page type for ${update.slug}:`, error);
    }
  }
  
  console.log('✅ Page types updated');
}

async function verifyFix() {
  console.log('\n🔍 Verifying fixes...');
  
  // Check homepage
  const { data: homepage } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single();
  
  console.log('🏠 Homepage:', homepage ? '✅ Found' : '❌ Missing');
  
  // Check locations count
  const { data: locations, count: locationCount } = await supabase
    .from('locations')
    .select('slug', { count: 'exact' });
  
  console.log(`🏰 Locations: ${locationCount} total`);
  locations?.forEach(loc => console.log(`  - ${loc.slug}`));
  
  // Check pages count and types
  const { data: pages, count: pageCount } = await supabase
    .from('pages')
    .select('slug, page_type', { count: 'exact' });
  
  console.log(`📄 Pages: ${pageCount} total`);
  const pagesByType = pages?.reduce((acc: any, page) => {
    acc[page.page_type] = (acc[page.page_type] || 0) + 1;
    return acc;
  }, {});
  
  if (pagesByType) {
    Object.entries(pagesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }
}

// Run the fix
if (require.main === module) {
  fixContentCategorization()
    .then(() => verifyFix())
    .catch(console.error);
}

export { fixContentCategorization };
