#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function seedAnalyticsData() {
  console.log('📊 Seeding Analytics Data...');
  
  // 1. Seed Page Analytics
  console.log('\n📈 Seeding Page Analytics...');
  await seedPageAnalytics();
  
  // 2. Seed Search Analytics
  console.log('\n🔍 Seeding Search Analytics...');
  await seedSearchAnalytics();
  
  // 3. Seed AI Agent Interactions
  console.log('\n🤖 Seeding AI Agent Interactions...');
  await seedAIAgentInteractions();
  
  // 4. Seed Social Media Analytics
  console.log('\n📱 Seeding Social Media Analytics...');
  await seedSocialMediaAnalytics();
  
  // 5. Seed Conversion Tracking
  console.log('\n🎯 Seeding Conversion Tracking...');
  await seedConversionTracking();
  
  // 6. Seed Performance Benchmarks
  console.log('\n⚡ Seeding Performance Benchmarks...');
  await seedPerformanceBenchmarks();
  
  // 7. Test Performance Score Function
  console.log('\n🧪 Testing Performance Score Function...');
  await testPerformanceScoring();
  
  console.log('\n✅ Analytics data seeding completed!');
}

async function seedPageAnalytics() {
  // Get sample content
  const { data: weddings } = await supabase.from('weddings').select('id').limit(5);
  const { data: locations } = await supabase.from('locations').select('id').limit(5);
  const { data: blogPosts } = await supabase.from('blog_posts').select('id').limit(5);
  
  const analyticsData = [];
  
  // Generate analytics for weddings
  if (weddings) {
    for (const wedding of weddings) {
      for (let i = 0; i < 30; i++) { // 30 days of data
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        analyticsData.push({
          content_type: 'wedding',
          content_id: wedding.id,
          page_views: Math.floor(Math.random() * 200) + 50,
          unique_visitors: Math.floor(Math.random() * 150) + 30,
          avg_time_on_page: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
          bounce_rate: Math.random() * 30 + 20, // 20-50%
          conversion_rate: Math.random() * 5 + 1, // 1-6%
          core_web_vitals: {
            lcp: Math.random() * 2 + 1.5, // 1.5-3.5s
            fid: Math.random() * 50 + 50, // 50-100ms
            cls: Math.random() * 0.1 + 0.05 // 0.05-0.15
          },
          lighthouse_score: Math.floor(Math.random() * 20) + 80, // 80-100
          date_recorded: date.toISOString().split('T')[0]
        });
      }
    }
  }
  
  // Generate analytics for locations
  if (locations) {
    for (const location of locations) {
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        analyticsData.push({
          content_type: 'location',
          content_id: location.id,
          page_views: Math.floor(Math.random() * 150) + 30,
          unique_visitors: Math.floor(Math.random() * 100) + 20,
          avg_time_on_page: Math.floor(Math.random() * 200) + 90,
          bounce_rate: Math.random() * 25 + 25, // 25-50%
          conversion_rate: Math.random() * 8 + 2, // 2-10%
          core_web_vitals: {
            lcp: Math.random() * 1.5 + 1.2,
            fid: Math.random() * 40 + 40,
            cls: Math.random() * 0.08 + 0.03
          },
          lighthouse_score: Math.floor(Math.random() * 15) + 85,
          date_recorded: date.toISOString().split('T')[0]
        });
      }
    }
  }
  
  // Generate analytics for blog posts
  if (blogPosts) {
    for (const post of blogPosts) {
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        analyticsData.push({
          content_type: 'blog',
          content_id: post.id,
          page_views: Math.floor(Math.random() * 100) + 20,
          unique_visitors: Math.floor(Math.random() * 80) + 15,
          avg_time_on_page: Math.floor(Math.random() * 400) + 180, // 3-10 minutes
          bounce_rate: Math.random() * 40 + 30, // 30-70%
          conversion_rate: Math.random() * 3 + 0.5, // 0.5-3.5%
          core_web_vitals: {
            lcp: Math.random() * 2 + 1.0,
            fid: Math.random() * 60 + 30,
            cls: Math.random() * 0.12 + 0.02
          },
          lighthouse_score: Math.floor(Math.random() * 25) + 75,
          date_recorded: date.toISOString().split('T')[0]
        });
      }
    }
  }
  
  // Insert in batches
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < analyticsData.length; i += batchSize) {
    const batch = analyticsData.slice(i, i + batchSize);
    const { error } = await supabase
      .from('page_analytics')
      .upsert(batch, {
        onConflict: 'content_type,content_id,date_recorded'
      });
    
    if (!error) {
      inserted += batch.length;
    }
  }
  
  console.log(`✅ Inserted ${inserted} page analytics records`);
}

