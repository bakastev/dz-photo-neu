/**
 * Script to upload all downloaded images to Supabase Storage buckets
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS
const supabaseUrl = 'https://qljgbskxopjkivkcuypu.supabase.co';
// You need to provide the service role key here
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.log('⚠️ SUPABASE_SERVICE_ROLE_KEY not set. Please provide it as environment variable.');
  console.log('Usage: SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx migration-scripts/upload-images-to-storage.ts');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads', 'images');

// Map local folder names to storage bucket names
const BUCKET_MAPPING: Record<string, string> = {
  'weddings': 'weddings',
  'locations': 'locations', 
  'blog': 'blog',
  'reviews': 'reviews',
  'pages': 'pages',
  'page': 'pages'
};

async function ensureBucketExists(bucketName: string) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === bucketName);
  
  if (!exists) {
    console.log(`  Creating bucket: ${bucketName}`);
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true
    });
    if (error && !error.message.includes('already exists')) {
      console.error(`  Error creating bucket ${bucketName}:`, error);
    }
  }
}

async function uploadFile(bucketName: string, filePath: string, fileName: string): Promise<boolean> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (error) {
      if (error.message.includes('already exists')) {
        return true; // Already uploaded
      }
      console.error(`  ❌ Error uploading ${fileName}:`, error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`  ❌ Error reading/uploading ${fileName}:`, err);
    return false;
  }
}

async function uploadFolder(folderName: string) {
  const bucketName = BUCKET_MAPPING[folderName] || folderName;
  const folderPath = path.join(DOWNLOADS_DIR, folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`  ⚠️ Folder not found: ${folderPath}`);
    return { uploaded: 0, failed: 0 };
  }
  
  await ensureBucketExists(bucketName);
  
  const files = fs.readdirSync(folderPath).filter(f => 
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );
  
  console.log(`\n📁 Uploading ${files.length} files from ${folderName} to ${bucketName}...`);
  
  let uploaded = 0;
  let failed = 0;
  
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const success = await uploadFile(bucketName, filePath, file);
    
    if (success) {
      uploaded++;
      if (uploaded % 10 === 0) {
        console.log(`  ✅ Uploaded ${uploaded}/${files.length} files...`);
      }
    } else {
      failed++;
    }
  }
  
  console.log(`  📊 ${folderName}: ${uploaded} uploaded, ${failed} failed`);
  return { uploaded, failed };
}

async function main() {
  console.log('🚀 Starting image upload to Supabase Storage...');
  console.log(`📁 Source directory: ${DOWNLOADS_DIR}`);
  
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    console.error('❌ Downloads directory not found!');
    process.exit(1);
  }
  
  const folders = fs.readdirSync(DOWNLOADS_DIR).filter(f => 
    fs.statSync(path.join(DOWNLOADS_DIR, f)).isDirectory()
  );
  
  console.log(`📂 Found folders: ${folders.join(', ')}`);
  
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const folder of folders) {
    const { uploaded, failed } = await uploadFolder(folder);
    totalUploaded += uploaded;
    totalFailed += failed;
  }
  
  console.log('\n✅ Upload complete!');
  console.log(`📊 Total: ${totalUploaded} uploaded, ${totalFailed} failed`);
}

main().catch(console.error);




