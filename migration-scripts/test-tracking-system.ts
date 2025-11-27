#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function testTrackingSystem() {
  console.log('🔍 Testing Server-Side Tracking System...');
  
  // 1. Test tracking event creation
  console.log('\n📊 Testing tracking event creation...');
  await testEventCreation();
  
  // 2. Test deduplication
  console.log('\n🔄 Testing deduplication...');
  await testDeduplication();
  
  // 3. Test API queue processing
  console.log('\n⚡ Testing API queue processing...');
  await testQueueProcessing();
  
  // 4. Test tracking statistics
  console.log('\n📈 Testing tracking statistics...');
  await testTrackingStatistics();
  
  // 5. Show configuration
  console.log('\n⚙️ Current tracking configuration:');
  await showTrackingConfig();
  
  console.log('\n✅ Tracking system testing completed!');
}

async function testEventCreation() {
  const sessionId = `test_session_${Date.now()}`;
  
  // Test different event types
  const testEvents = [
    {
      event_type: 'page_view',
      event_name: 'PageView',
      page_url: 'https://www.dz-photo.at/',
      page_title: 'Daniel Zangerle - Hochzeitsfotograf',
      content_type: 'page',
      event_parameters: { page_category: 'homepage' }
    },
    {
      event_type: 'portfolio_view',
      event_name: 'ViewContent',
      page_url: 'https://www.dz-photo.at/hochzeit/martina-christoph',
      page_title: 'Hochzeit Martina & Christoph',
      content_type: 'wedding',
      event_parameters: { 
        content_category: 'wedding',
        value: 1500,
        currency: 'EUR'
      }
    },
    {
      event_type: 'contact_form_submit',
      event_name: 'Lead',
      page_url: 'https://www.dz-photo.at/kontakt',
      page_title: 'Kontakt - Daniel Zangerle',
      content_type: 'page',
      event_parameters: { 
        form_type: 'contact',
        lead_value: 500,
        currency: 'EUR'
      }
    }
  ];
  
  let createdEvents = 0;
  
  for (const eventData of testEvents) {
    try {
      const { data: eventId, error } = await supabase.rpc('create_tracking_event', {
        p_event_type: eventData.event_type,
        p_event_name: eventData.event_name,
        p_session_id: sessionId,
        p_page_url: eventData.page_url,
        p_page_title: eventData.page_title,
        p_content_type: eventData.content_type,
        p_event_parameters: eventData.event_parameters,
        p_user_agent: 'Mozilla/5.0 (Test Browser)',
        p_ip_address: '192.168.1.100',
        p_referrer: 'https://www.google.com',
        p_utm_source: 'google',
        p_utm_medium: 'organic',
        p_utm_campaign: 'test_campaign',
        p_consent_given: true,
        p_consent_categories: ['analytics', 'marketing'],
        p_client_id: 'test_client_123',
        p_facebook_browser_id: 'fb.1.1234567890.987654321',
        p_facebook_click_id: 'fb.1.1234567890.click123'
      });
      
      if (error) {
        console.error(`❌ Error creating ${eventData.event_type}:`, error);
      } else {
        console.log(`✅ Created ${eventData.event_type} event: ${eventId}`);
        createdEvents++;
      }
    } catch (error) {
      console.error(`❌ Exception creating ${eventData.event_type}:`, error);
    }
  }
  
  console.log(`📊 Created ${createdEvents}/${testEvents.length} test events`);
}

async function testDeduplication() {
  const sessionId = `dedup_test_${Date.now()}`;
  const eventData = {
    event_type: 'page_view',
    event_name: 'PageView',
    page_url: 'https://www.dz-photo.at/test-dedup',
    page_title: 'Deduplication Test',
    content_type: 'page'
  };
  
  // Create same event multiple times
  const eventIds = [];
  
  for (let i = 0; i < 3; i++) {
    const { data: eventId, error } = await supabase.rpc('create_tracking_event', {
      p_event_type: eventData.event_type,
      p_event_name: eventData.event_name,
      p_session_id: sessionId,
      p_page_url: eventData.page_url,
      p_page_title: eventData.page_title,
      p_content_type: eventData.content_type,
      p_consent_given: true,
      p_consent_categories: ['analytics']
    });
    
    if (!error) {
      eventIds.push(eventId);
    }
  }
  
  // Check if deduplication worked (should have same event ID)
  const uniqueIds = [...new Set(eventIds)];
  
  if (uniqueIds.length === 1) {
    console.log('✅ Deduplication working correctly - same event ID returned');
  } else {
    console.log('❌ Deduplication failed - multiple event IDs created:', uniqueIds);
  }
}

