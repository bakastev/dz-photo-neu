#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Test Supabase connection
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  // Test insert a sample wedding
  const testWedding = {
    slug: 'test-wedding',
    title: 'Test Wedding',
    couple_names: 'Test Couple',
    published: true,
    meta_title: 'Test Wedding'
  };
  
  const { data, error } = await supabase
    .from('weddings')
    .insert(testWedding)
    .select();
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!', data);
    
    // Clean up test data
    await supabase
      .from('weddings')
      .delete()
      .eq('slug', 'test-wedding');
    
    console.log('🧹 Test data cleaned up');
  }
}

testConnection().catch(console.error);