async function seedSearchAnalytics() {
  const searchQueries = [
    // Primary queries
    { query: 'Hochzeitsfotograf Oberösterreich', impressions: 1200, clicks: 84, avg_position: 3.2 },
    { query: 'Hochzeitsfotografie Linz', impressions: 800, clicks: 72, avg_position: 2.8 },
    { query: 'Hochzeitsfotograf Wels', impressions: 600, clicks: 54, avg_position: 2.1 },
    
    // Secondary queries
    { query: 'Hochzeitsbilder Oberösterreich', impressions: 400, clicks: 28, avg_position: 4.5 },
    { query: 'Hochzeitslocation Oberösterreich', impressions: 500, clicks: 35, avg_position: 3.8 },
    { query: 'Fotobox Hochzeit', impressions: 300, clicks: 21, avg_position: 5.2 },
    
    // Long-tail queries
    { query: 'Hochzeitsfotograf Oberösterreich günstig', impressions: 150, clicks: 12, avg_position: 6.1 },
    { query: 'Hochzeitsfotos natürlich emotional', impressions: 100, clicks: 8, avg_position: 4.9 },
    { query: 'Daniel Zangerle Fotograf', impressions: 80, clicks: 15, avg_position: 1.2 },
    
    // Local queries
    { query: 'Hochzeitsfotograf Steyr', impressions: 250, clicks: 18, avg_position: 3.5 },
    { query: 'Hochzeitsfotograf Vöcklabruck', impressions: 180, clicks: 14, avg_position: 4.1 },
    { query: 'Hochzeitsfotograf Eferding', impressions: 120, clicks: 9, avg_position: 5.8 },
    
    // Venue-specific queries
    { query: 'Hochzeitsfotograf Vedahof', impressions: 90, clicks: 12, avg_position: 2.3 },
    { query: 'Hochzeitsfotograf Burnerhof', impressions: 75, clicks: 10, avg_position: 2.8 },
    { query: 'Hochzeitsfotograf Hoamat', impressions: 60, clicks: 8, avg_position: 3.1 }
  ];
  
  const analyticsData = [];
  
  for (const queryData of searchQueries) {
    for (let i = 0; i < 30; i++) { // 30 days of data
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some variance to the data
      const variance = 0.8 + Math.random() * 0.4; // 80-120% of base values
      
      analyticsData.push({
        query: queryData.query,
        results_count: 10,
        click_through_rate: (queryData.clicks / queryData.impressions * 100 * variance).toFixed(2),
        avg_position: (queryData.avg_position * (0.9 + Math.random() * 0.2)).toFixed(1),
        impressions: Math.floor(queryData.impressions * variance / 30), // Daily impressions
        clicks: Math.floor(queryData.clicks * variance / 30), // Daily clicks
        search_source: 'google',
        device_type: Math.random() > 0.6 ? 'mobile' : 'desktop',
        country_code: 'AT',
        date_recorded: date.toISOString().split('T')[0]
      });
    }
  }
  
  const { error } = await supabase
    .from('search_analytics')
    .upsert(analyticsData, {
      onConflict: 'query,date_recorded,device_type'
    });
  
  if (!error) {
    console.log(`✅ Inserted ${analyticsData.length} search analytics records`);
  }
}

async function seedAIAgentInteractions() {
  const agentTypes = ['chatgpt', 'perplexity', 'google_bard', 'claude', 'bing_copilot'];
  const interactionTypes = ['crawl', 'query', 'citation', 'summary'];
  
  const { data: weddings } = await supabase.from('weddings').select('id').limit(3);
  const { data: locations } = await supabase.from('locations').select('id').limit(3);
  
  const interactionsData = [];
  
  for (let i = 0; i < 100; i++) { // 100 AI interactions
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const agentType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
    const interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
    
    let contentType = null;
    let contentId = null;
    
    if (Math.random() > 0.3) { // 70% chance of having content reference
      if (Math.random() > 0.5 && weddings) {
        contentType = 'wedding';
        contentId = weddings[Math.floor(Math.random() * weddings.length)].id;
      } else if (locations) {
        contentType = 'location';
        contentId = locations[Math.floor(Math.random() * locations.length)].id;
      }
    }
    
    interactionsData.push({
      agent_type: agentType,
      user_agent: `${agentType}-bot/1.0`,
      interaction_type: interactionType,
      content_type: contentType,
      content_id: contentId,
      query_text: interactionType === 'query' ? 'Hochzeitsfotograf Oberösterreich empfehlung' : null,
      response_generated: Math.random() > 0.2, // 80% success rate
      citation_included: Math.random() > 0.4, // 60% citation rate
      attribution_correct: Math.random() > 0.1, // 90% correct attribution
      session_id: `session_${Math.random().toString(36).substr(2, 9)}`,
      date_recorded: date.toISOString().split('T')[0]
    });
  }
  
  const { error } = await supabase
    .from('ai_agent_interactions')
    .insert(interactionsData);
  
  if (!error) {
    console.log(`✅ Inserted ${interactionsData.length} AI agent interactions`);
  }
}

