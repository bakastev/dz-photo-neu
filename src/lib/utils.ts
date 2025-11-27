import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default blur data URL for images
export const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

// Image URL helper for Supabase Storage
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://qljgbskxopjkivkcuypu.supabase.co/storage/v1/object/public/images/weddings/IMG_7982-300x200.jpg'; // Fallback to real image
  }
  
  const supabaseUrl = 'https://qljgbskxopjkivkcuypu.supabase.co';
  
  // If it's already a Supabase URL, return as is
  if (imagePath.startsWith(supabaseUrl)) {
    return imagePath;
  }
  
  // If it's a WordPress URL or contains dz-photo.at, extract filename
  if (imagePath.includes('dz-photo.at') || imagePath.startsWith('http')) {
    const filename = imagePath.split('/').pop();
    if (filename) {
      // Try to serve from Supabase Storage (images bucket with subfolders)
      return `${supabaseUrl}/storage/v1/object/public/images/weddings/${filename}`;
    }
  }
  
  // If it's a path with folder (e.g., 'weddings/image.jpg')
  if (imagePath.includes('/')) {
    return `${supabaseUrl}/storage/v1/object/public/images/${imagePath}`;
  }
  
  // Default: assume it's a filename in weddings folder
  return `${supabaseUrl}/storage/v1/object/public/images/weddings/${imagePath}`;
}

// Date formatting helper
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-AT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Text truncation helper
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// Slug generation helper
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const replacements: { [key: string]: string } = {
        'ä': 'ae',
        'ö': 'oe',
        'ü': 'ue',
        'ß': 'ss'
      };
      return replacements[match] || match;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Price formatting helper
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(price);
}

// Video helpers
export function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function generateVideoThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}