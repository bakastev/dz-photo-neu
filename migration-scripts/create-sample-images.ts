#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function createSampleImages() {
  console.log('🖼️ Creating sample image data for demonstration...');
  
  // Sample image URLs from Unsplash (wedding photography)
  const sampleWeddingImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800'
  ];
  
  const sampleLocationImages = [
    'https://images.unsplash.com/photo-1519167758481-83f29c8e8d4b?w=800',
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800'
  ];
  
  // Update weddings with sample images
  console.log('\n🤵👰 Adding sample images to weddings...');
  const { data: weddings } = await supabase
    .from('weddings')
    .select('id, slug')
    .limit(5);
  
  if (weddings) {
    for (let i = 0; i < weddings.length; i++) {
      const wedding = weddings[i];
      const images = sampleWeddingImages.map((url, idx) => ({
        url: url,
        alt: `Hochzeitsfoto ${idx + 1} von ${wedding.slug}`,
        order: idx
      }));
      
      await supabase
        .from('weddings')
        .update({
          cover_image: sampleWeddingImages[0],
          images: images
        })
        .eq('id', wedding.id);
      
      console.log(`✅ Updated wedding: ${wedding.slug}`);
    }
  }
  
  // Update locations with sample images
  console.log('\n🏰 Adding sample images to locations...');
  const { data: locations } = await supabase
    .from('locations')
    .select('id, slug')
    .limit(3);
  
  if (locations) {
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const images = sampleLocationImages.map((url, idx) => ({
        url: url,
        alt: `Location ${location.slug} Bild ${idx + 1}`,
        order: idx
      }));
      
      await supabase
        .from('locations')
        .update({
          cover_image: sampleLocationImages[i % sampleLocationImages.length],
          images: images
        })
        .eq('id', location.id);
      
      console.log(`✅ Updated location: ${location.slug}`);
    }
  }
  
  // Update blog posts with sample images
  console.log('\n📝 Adding sample images to blog posts...');
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .limit(5);
  
  if (blogPosts) {
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      
      await supabase
        .from('blog_posts')
        .update({
          featured_image: sampleWeddingImages[i % sampleWeddingImages.length]
        })
        .eq('id', post.id);
      
      console.log(`✅ Updated blog post: ${post.slug}`);
    }
  }
  
  // Update fotobox services with sample images
  console.log('\n📸 Adding sample images to fotobox services...');
  const { data: services } = await supabase
    .from('fotobox_services')
    .select('id, slug')
    .limit(3);
  
  if (services) {
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      
      await supabase
        .from('fotobox_services')
        .update({
          featured_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'
        })
        .eq('id', service.id);
      
      console.log(`✅ Updated fotobox service: ${service.slug}`);
    }
  }
  
  console.log('\n✅ Sample images created successfully!');
  console.log('\n📝 Note: In production, you would:');
  console.log('1. Download actual images from WordPress wp-content/uploads');
  console.log('2. Optimize them (WebP conversion, compression)');
  console.log('3. Upload to Supabase Storage');
  console.log('4. Update database with Supabase Storage URLs');
}

// Run sample image creation
if (require.main === module) {
  createSampleImages().catch(console.error);
}

export { createSampleImages };
