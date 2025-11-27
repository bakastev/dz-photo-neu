#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

interface ImageUrl {
  url: string;
  contentType: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page';
  slug: string;
  filename: string;
}

async function collectImageUrls() {
  console.log('🖼️ Collecting image URLs from metadata...');
  
  const imageUrls: ImageUrl[] = [];
  const analysisPath = path.join(__dirname, '../analysis-results.json');
  const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
  
  // Process each content type
  for (const [contentType, items] of Object.entries(analysis.grouped)) {
    if (contentType === 'other') continue;
    
    for (const item of items as any[]) {
      const metadataPath = path.join(__dirname, '../dz-photo-alt/metadata', item.filename);
      
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        
        // Try to load corresponding HTML file to extract images
        const htmlFilename = item.filename.replace('__metadata.json', '.html');
        const htmlPath = path.join(__dirname, '../dz-photo-alt/html', htmlFilename);
        
        if (fs.existsSync(htmlPath)) {
          const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
          const $ = cheerio.load(htmlContent);
          
          // Extract all WordPress images
          $('img').each((i, img) => {
            const src = $(img).attr('src');
            if (src && src.includes('wp-content/uploads')) {
              imageUrls.push({
                url: src,
                contentType: contentType as any,
                slug: item.slug,
                filename: path.basename(src)
              });
            }
          });
        } else {
          console.log(`⚠️ HTML file not found: ${htmlPath}`);
        }
      }
    }
  }
  
  // Remove duplicates
  const uniqueUrls = Array.from(
    new Map(imageUrls.map(img => [img.url, img])).values()
  );
  
  console.log(`📊 Found ${uniqueUrls.length} unique images (${imageUrls.length} total)`);
  
  // Group by content type
  const grouped = uniqueUrls.reduce((acc, img) => {
    if (!acc[img.contentType]) acc[img.contentType] = [];
    acc[img.contentType].push(img);
    return acc;
  }, {} as Record<string, ImageUrl[]>);
  
  // Print statistics
  console.log('\n📈 Images by content type:');
  for (const [type, images] of Object.entries(grouped)) {
    console.log(`${type}: ${images.length} images`);
  }
  
  // Save results
  const results = {
    total: uniqueUrls.length,
    grouped,
    allImages: uniqueUrls
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../image-urls.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✅ Image URLs collected and saved to image-urls.json');
  
  // Create sample download script
  createDownloadScript(uniqueUrls.slice(0, 10)); // Sample first 10 images
  
  return results;
}

function createDownloadScript(sampleImages: ImageUrl[]) {
  const downloadScript = `#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

// Sample image download script
const sampleImages = ${JSON.stringify(sampleImages, null, 2)};

async function downloadSampleImages() {
  console.log('📥 Downloading sample images...');
  
  const downloadDir = path.join(__dirname, '../downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  for (const image of sampleImages) {
    try {
      console.log(\`Downloading: \${image.filename}\`);
      
      const response = await fetch(image.url);
      if (response.ok) {
        const buffer = await response.buffer();
        const filePath = path.join(downloadDir, image.filename);
        fs.writeFileSync(filePath, buffer);
        console.log(\`✅ Downloaded: \${image.filename}\`);
      } else {
        console.log(\`❌ Failed to download: \${image.filename} (Status: \${response.status})\`);
      }
    } catch (error) {
      console.error(\`❌ Error downloading \${image.filename}:\`, error);
    }
  }
  
  console.log('✅ Sample download completed!');
}

if (require.main === module) {
  downloadSampleImages().catch(console.error);
}
`;

  fs.writeFileSync(
    path.join(__dirname, 'download-sample-images.ts'),
    downloadScript
  );
  
  console.log('📝 Created sample download script: download-sample-images.ts');
}

// Run collection
if (require.main === module) {
  collectImageUrls().catch(console.error);
}

export { collectImageUrls };
