#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function testSingleUpload() {
  console.log('🧪 Testing single image upload...\n');

  const testFile = path.join(process.cwd(), 'downloads', 'images', 'weddings', 'IMG_7982-300x200.jpg');
  
  if (!fs.existsSync(testFile)) {
    console.log('❌ Test file not found');
    return;
  }

  console.log('📁 Test file:', testFile);
  
  try {
    const fileBuffer = fs.readFileSync(testFile);
    console.log('📏 File size:', fileBuffer.length, 'bytes');
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload('weddings/test-IMG_7982-300x200.jpg', fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.log('❌ Upload error:', error);
    } else {
      console.log('✅ Upload successful:', data);
      
      // Test public URL
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl('weddings/test-IMG_7982-300x200.jpg');
      
      console.log('🔗 Public URL:', publicUrlData.publicUrl);
    }
    
  } catch (err) {
    console.log('💥 Exception:', err);
  }
}

testSingleUpload().catch(console.error);
