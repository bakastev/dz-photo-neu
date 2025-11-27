import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;
    
    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // Search for the image in all category directories
    const downloadsDir = path.join(process.cwd(), 'downloads', 'images');
    const categories = ['weddings', 'locations', 'blog', 'reviews', 'pages'];
    
    let imagePath: string | null = null;
    
    for (const category of categories) {
      const categoryPath = path.join(downloadsDir, category, filename);
      if (fs.existsSync(categoryPath)) {
        imagePath = categoryPath;
        break;
      }
    }
    
    if (!imagePath || !fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg';
    
    if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
