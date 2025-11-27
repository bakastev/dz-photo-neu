#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function testDatabaseImages() {
  console.log('🔍 Testing database images...\n');

  // Test weddings with images
  const { data: weddings } = await supabase
    .from('weddings')
    .select('slug, title, cover_image, images')
    .not('cover_image', 'is', null)
    .limit(5);

  console.log('📸 Weddings with images:');
  weddings?.forEach(wedding => {
    console.log(`- ${wedding.title} (${wedding.slug})`);
    console.log(`  Cover: ${wedding.cover_image}`);
    if (wedding.images && Array.isArray(wedding.images)) {
      console.log(`  Images: ${wedding.images.length} total`);
    }
    console.log('');
  });

  // Test locations with images
  const { data: locations } = await supabase
    .from('locations')
    .select('slug, name, cover_image, images')
    .not('cover_image', 'is', null)
    .limit(5);

  console.log('🏰 Locations with images:');
  locations?.forEach(location => {
    console.log(`- ${location.name} (${location.slug})`);
    console.log(`  Cover: ${location.cover_image}`);
    if (location.images && Array.isArray(location.images)) {
      console.log(`  Images: ${location.images.length} total`);
    }
    console.log('');
  });

  // Test blog posts with images
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, featured_image')
    .not('featured_image', 'is', null)
    .limit(5);

  console.log('📝 Blog posts with images:');
  blogPosts?.forEach(post => {
    console.log(`- ${post.title} (${post.slug})`);
    console.log(`  Featured: ${post.featured_image}`);
    console.log('');
  });

  // Get some hero images for the homepage
  console.log('🎯 Suggested hero images:');
  const heroImages = [
    ...(weddings?.slice(0, 3).map(w => w.cover_image) || []),
    ...(locations?.slice(0, 2).map(l => l.cover_image) || [])
  ].filter(Boolean);

  heroImages.forEach((img, idx) => {
    console.log(`Hero ${idx + 1}: ${img}`);
  });
}

testDatabaseImages().catch(console.error);