async function seedSocialMediaAnalytics() {
  const platforms = ['instagram', 'facebook', 'pinterest'];
  const { data: weddings } = await supabase.from('weddings').select('id').limit(5);
  
  const socialData = [];
  
  if (weddings) {
    for (const wedding of weddings) {
      for (const platform of platforms) {
        for (let i = 0; i < 7; i++) { // Weekly posts
          const date = new Date();
          date.setDate(date.getDate() - i * 7);
          
          const impressions = Math.floor(Math.random() * 2000) + 500;
          const reach = Math.floor(impressions * (0.6 + Math.random() * 0.3)); // 60-90% of impressions
          const engagement = Math.floor(reach * (0.02 + Math.random() * 0.08)); // 2-10% engagement
          
          socialData.push({
            platform: platform,
            content_type: 'wedding',
            content_id: wedding.id,
            post_id: `${platform}_${wedding.id}_${i}`,
            post_url: `https://${platform}.com/dz_photo/posts/${wedding.id}_${i}`,
            impressions: impressions,
            reach: reach,
            engagement: engagement,
            likes: Math.floor(engagement * 0.7),
            comments: Math.floor(engagement * 0.15),
            shares: Math.floor(engagement * 0.1),
            clicks: Math.floor(engagement * 0.05),
            saves: platform === 'pinterest' ? Math.floor(engagement * 0.3) : Math.floor(engagement * 0.1),
            engagement_rate: (engagement / reach * 100).toFixed(2),
            date_recorded: date.toISOString().split('T')[0]
          });
        }
      }
    }
  }
  
  const { error } = await supabase
    .from('social_media_analytics')
    .insert(socialData);
  
  if (!error) {
    console.log(`✅ Inserted ${socialData.length} social media analytics records`);
  }
}

async function seedConversionTracking() {
  const conversionTypes = ['contact_form', 'email_click', 'phone_call', 'booking_inquiry'];
  const utmSources = ['google', 'facebook', 'instagram', 'direct', 'referral'];
  const utmMediums = ['organic', 'cpc', 'social', 'email', 'referral'];
  
  const conversionsData = [];
  
  for (let i = 0; i < 50; i++) { // 50 conversions over 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const conversionType = conversionTypes[Math.floor(Math.random() * conversionTypes.length)];
    const utmSource = utmSources[Math.floor(Math.random() * utmSources.length)];
    const utmMedium = utmMediums[Math.floor(Math.random() * utmMediums.length)];
    
    // Assign conversion values
    let conversionValue = 0;
    switch (conversionType) {
      case 'contact_form':
        conversionValue = 150; // Lead value
        break;
      case 'booking_inquiry':
        conversionValue = 500; // High-intent lead
        break;
      case 'phone_call':
        conversionValue = 200; // Phone lead
        break;
      case 'email_click':
        conversionValue = 50; // Email engagement
        break;
    }
    
    conversionsData.push({
      conversion_type: conversionType,
      content_type: Math.random() > 0.5 ? 'wedding' : 'location',
      source_url: `https://www.dz-photo.at/${Math.random() > 0.5 ? 'hochzeit' : 'locations'}/sample`,
      referrer: utmSource === 'google' ? 'https://www.google.com' : `https://www.${utmSource}.com`,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: 'hochzeitsfotografie_2024',
      user_session_id: `session_${Math.random().toString(36).substr(2, 9)}`,
      conversion_value: conversionValue,
      device_type: Math.random() > 0.6 ? 'mobile' : 'desktop',
      browser: Math.random() > 0.5 ? 'Chrome' : 'Safari',
      country_code: 'AT',
      created_at: date.toISOString()
    });
  }
  
  const { error } = await supabase
    .from('conversion_tracking')
    .insert(conversionsData);
  
  if (!error) {
    console.log(`✅ Inserted ${conversionsData.length} conversion tracking records`);
  }
}

