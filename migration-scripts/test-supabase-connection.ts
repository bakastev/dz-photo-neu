import { createClient } from '@supabase/supabase-js';

// Test Supabase connection and data loading
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM';

  console.log('📊 Environment Variables:');
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('SUPABASE_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');
  console.log('');

  // Create client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check connection
    console.log('🔗 Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('weddings')
      .select('count', { count: 'exact', head: true });

    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return;
    }
    console.log('✅ Connection successful!');
    console.log('');

    // Test 2: Count records in each table
    console.log('📋 Checking table contents:');
    
    const tables = ['weddings', 'locations', 'blog_posts', 'fotobox_services', 'reviews', 'pages'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: Error - ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err}`);
      }
    }
    console.log('');

    // Test 3: Fetch sample data for homepage
    console.log('🏠 Testing homepage data fetching...');
    
    const [
      { data: featuredWeddings, error: weddingsError },
      { data: locations, error: locationsError },
      { data: blogPosts, error: blogError },
      { data: reviews, error: reviewsError }
    ] = await Promise.all([
      supabase.from('weddings').select('id, couple_names, cover_image, featured, published').eq('featured', true).eq('published', true).limit(3),
      supabase.from('locations').select('id, name, cover_image, published').eq('published', true).limit(3),
      supabase.from('blog_posts').select('id, title, published').eq('published', true).limit(3),
      supabase.from('reviews').select('id, reviewer_name, published').eq('published', true).limit(3)
    ]);

    console.log('Featured Weddings:', featuredWeddings?.length || 0, weddingsError ? `(Error: ${weddingsError.message})` : '');
    if (featuredWeddings?.length) {
      featuredWeddings.forEach(w => console.log(`  - ${w.couple_names} (${w.cover_image ? 'has image' : 'no image'})`));
    }

    console.log('Locations:', locations?.length || 0, locationsError ? `(Error: ${locationsError.message})` : '');
    if (locations?.length) {
      locations.forEach(l => console.log(`  - ${l.name} (${l.cover_image ? 'has image' : 'no image'})`));
    }

    console.log('Blog Posts:', blogPosts?.length || 0, blogError ? `(Error: ${blogError.message})` : '');
    if (blogPosts?.length) {
      blogPosts.forEach(b => console.log(`  - ${b.title}`));
    }

    console.log('Reviews:', reviews?.length || 0, reviewsError ? `(Error: ${reviewsError.message})` : '');
    if (reviews?.length) {
      reviews.forEach(r => console.log(`  - ${r.reviewer_name}`));
    }

    console.log('');
    console.log('🎉 Supabase connection test completed!');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the test
testSupabaseConnection().catch(console.error);
