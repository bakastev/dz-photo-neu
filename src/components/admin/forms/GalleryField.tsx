'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, GripVertical, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadMultipleImages, resizeImage, deleteImage } from '@/lib/upload';
import { getImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GalleryFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  folder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxImages?: number;
}

interface SortableImageProps {
  id: string;
  url: string;
  onRemove: () => void;
  disabled?: boolean;
}

function SortableImage({ id, url, onRemove, disabled }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative aspect-square rounded-lg overflow-hidden group',
        isDragging && 'z-50 shadow-2xl'
      )}
    >
      <Image
        src={getImageUrl(url)}
        alt="Gallery image"
        fill
        className="object-cover"
      />
      
      {/* Overlay with actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 cursor-grab active:cursor-grabbing"
          disabled={disabled}
        >
          <GripVertical className="w-4 h-4 text-white" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500"
          disabled={disabled}
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

export default function GalleryField({
  label,
  value,
  onChange,
  folder = 'uploads',
  error,
  required,
  disabled,
  maxImages = 50,
}: GalleryFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpload = useCallback(async (files: File[]) => {
    if (value.length + files.length > maxImages) {
      setUploadError(`Maximal ${maxImages} Bilder erlaubt`);
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Resize all images
      const resizedFiles = await Promise.all(
        files.map(file => resizeImage(file, 1920, 1080))
      );

      // Upload all images
      const results = await uploadMultipleImages(resizedFiles, folder, (index, progress) => {
        setUploadProgress(Math.round(((index + progress.percentage / 100) / files.length) * 100));
      });

      // Add successful uploads to gallery
      const newUrls = results
        .filter(r => r.success && r.url)
        .map(r => r.url!);

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }

      // Report errors
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        setUploadError(`${errors.length} von ${files.length} Uploads fehlgeschlagen`);
      }
    } catch (err) {
      setUploadError('Upload fehlgeschlagen');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [folder, maxImages, onChange, value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleUpload(files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      handleUpload(files);
    }
  }, [handleUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string);
      const newIndex = value.indexOf(over.id as string);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-white flex items-center gap-1">
          {label}
          {required && <span className="text-red-400">*</span>}
        </Label>
        <span className="text-sm text-gray-500">
          {value.length} / {maxImages} Bilder
        </span>
      </div>

      {/* Gallery Grid */}
      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {value.map((url, index) => (
                <SortableImage
                  key={url}
                  id={url}
                  url={url}
                  onRemove={() => handleRemove(index)}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors',
          dragOver ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/20 hover:border-white/40',
          error && 'border-red-500',
          disabled && 'opacity-50 pointer-events-none'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="flex flex-col items-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || disabled}
          />
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mb-2" />
              <p className="text-gray-400">Wird hochgeladen... {uploadProgress}%</p>
              <div className="w-48 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-gray-400 text-center">
                Bilder hierher ziehen oder <span className="text-[#D4AF37]">klicken</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Mehrere Bilder auswählbar • JPG, PNG, WebP bis 10MB
              </p>
            </>
          )}
        </label>
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-red-400">{error || uploadError}</p>
      )}
    </div>
  );
}