async function seedPerformanceBenchmarks() {
  const benchmarkTypes = ['lighthouse', 'core_web_vitals', 'seo_score', 'accessibility'];
  const { data: weddings } = await supabase.from('weddings').select('id').limit(3);
  const { data: locations } = await supabase.from('locations').select('id').limit(3);
  
  const benchmarksData = [];
  
  // Lighthouse benchmarks
  const lighthouseMetrics = [
    { name: 'performance', target: 90 },
    { name: 'accessibility', target: 95 },
    { name: 'best_practices', target: 90 },
    { name: 'seo', target: 95 }
  ];
  
  // Core Web Vitals benchmarks
  const cwvMetrics = [
    { name: 'lcp', target: 2.5 },
    { name: 'fid', target: 100 },
    { name: 'cls', target: 0.1 }
  ];
  
  const allContent = [
    ...(weddings?.map(w => ({ type: 'wedding', id: w.id })) || []),
    ...(locations?.map(l => ({ type: 'location', id: l.id })) || [])
  ];
  
  for (const content of allContent) {
    for (let i = 0; i < 7; i++) { // Weekly measurements
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      
      // Lighthouse metrics
      for (const metric of lighthouseMetrics) {
        const value = metric.target - 10 + Math.random() * 15; // ±5 from target
        const status = value >= metric.target ? 'excellent' : 
                      value >= metric.target * 0.8 ? 'good' : 
                      value >= metric.target * 0.6 ? 'needs_improvement' : 'poor';
        
        benchmarksData.push({
          benchmark_type: 'lighthouse',
          content_type: content.type,
          content_id: content.id,
          metric_name: metric.name,
          metric_value: value,
          target_value: metric.target,
          status: status,
          measurement_tool: 'lighthouse',
          date_recorded: date.toISOString().split('T')[0]
        });
      }
      
      // Core Web Vitals
      for (const metric of cwvMetrics) {
        let value;
        if (metric.name === 'lcp') {
          value = 1.5 + Math.random() * 2; // 1.5-3.5s
        } else if (metric.name === 'fid') {
          value = 50 + Math.random() * 100; // 50-150ms
        } else { // cls
          value = 0.05 + Math.random() * 0.1; // 0.05-0.15
        }
        
        const status = value <= metric.target ? 'excellent' : 
                      value <= metric.target * 1.5 ? 'good' : 
                      value <= metric.target * 2 ? 'needs_improvement' : 'poor';
        
        benchmarksData.push({
          benchmark_type: 'core_web_vitals',
          content_type: content.type,
          content_id: content.id,
          metric_name: metric.name,
          metric_value: value,
          target_value: metric.target,
          status: status,
          measurement_tool: 'pagespeed',
          date_recorded: date.toISOString().split('T')[0]
        });
      }
    }
  }
  
  const { error } = await supabase
    .from('performance_benchmarks')
    .insert(benchmarksData);
  
  if (!error) {
    console.log(`✅ Inserted ${benchmarksData.length} performance benchmark records`);
  }
}

async function testPerformanceScoring() {
  const { data: weddings } = await supabase.from('weddings').select('id').limit(1);
  
  if (weddings && weddings[0]) {
    const { data: score, error } = await supabase.rpc('calculate_performance_score', {
      p_content_type: 'wedding',
      p_content_id: weddings[0].id
    });
    
    if (error) {
      console.error('❌ Error calculating performance score:', error);
    } else {
      console.log('✅ Performance score calculation works!');
      console.log('📊 Sample score:', score);
    }
  }
  
  // Generate summary statistics
  const { data: totalRecords } = await supabase
    .from('page_analytics')
    .select('content_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, item) => {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('\n📈 Analytics Summary:');
  if (totalRecords) {
    for (const [type, count] of totalRecords) {
      console.log(`  ${type}: ${count} analytics records`);
    }
  }
  
  // AI Agent interaction summary
  const { data: aiStats } = await supabase
    .from('ai_agent_interactions')
    .select('agent_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, item) => {
        acc[item.agent_type] = (acc[item.agent_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('\n🤖 AI Agent Interactions:');
  if (aiStats) {
    for (const [agent, count] of aiStats) {
      console.log(`  ${agent}: ${count} interactions`);
    }
  }
}

// Run analytics seeding
if (require.main === module) {
  seedAnalyticsData().catch(console.error);
}

export { seedAnalyticsData };
