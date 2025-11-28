import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config(); // Also try root .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  console.error('💡 Please set SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadFotoboxVideo() {
  console.log('🎥 Uploading Fotobox video to Supabase Storage...\n');

  // Try multiple possible paths
  const possiblePaths = [
    '/tmp/fotobox-video.mp4',
    path.join(process.cwd(), 'public/videos/fotobox-video.mp4'),
    path.join(process.cwd(), 'downloads/fotobox-video.mp4'),
  ];

  let videoPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      videoPath = p;
      break;
    }
  }

  const storagePath = 'videos/fotobox-video.mp4';

  if (!videoPath) {
    console.error(`❌ Video file not found in any of these locations:`);
    possiblePaths.forEach(p => console.log(`   - ${p}`));
    console.log('\n💡 Please download the video first:');
    console.log('   curl -o /tmp/fotobox-video.mp4 "https://www.dz-photo.at/wp-content/uploads/Fotoboxvideo.mp4"');
    process.exit(1);
  }

  console.log(`📁 Using video from: ${videoPath}`);

  try {
    const fileBuffer = fs.readFileSync(videoPath);
    const fileSize = fileBuffer.length;
    
    console.log(`📏 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📤 Uploading to storage path: ${storagePath}...`);

    // Check if images bucket exists, if not create it
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }

    const imagesBucket = buckets?.find(b => b.name === 'images');
    if (!imagesBucket) {
      console.log('📦 Creating images bucket...');
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        return;
      }
    }

    // Delete existing file if it exists
    const { error: removeError } = await supabase.storage
      .from('images')
      .remove([storagePath]);
    
    if (removeError && !removeError.message.includes('not found')) {
      console.log(`⚠️  Warning removing existing file: ${removeError.message}`);
    }

    // Upload video
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error(`❌ Upload failed: ${error.message}`);
      console.error('Error details:', error);
      return;
    }

    console.log(`✅ Video uploaded successfully: ${data.path}`);

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    console.log(`\n🔗 Public URL: ${publicUrl.publicUrl}`);
    console.log('\n✅ Video upload completed!');
    console.log(`\n💡 Use this URL in your component: ${publicUrl.publicUrl}`);

  } catch (err: any) {
    console.error(`💥 Exception: ${err.message}`);
    console.error(err);
  }
}

uploadFotoboxVideo().catch(console.error);

