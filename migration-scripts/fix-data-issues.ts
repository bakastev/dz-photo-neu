import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

async function fixDataIssues() {
  console.log('🔧 Fixing data issues for homepage...\n');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Check raw data without published filter
    console.log('📊 Raw data check (no filters):');
    
    const { data: allWeddings } = await supabase.from('weddings').select('id, couple_names, featured, published').limit(5);
    const { data: allLocations } = await supabase.from('locations').select('id, name, published').limit(5);
    const { data: allBlogs } = await supabase.from('blog_posts').select('id, title, published').limit(5);
    const { data: allReviews } = await supabase.from('reviews').select('*').limit(5);
    
    console.log('Weddings:', allWeddings?.length || 0);
    allWeddings?.forEach(w => console.log(`  - ${w.couple_names}: published=${w.published}, featured=${w.featured}`));
    
    console.log('Locations:', allLocations?.length || 0);
    allLocations?.forEach(l => console.log(`  - ${l.name}: published=${l.published}`));
    
    console.log('Blog Posts:', allBlogs?.length || 0);
    allBlogs?.forEach(b => console.log(`  - ${b.title}: published=${b.published}`));
    
    console.log('Reviews:', allReviews?.length || 0);
    if (allReviews?.[0]) {
      console.log('  Columns:', Object.keys(allReviews[0]));
    }
    
    console.log('\n🔧 Fixing published status...');
    
    // 2. Set published = true for first few items in each table
    if (allWeddings?.length) {
      for (let i = 0; i < Math.min(3, allWeddings.length); i++) {
        const wedding = allWeddings[i];
        await supabase
          .from('weddings')
          .update({ published: true, featured: i === 0 }) // First one is featured
          .eq('id', wedding.id);
        console.log(`✅ Updated wedding: ${wedding.couple_names}`);
      }
    }
    
    if (allLocations?.length) {
      for (let i = 0; i < Math.min(3, allLocations.length); i++) {
        const location = allLocations[i];
        await supabase
          .from('locations')
          .update({ published: true })
          .eq('id', location.id);
        console.log(`✅ Updated location: ${location.name}`);
      }
    }
    
    if (allBlogs?.length) {
      for (let i = 0; i < Math.min(3, allBlogs.length); i++) {
        const blog = allBlogs[i];
        await supabase
          .from('blog_posts')
          .update({ published: true })
          .eq('id', blog.id);
        console.log(`✅ Updated blog: ${blog.title}`);
      }
    }
    
    if (allReviews?.length) {
      for (let i = 0; i < Math.min(2, allReviews.length); i++) {
        const review = allReviews[i];
        await supabase
          .from('reviews')
          .update({ published: true })
          .eq('id', review.id);
        console.log(`✅ Updated review: ${review.id}`);
      }
    }
    
    console.log('\n🧪 Testing homepage data after fixes:');
    
    // 3. Test homepage data again
    const [
      { data: featuredWeddings },
      { data: locationsData },
      { data: blogPosts },
      { data: reviewsData }
    ] = await Promise.all([
      supabase.from('weddings').select('*').eq('featured', true).eq('published', true),
      supabase.from('locations').select('*').eq('published', true).limit(3),
      supabase.from('blog_posts').select('*').eq('published', true).limit(3),
      supabase.from('reviews').select('*').eq('published', true).limit(3)
    ]);

    console.log('✅ Featured Weddings:', featuredWeddings?.length || 0);
    featuredWeddings?.forEach(w => console.log(`  - ${w.couple_names} (${w.cover_image ? 'has image' : 'no image'})`));
    
    console.log('✅ Locations:', locationsData?.length || 0);
    locationsData?.forEach(l => console.log(`  - ${l.name} (${l.cover_image ? 'has image' : 'no image'})`));
    
    console.log('✅ Blog Posts:', blogPosts?.length || 0);
    blogPosts?.forEach(b => console.log(`  - ${b.title}`));
    
    console.log('✅ Reviews:', reviewsData?.length || 0);
    
    console.log('\n🎉 Data fixes completed! Homepage should now show real content.');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

fixDataIssues().catch(console.error);
