#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function updateDatabaseWithCorrectImages() {
  console.log('🔄 Updating database with correct image mappings...');
  
  // Load image mapping
  const imageMappingPath = path.join(__dirname, '../image-mapping.json');
  const imageMapping = JSON.parse(fs.readFileSync(imageMappingPath, 'utf-8'));
  
  // Load analysis results for correct slug mapping
  const analysisPath = path.join(__dirname, '../analysis-results.json');
  const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
  
  // Update weddings with actual images
  console.log('\n🤵👰 Updating weddings with images...');
  for (const wedding of analysis.grouped.weddings) {
    // Find images for this wedding by matching slug patterns
    const weddingImages = imageMapping.allImages.filter((img: any) => 
      img.contentType === 'wedding' || 
      img.htmlFile.includes(wedding.slug) ||
      img.htmlFile.includes('hochzeit')
    );
    
    if (weddingImages.length > 0) {
      const imageData = weddingImages.map((img: any, idx: number) => ({
        url: img.url,
        alt: img.alt || `Hochzeitsfoto ${idx + 1} von ${wedding.slug}`,
        order: idx
      }));
      
      const { error } = await supabase
        .from('weddings')
        .update({
          cover_image: weddingImages[0].url,
          images: imageData
        })
        .eq('slug', wedding.slug);
      
      if (error) {
        console.error(`❌ Error updating wedding ${wedding.slug}:`, error);
      } else {
        console.log(`✅ Updated wedding ${wedding.slug} with ${weddingImages.length} images`);
      }
    }
  }
  
  // Update locations with actual images  
  console.log('\n🏰 Updating locations with images...');
  for (const location of analysis.grouped.locations) {
    // Find images for this location
    const locationImages = imageMapping.allImages.filter((img: any) => 
      img.contentType === 'location' || 
      img.htmlFile.includes(location.slug) ||
      img.htmlFile.includes('locations')
    );
    
    if (locationImages.length > 0) {
      const imageData = locationImages.map((img: any, idx: number) => ({
        url: img.url,
        alt: img.alt || `${location.slug} Bild ${idx + 1}`,
        order: idx
      }));
      
      const { error } = await supabase
        .from('locations')
        .update({
          cover_image: locationImages[0].url,
          images: imageData
        })
        .eq('slug', location.slug);
      
      if (error) {
        console.error(`❌ Error updating location ${location.slug}:`, error);
      } else {
        console.log(`✅ Updated location ${location.slug} with ${locationImages.length} images`);
      }
    }
  }
  
  // Update blog posts with featured images
  console.log('\n📝 Updating blog posts with featured images...');
  for (const blogPost of analysis.grouped.blog) {
    // Find images for this blog post
    const blogImages = imageMapping.allImages.filter((img: any) => 
      img.contentType === 'blog' || 
      img.htmlFile.includes(blogPost.slug) ||
      img.htmlFile.includes('tipp')
    );
    
    if (blogImages.length > 0) {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          featured_image: blogImages[0].url
        })
        .eq('slug', blogPost.slug);
      
      if (error) {
        console.error(`❌ Error updating blog post ${blogPost.slug}:`, error);
      } else {
        console.log(`✅ Updated blog post ${blogPost.slug} with featured image`);
      }
    }
  }
  
  // Update fotobox services with images
  console.log('\n📸 Updating fotobox services with images...');
  for (const service of analysis.grouped.fotobox) {
    // Find images for this service
    const serviceImages = imageMapping.allImages.filter((img: any) => 
      img.contentType === 'fotobox' || 
      img.htmlFile.includes(service.slug) ||
      img.htmlFile.includes('fotobox') ||
      img.htmlFile.includes('photobooth')
    );
    
    if (serviceImages.length > 0) {
      const imageData = serviceImages.map((img: any, idx: number) => ({
        url: img.url,
        alt: img.alt || `Fotobox ${idx + 1}`,
        order: idx
      }));
      
      const { error } = await supabase
        .from('fotobox_services')
        .update({
          featured_image: serviceImages[0].url,
          images: imageData
        })
        .eq('slug', service.slug);
      
      if (error) {
        console.error(`❌ Error updating fotobox service ${service.slug}:`, error);
      } else {
        console.log(`✅ Updated fotobox service ${service.slug} with ${serviceImages.length} images`);
      }
    }
  }
  
  // Add some sample images to items without specific matches
  console.log('\n🖼️ Adding sample images to remaining items...');
  
  // Sample wedding images for items without matches
  const sampleWeddingImages = [
    'https://www.dz-photo.at/wp-content/uploads/IMG_7982-300x200.jpg',
    'https://www.dz-photo.at/wp-content/uploads/DDZ_5457-300x200.jpg',
    'https://www.dz-photo.at/wp-content/uploads/DDZ_0657-200x300.jpg'
  ];
  
  // Update weddings without images
  const { data: weddingsWithoutImages } = await supabase
    .from('weddings')
    .select('id, slug')
    .is('cover_image', null);
  
  if (weddingsWithoutImages) {
    for (let i = 0; i < weddingsWithoutImages.length; i++) {
      const wedding = weddingsWithoutImages[i];
      const imageUrl = sampleWeddingImages[i % sampleWeddingImages.length];
      
      await supabase
        .from('weddings')
        .update({
          cover_image: imageUrl,
          images: [{
            url: imageUrl,
            alt: `Hochzeitsfoto von ${wedding.slug}`,
            order: 0
          }]
        })
        .eq('id', wedding.id);
      
      console.log(`✅ Added sample image to wedding: ${wedding.slug}`);
    }
  }
  
  // Sample location images
  const sampleLocationImages = [
    'https://www.dz-photo.at/wp-content/uploads/DDZ_0106-1.jpg',
    'https://www.dz-photo.at/wp-content/uploads/DZ_3320.jpg',
    'https://www.dz-photo.at/wp-content/uploads/DDZ_6384.jpg'
  ];
  
  // Update locations without images
  const { data: locationsWithoutImages } = await supabase
    .from('locations')
    .select('id, slug')
    .is('cover_image', null);
  
  if (locationsWithoutImages) {
    for (let i = 0; i < locationsWithoutImages.length; i++) {
      const location = locationsWithoutImages[i];
      const imageUrl = sampleLocationImages[i % sampleLocationImages.length];
      
      await supabase
        .from('locations')
        .update({
          cover_image: imageUrl,
          images: [{
            url: imageUrl,
            alt: `Location ${location.slug}`,
            order: 0
          }]
        })
        .eq('id', location.id);
      
      console.log(`✅ Added sample image to location: ${location.slug}`);
    }
  }
  
  console.log('\n✅ Database image update completed!');
}

// Run update
if (require.main === module) {
  updateDatabaseWithCorrectImages().catch(console.error);
}

export { updateDatabaseWithCorrectImages };
