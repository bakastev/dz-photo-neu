import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required. Please check .env.local');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Bilder von der alten Landing Page - korrekte URLs OHNE /sites/24/
const images = [
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DDZ_7751-scaled-1-1536x1024.jpg',
    filename: 'lp-hero-DDZ_7751-scaled-1.jpg',
    folder: 'landing-page',
    usage: 'hero'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DDZ_1292-1024x683.jpg',
    filename: 'lp-portfolio-DDZ_1292.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DDZ_0042-23-1536x1024.jpg',
    filename: 'lp-portfolio-DDZ_0042-23.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZR50295-scaled-1-1536x1024.jpg',
    filename: 'lp-portfolio-DZR50295-scaled-1.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZR52761-1024x683.jpg',
    filename: 'lp-portfolio-DZR52761.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZR52973-1024x683.jpg',
    filename: 'lp-portfolio-DZR52973.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZ_6672-10-1024x1536.jpg',
    filename: 'lp-portfolio-DZ_6672-10.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DDZ_0106-1-1536x1024.jpg',
    filename: 'lp-portfolio-DDZ_0106-1.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DDZ_0226-25-1024x1536.jpg',
    filename: 'lp-portfolio-DDZ_0226-25.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZ_6740-14-1024x1536.jpg',
    filename: 'lp-portfolio-DZ_6740-14.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZR68020-scaled-1-1536x1024.jpg',
    filename: 'lp-portfolio-DZR68020-scaled-1.jpg',
    folder: 'landing-page',
    usage: 'portfolio'
  },
  {
    url: 'https://www.dz-photo.at/hochzeit/wp-content/uploads/2023/10/DZ_5066-2-705x470-1.jpg',
    filename: 'lp-about-DZ_5066-2.jpg',
    folder: 'landing-page',
    usage: 'about'
  },
];

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToSupabase(buffer: Buffer, filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${filePath}: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

async function main() {
  console.log('Starting image download and upload...\n');

  const uploadedImages: Array<{ filename: string; url: string }> = [];

  for (const image of images) {
    try {
      console.log(`Downloading ${image.filename} from ${image.url}...`);
      const buffer = await downloadImage(image.url);
      console.log(`  📦 Downloaded: ${(buffer.length / 1024).toFixed(2)} KB`);
      
      const filePath = `${image.folder}/${image.filename}`;
      console.log(`Uploading to Supabase: ${filePath}...`);
      
      const publicUrl = await uploadToSupabase(buffer, filePath);
      uploadedImages.push({ 
        filename: image.filename, 
        url: publicUrl,
        usage: image.usage
      });
      
      console.log(`✅ Success: ${image.filename} (${image.usage})`);
      console.log(`   🔗 URL: ${publicUrl}\n`);
    } catch (error) {
      console.error(`❌ Error processing ${image.filename}:`, error);
    }
  }

  console.log('\n=== Upload Summary ===');
  console.log(JSON.stringify(uploadedImages, null, 2));
}

main().catch(console.error);