async function testQueueProcessing() {
  // Check API queue status
  const { data: queueItems, error } = await supabase
    .from('tracking_api_queue')
    .select('platform, status');
  
  if (error) {
    console.error('❌ Error fetching queue status:', error);
    return;
  }
  
  console.log('📋 API Queue Status:');
  if (queueItems && queueItems.length > 0) {
    // Group by platform and status
    const grouped = queueItems.reduce((acc: any, item: any) => {
      const key = `${item.platform}_${item.status}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([key, count]) => {
      const [platform, status] = key.split('_');
      console.log(`  ${platform}: ${count} ${status} events`);
    });
  } else {
    console.log('  No items in queue');
  }
  
  // Test queue processing function
  const { data: processedCount, error: processError } = await supabase.rpc('process_tracking_queue', {
    p_batch_size: 5,
    p_platform: null
  });
  
  if (processError) {
    console.error('❌ Error processing queue:', processError);
  } else {
    console.log(`✅ Processed ${processedCount} queue items`);
  }
}

async function testTrackingStatistics() {
  const { data: stats, error } = await supabase.rpc('get_tracking_statistics', {
    p_date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    p_date_to: new Date().toISOString().split('T')[0]
  });
  
  if (error) {
    console.error('❌ Error fetching statistics:', error);
    return;
  }
  
  console.log('📊 Tracking Statistics (Last 7 days):');
  console.log(`  Total Events: ${stats.overview.total_events}`);
  console.log(`  Consented Events: ${stats.overview.consented_events}`);
  console.log(`  Unique Sessions: ${stats.overview.unique_sessions}`);
  console.log(`  Facebook Sent: ${stats.overview.facebook_sent}`);
  console.log(`  Google Sent: ${stats.overview.google_sent}`);
  
  if (stats.event_types && stats.event_types.length > 0) {
    console.log('\n📈 Event Types:');
    stats.event_types.forEach((type: any) => {
      console.log(`  ${type.type}: ${type.count} events`);
    });
  }
  
  if (stats.queue_status && stats.queue_status.length > 0) {
    console.log('\n⚡ Queue Status:');
    stats.queue_status.forEach((status: any) => {
      console.log(`  ${status.platform} ${status.status}: ${status.count}`);
    });
  }
}

async function showTrackingConfig() {
  const { data: config, error } = await supabase
    .from('tracking_config')
    .select('config_key, config_value, description, is_active')
    .eq('is_active', true)
    .order('config_key');
  
  if (error) {
    console.error('❌ Error fetching config:', error);
    return;
  }
  
  console.log('⚙️ Active Tracking Configuration:');
  config?.forEach((item: any) => {
    // Mask sensitive values
    let displayValue = item.config_value;
    if (item.config_key.includes('token') || item.config_key.includes('secret')) {
      displayValue = item.config_value.substring(0, 10) + '...';
    }
    
    console.log(`  ${item.config_key}: ${displayValue}`);
    if (item.description) {
      console.log(`    └─ ${item.description}`);
    }
  });
}

async function seedSampleTrackingData() {
  console.log('\n🌱 Seeding sample tracking data...');
  
  const sampleSessions = [
    'session_organic_google',
    'session_facebook_ad',
    'session_instagram_story',
    'session_direct_visit',
    'session_email_campaign'
  ];
  
  const sampleEvents = [
    { type: 'page_view', name: 'PageView' },
    { type: 'portfolio_view', name: 'ViewContent' },
    { type: 'contact_form_submit', name: 'Lead' },
    { type: 'email_click', name: 'Contact' },
    { type: 'phone_click', name: 'Contact' }
  ];
  
  const samplePages = [
    { url: 'https://www.dz-photo.at/', title: 'Homepage', type: 'page' },
    { url: 'https://www.dz-photo.at/hochzeit/martina-christoph', title: 'Hochzeit Martina & Christoph', type: 'wedding' },
    { url: 'https://www.dz-photo.at/locations/vedahof', title: 'Vedahof Location', type: 'location' },
    { url: 'https://www.dz-photo.at/tipp/25-flipflops', title: 'Tipp 25: Flipflops', type: 'blog' },
    { url: 'https://www.dz-photo.at/fotobox', title: 'Fotobox Service', type: 'fotobox' }
  ];
  
  let seededEvents = 0;
  
  for (let i = 0; i < 20; i++) {
    const session = sampleSessions[Math.floor(Math.random() * sampleSessions.length)];
    const event = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    const page = samplePages[Math.floor(Math.random() * samplePages.length)];
    
    const utmSources = ['google', 'facebook', 'instagram', 'direct', 'email'];
    const utmMediums = ['organic', 'cpc', 'social', 'email', 'referral'];
    
    const utmSource = utmSources[Math.floor(Math.random() * utmSources.length)];
    const utmMedium = utmMediums[Math.floor(Math.random() * utmMediums.length)];
    
    try {
      const { data: eventId, error } = await supabase.rpc('create_tracking_event', {
        p_event_type: event.type,
        p_event_name: event.name,
        p_session_id: `${session}_${Math.floor(i / 3)}`, // Group events by session
        p_page_url: page.url,
        p_page_title: page.title,
        p_content_type: page.type,
        p_event_parameters: {
          value: Math.floor(Math.random() * 1000) + 100,
          currency: 'EUR',
          content_category: page.type
        },
        p_user_agent: 'Mozilla/5.0 (Sample Browser)',
        p_ip_address: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        p_referrer: utmSource === 'direct' ? null : `https://www.${utmSource}.com`,
        p_utm_source: utmSource,
        p_utm_medium: utmMedium,
        p_utm_campaign: 'hochzeitsfotografie_2024',
        p_consent_given: Math.random() > 0.2, // 80% consent rate
        p_consent_categories: Math.random() > 0.3 ? ['analytics', 'marketing'] : ['analytics'],
        p_client_id: `client_${Math.floor(Math.random() * 1000)}`,
        p_facebook_browser_id: `fb.1.${Date.now()}.${Math.floor(Math.random() * 1000000)}`,
        p_facebook_click_id: Math.random() > 0.7 ? `fb.1.${Date.now()}.click${Math.floor(Math.random() * 1000)}` : null
      });
      
      if (!error) {
        seededEvents++;
      }
    } catch (error) {
      // Continue on error
    }
  }
  
  console.log(`✅ Seeded ${seededEvents} sample tracking events`);
}

// Run tracking system test
if (require.main === module) {
  seedSampleTrackingData()
    .then(() => testTrackingSystem())
    .catch(console.error);
}

export { testTrackingSystem };
