import { createBrowserSupabaseClient } from './auth-client';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

const BUCKET_NAME = 'images';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'jpg';
}

export function generateFilename(originalName: string, folder: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  return `${folder}/${timestamp}-${randomString}.${extension}`;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Ungültiger Dateityp. Erlaubt: ${ALLOWED_TYPES.map(t => t.replace('image/', '')).join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Datei zu groß. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

export async function uploadImage(
  file: File,
  folder: string = 'uploads',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const supabase = createBrowserSupabaseClient();
  const path = generateFilename(file.name, folder);

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return { success: false, error: 'Upload fehlgeschlagen' };
  }
}

export async function uploadMultipleImages(
  files: File[],
  folder: string = 'uploads',
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], folder, (progress) => {
      onProgress?.(i, progress);
    });
    results.push(result);
  }

  return results;
}

export async function deleteImage(path: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient();

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete exception:', err);
    return false;
  }
}

export async function listImages(folder: string): Promise<{ name: string; url: string }[]> {
  const supabase = createBrowserSupabaseClient();

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data
      .filter(file => !file.name.startsWith('.'))
      .map(file => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${folder}/${file.name}`);
        
        return {
          name: file.name,
          url: urlData.publicUrl,
        };
      });
  } catch (err) {
    console.error('List exception:', err);
    return [];
  }
}

// Resize image client-side before upload
export async function resizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

