'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface PreviewData {
  // Common fields
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  featured?: boolean;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  
  // Wedding specific
  coupleNames?: string;
  weddingDate?: Date | null;
  location?: string;
  
  // Location specific
  name?: string;
  city?: string;
  region?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  capacityMin?: number;
  capacityMax?: number;
  
  // Blog specific
  excerpt?: string;
  category?: string;
  tags?: string[];
  publishedAt?: Date | null;
  featuredImage?: string;
}

interface PreviewContextType {
  previewData: PreviewData;
  updatePreview: (data: Partial<PreviewData>) => void;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}

interface PreviewProviderProps {
  children: React.ReactNode;
  initialData?: PreviewData;
}

export function PreviewProvider({ children, initialData = {} }: PreviewProviderProps) {
  const [previewData, setPreviewData] = useState<PreviewData>(initialData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const updatePreview = useCallback((data: Partial<PreviewData>) => {
    setPreviewData(prev => ({ ...prev, ...data }));
  }, []);

  const value = useMemo(() => ({
    previewData,
    updatePreview,
    isPreviewOpen,
    setIsPreviewOpen,
    previewMode,
    setPreviewMode,
  }), [previewData, updatePreview, isPreviewOpen, previewMode]);

  return (
    <PreviewContext.Provider value={value}>
      {children}
    </PreviewContext.Provider>
  );
}

