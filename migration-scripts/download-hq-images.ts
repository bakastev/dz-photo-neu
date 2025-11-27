#!/usr/bin/env npx tsx
/**
 * Script 2: Download high-quality images
 * Downloads the best available version of each image
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const ANALYSIS_FILE = path.join(process.cwd(), 'comprehensive-image-analysis.json');
const OUTPUT_DIR = path.join(process.cwd(), 'downloads', 'images-hq');

const MAX_CONCURRENT = 5;
const TIMEOUT_MS = 30000;
const MIN_FILE_SIZE = 50000; // 50KB minimum for "good quality"

interface ImageVariant {
  url: string;
  width?: number;
  height?: number;
  suffix: string;
  estimatedSize: string;
}

interface ImageGroup {
  baseFilename: string;
  variants: ImageVariant[];
  bestQuality: string | null;
  contentType: string;
  slug: string;
  sourceFile: string;
}

interface AnalysisResult {
  images: ImageGroup[];
}

interface DownloadResult {
  url: string;
  localPath: string;
  size: number;
  success: boolean;
  error?: string;
}

function getBestUrl(group: ImageGroup): string | null {
  // Priority: original > scaled > large > medium
  const priority = ['original', 'scaled', 'large', 'medium'];
  
  for (const quality of priority) {
    const variant = group.variants.find(v => v.estimatedSize === quality);
    if (variant) return variant.url;
  }
  
  // Fallback to any available
  return group.variants[0]?.url || null;
}

function getOutputPath(group: ImageGroup, url: string): string {
  const filename = url.split('/').pop() || 'unknown.jpg';
  const contentDir = group.contentType === 'unknown' ? 'other' : group.contentType;
  const slugDir = group.slug === 'unknown' ? '' : group.slug;
  
  if (slugDir) {
    return path.join(OUTPUT_DIR, contentDir, slugDir, filename);
  }
  return path.join(OUTPUT_DIR, contentDir, filename);
}

async function downloadFile(url: string, outputPath: string): Promise<DownloadResult> {
  return new Promise((resolve) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Skip if already downloaded and has good size
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > MIN_FILE_SIZE) {
        resolve({
          url,
          localPath: outputPath,
          size: stats.size,
          success: true
        });
        return;
      }
    }
    
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { timeout: TIMEOUT_MS }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, outputPath).then(resolve);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        resolve({
          url,
          localPath: outputPath,
          size: 0,
          success: false,
          error: `HTTP ${response.statusCode}`
        });
        return;
      }
      
      const file = fs.createWriteStream(outputPath);
      let size = 0;
      
      response.on('data', (chunk) => {
        size += chunk.length;
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve({
          url,
          localPath: outputPath,
          size,
          success: size > 0
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        resolve({
          url,
          localPath: outputPath,
          size: 0,
          success: false,
          error: err.message
        });
      });
    });
    
    request.on('error', (err) => {
      resolve({
        url,
        localPath: outputPath,
        size: 0,
        success: false,
        error: err.message
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve({
        url,
        localPath: outputPath,
        size: 0,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function downloadBatch(items: { group: ImageGroup; url: string; outputPath: string }[]): Promise<DownloadResult[]> {
  const results: DownloadResult[] = [];
  
  for (let i = 0; i < items.length; i += MAX_CONCURRENT) {
    const batch = items.slice(i, i + MAX_CONCURRENT);
    const batchResults = await Promise.all(
      batch.map(item => downloadFile(item.url, item.outputPath))
    );
    results.push(...batchResults);
    
    // Progress
    const done = Math.min(i + MAX_CONCURRENT, items.length);
    const percent = Math.round((done / items.length) * 100);
    process.stdout.write(`\r  Progress: ${done}/${items.length} (${percent}%)`);
  }
  
  console.log(''); // New line after progress
  return results;
}

async function main() {
  console.log('📥 Downloading high-quality images...\n');
  
  if (!fs.existsSync(ANALYSIS_FILE)) {
    console.error('❌ Analysis file not found. Run analyze-image-sources.ts first.');
    process.exit(1);
  }
  
  const analysis: AnalysisResult = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf-8'));
  
  // Prepare download list
  const downloadList: { group: ImageGroup; url: string; outputPath: string }[] = [];
  
  for (const group of analysis.images) {
    const url = getBestUrl(group);
    if (!url) continue;
    
    const outputPath = getOutputPath(group, url);
    downloadList.push({ group, url, outputPath });
  }
  
  console.log(`📋 Total images to download: ${downloadList.length}`);
  
  // Group by content type for reporting
  const byType: Record<string, number> = {};
  downloadList.forEach(item => {
    byType[item.group.contentType] = (byType[item.group.contentType] || 0) + 1;
  });
  
  console.log('\n📁 By content type:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log('\n🚀 Starting downloads...\n');
  
  // Download by content type for better organization
  const contentTypes = ['location', 'wedding', 'fotobox', 'blog', 'unknown'];
  const allResults: DownloadResult[] = [];
  
  for (const type of contentTypes) {
    const typeItems = downloadList.filter(item => item.group.contentType === type);
    if (typeItems.length === 0) continue;
    
    console.log(`\n📂 Downloading ${type} images (${typeItems.length})...`);
    const results = await downloadBatch(typeItems);
    allResults.push(...results);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    
    console.log(`  ✅ Success: ${successful}, ❌ Failed: ${failed}`);
    console.log(`  📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Summary
  console.log('\n📊 DOWNLOAD SUMMARY\n');
  
  const successful = allResults.filter(r => r.success);
  const failed = allResults.filter(r => !r.success);
  const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
  const avgSize = successful.length > 0 ? totalSize / successful.length : 0;
  
  console.log(`✅ Successfully downloaded: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📏 Average file size: ${(avgSize / 1024).toFixed(2)} KB`);
  
  // Quality check
  const smallFiles = successful.filter(r => r.size < MIN_FILE_SIZE);
  if (smallFiles.length > 0) {
    console.log(`\n⚠️ ${smallFiles.length} files are smaller than ${MIN_FILE_SIZE / 1000}KB (might be thumbnails)`);
  }
  
  // Save results
  const resultsFile = path.join(process.cwd(), 'download-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify({
    successful: successful.map(r => ({ url: r.url, path: r.localPath, size: r.size })),
    failed: failed.map(r => ({ url: r.url, error: r.error })),
    summary: {
      total: allResults.length,
      successful: successful.length,
      failed: failed.length,
      totalSizeBytes: totalSize
    }
  }, null, 2));
  
  console.log(`\n✅ Results saved to: ${resultsFile}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    failed.slice(0, 10).forEach(r => {
      console.log(`  ${r.url}: ${r.error}`);
    });
    if (failed.length > 10) {
      console.log(`  ... and ${failed.length - 10} more`);
    }
  }
}

main().catch(console.error);

