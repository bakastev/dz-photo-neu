'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlugFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  sourceValue?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  baseUrl?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export default function SlugField({
  label = 'URL-Slug',
  value,
  onChange,
  sourceValue,
  error,
  required,
  disabled,
  baseUrl = 'https://dz-photo.at',
}: SlugFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleGenerateSlug = () => {
    if (sourceValue) {
      const newSlug = generateSlug(sourceValue);
      setLocalValue(newSlug);
      onChange(newSlug);
    }
  };

  const handleBlur = () => {
    const sanitizedSlug = generateSlug(localValue);
    setLocalValue(sanitizedSlug);
    onChange(sanitizedSlug);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-white flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              setIsEditing(true);
            }}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder="url-slug"
            className={cn(
              'bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-mono text-sm',
              error && 'border-red-500'
            )}
          />
          {isEditing && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500">
              <AlertCircle className="w-4 h-4" />
            </span>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleGenerateSlug}
          disabled={disabled || !sourceValue}
          className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
          title="Slug aus Titel generieren"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Preview URL */}
      <p className="text-sm text-gray-500 font-mono truncate">
        {baseUrl}/{value || 'slug'}
      </p>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}



