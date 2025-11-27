'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadImage, resizeImage } from '@/lib/upload';
import { getImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ImageFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  folder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  maxWidth?: number;
  maxHeight?: number;
}

export default function ImageField({
  label,
  value,
  onChange,
  folder = 'uploads',
  error,
  required,
  disabled,
  aspectRatio = 'video',
  maxWidth = 1920,
  maxHeight = 1080,
}: ImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'min-h-[200px]',
  };

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      // Resize image before upload
      const resizedFile = await resizeImage(file, maxWidth, maxHeight);
      
      // Upload to Supabase
      const result = await uploadImage(resizedFile, folder);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setUploadError(result.error || 'Upload fehlgeschlagen');
      }
    } catch (err) {
      setUploadError('Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  }, [folder, maxWidth, maxHeight, onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-white flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>

      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg overflow-hidden transition-colors',
          aspectRatioClasses[aspectRatio],
          dragOver ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/20 hover:border-white/40',
          error && 'border-red-500',
          disabled && 'opacity-50 pointer-events-none'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value ? (
          // Image Preview
          <div className="relative w-full h-full">
            <Image
              src={getImageUrl(value)}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="pointer-events-none"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Ersetzen
                </Button>
              </label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="w-4 h-4 mr-2" />
                Entfernen
              </Button>
            </div>
          </div>
        ) : (
          // Upload Area
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-2" />
                <p className="text-gray-400">Wird hochgeladen...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                <p className="text-gray-400 text-center px-4">
                  Bild hierher ziehen oder <span className="text-[#D4AF37]">klicken</span> zum Hochladen
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  JPG, PNG, WebP bis 10MB
                </p>
              </>
            )}
          </label>
        )}
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-red-400">{error || uploadError}</p>
      )}
    </div>
  );
}

