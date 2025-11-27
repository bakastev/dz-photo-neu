#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function updateDatabaseImageUrls() {
  console.log('🔄 Updating database image URLs to point to Supabase Storage...\n');

  // Update weddings
  console.log('📝 Updating weddings...');
  const { data: weddings, error: weddingsError } = await supabase
    .from('weddings')
    .select('id, slug, cover_image, images');
  
  if (weddingsError) {
    console.error('Error fetching weddings:', weddingsError);
    return;
  }

  for (const wedding of weddings) {
    let updated = false;
    let newCoverImage = wedding.cover_image;
    let newImages = wedding.images;

    // Update cover_image if it's a WordPress URL
    if (wedding.cover_image && wedding.cover_image.includes('dz-photo.at')) {
      const filename = wedding.cover_image.split('/').pop();
      if (filename) {
        newCoverImage = `weddings/${filename}`;
        updated = true;
      }
    }

    // Update images array
    if (wedding.images && Array.isArray(wedding.images)) {
      newImages = wedding.images.map((img: any) => {
        if (img.url && img.url.includes('dz-photo.at')) {
          const filename = img.url.split('/').pop();
          if (filename) {
            return { ...img, url: `weddings/${filename}` };
          }
        }
        return img;
      });
      updated = true;
    }

    if (updated) {
      const { error } = await supabase
        .from('weddings')
        .update({ 
          cover_image: newCoverImage,
          images: newImages 
        })
        .eq('id', wedding.id);
      
      if (error) {
        console.error(`Error updating wedding ${wedding.slug}:`, error);
      } else {
        console.log(`✅ Updated wedding: ${wedding.slug}`);
      }
    }
  }

  // Update locations
  console.log('\n📝 Updating locations...');
  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('id, slug, cover_image, images');
  
  if (locationsError) {
    console.error('Error fetching locations:', locationsError);
    return;
  }

  for (const location of locations) {
    let updated = false;
    let newCoverImage = location.cover_image;
    let newImages = location.images;

    // Update cover_image if it's a WordPress URL
    if (location.cover_image && location.cover_image.includes('dz-photo.at')) {
      const filename = location.cover_image.split('/').pop();
      if (filename) {
        newCoverImage = `locations/${filename}`;
        updated = true;
      }
    }

    // Update images array
    if (location.images && Array.isArray(location.images)) {
      newImages = location.images.map((img: any) => {
        if (img.url && img.url.includes('dz-photo.at')) {
          const filename = img.url.split('/').pop();
          if (filename) {
            return { ...img, url: `locations/${filename}` };
          }
        }
        return img;
      });
      updated = true;
    }

    if (updated) {
      const { error } = await supabase
        .from('locations')
        .update({ 
          cover_image: newCoverImage,
          images: newImages 
        })
        .eq('id', location.id);
      
      if (error) {
        console.error(`Error updating location ${location.slug}:`, error);
      } else {
        console.log(`✅ Updated location: ${location.slug}`);
      }
    }
  }

  // Update blog_posts
  console.log('\n📝 Updating blog posts...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('id, slug, featured_image, content');
  
  if (blogError) {
    console.error('Error fetching blog posts:', blogError);
    return;
  }

  for (const post of blogPosts) {
    let updated = false;
    let newFeaturedImage = post.featured_image;
    let newContent = post.content;

    // Update featured_image if it's a WordPress URL
    if (post.featured_image && post.featured_image.includes('dz-photo.at')) {
      const filename = post.featured_image.split('/').pop();
      if (filename) {
        newFeaturedImage = `blog/${filename}`;
        updated = true;
      }
    }

    // Update content images
    if (post.content && post.content.includes('dz-photo.at')) {
      newContent = post.content.replace(
        /https?:\/\/[^\/]*dz-photo\.at\/[^\/]*\/uploads\/[^\/]*\/([^"'\s]+)/g,
        (match, filename) => {
          return `blog/${filename}`;
        }
      );
      updated = true;
    }

    if (updated) {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          featured_image: newFeaturedImage,
          content: newContent 
        })
        .eq('id', post.id);
      
      if (error) {
        console.error(`Error updating blog post ${post.slug}:`, error);
      } else {
        console.log(`✅ Updated blog post: ${post.slug}`);
      }
    }
  }

  // Update reviews
  console.log('\n📝 Updating reviews...');
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('id, reviewer_avatar');
  
  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
    return;
  }

  for (const review of reviews) {
    let updated = false;
    let newAvatar = review.reviewer_avatar;

    // Update reviewer_avatar if it's a WordPress URL
    if (review.reviewer_avatar && review.reviewer_avatar.includes('dz-photo.at')) {
      const filename = review.reviewer_avatar.split('/').pop();
      if (filename) {
        newAvatar = `reviews/${filename}`;
        updated = true;
      }
    }

    if (updated) {
      const { error } = await supabase
        .from('reviews')
        .update({ reviewer_avatar: newAvatar })
        .eq('id', review.id);
      
      if (error) {
        console.error(`Error updating review ${review.id}:`, error);
      } else {
        console.log(`✅ Updated review: ${review.id}`);
      }
    }
  }

  console.log('\n🎉 Database image URLs updated successfully!');
}

updateDatabaseImageUrls().catch(console.error);
