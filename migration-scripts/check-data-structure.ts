import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

async function checkDataStructure() {
  console.log('🔍 Checking actual data structure and fixing issues...\n');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Check reviews table structure
    console.log('📋 Reviews table structure:');
    const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('*').limit(1);
    if (reviews?.[0]) {
      console.log('Available columns:', Object.keys(reviews[0]));
      console.log('Sample data:', reviews[0]);
    }
    console.log('');
    
    // 2. Check weddings and set some as featured
    console.log('💒 Weddings - checking and setting featured:');
    const { data: allWeddings } = await supabase.from('weddings').select('id, couple_names, featured, published, cover_image').limit(10);
    
    if (allWeddings) {
      console.log(`Found ${allWeddings.length} weddings`);
      
      // Set first 3 published weddings as featured
      const toFeature = allWeddings.filter(w => w.published).slice(0, 3);
      
      for (const wedding of toFeature) {
        if (!wedding.featured) {
          const { error } = await supabase
            .from('weddings')
            .update({ featured: true })
            .eq('id', wedding.id);
          
          if (!error) {
            console.log(`✅ Set ${wedding.couple_names} as featured`);
          }
        } else {
          console.log(`✅ ${wedding.couple_names} already featured`);
        }
      }
    }
    console.log('');
    
    // 3. Check locations and their images
    console.log('📍 Locations - checking images:');
    const { data: locations } = await supabase.from('locations').select('id, name, cover_image, images').limit(5);
    
    if (locations) {
      locations.forEach(location => {
        console.log(`- ${location.name}:`);
        console.log(`  Cover: ${location.cover_image || 'none'}`);
        console.log(`  Images: ${location.images ? (Array.isArray(location.images) ? location.images.length + ' images' : 'has images') : 'none'}`);
      });
    }
    console.log('');
    
    // 4. Test homepage data fetching with correct columns
    console.log('🏠 Testing corrected homepage data fetching:');
    
    const [
      { data: featuredWeddings, error: weddingsError },
      { data: locationsData, error: locationsError },
      { data: blogPosts, error: blogError },
      { data: reviewsData, error: reviewsError2 }
    ] = await Promise.all([
      supabase.from('weddings').select('id, couple_names, cover_image, featured, published').eq('featured', true).eq('published', true).limit(3),
      supabase.from('locations').select('id, name, cover_image, published').eq('published', true).limit(3),
      supabase.from('blog_posts').select('id, title, published').eq('published', true).limit(3),
      supabase.from('reviews').select('*').eq('published', true).limit(3)
    ]);

    console.log('✅ Featured Weddings:', featuredWeddings?.length || 0);
    featuredWeddings?.forEach(w => console.log(`  - ${w.couple_names}`));
    
    console.log('✅ Locations:', locationsData?.length || 0);
    locationsData?.forEach(l => console.log(`  - ${l.name}`));
    
    console.log('✅ Blog Posts:', blogPosts?.length || 0);
    blogPosts?.forEach(b => console.log(`  - ${b.title}`));
    
    console.log('✅ Reviews:', reviewsData?.length || 0);
    if (reviewsData?.[0]) {
      console.log('  Review columns:', Object.keys(reviewsData[0]));
    }
    
    console.log('\n🎉 Data structure check completed!');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

checkDataStructure().catch(console.error);
