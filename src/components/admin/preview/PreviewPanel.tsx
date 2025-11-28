'use client';

import { usePreview } from '../PreviewProvider';
import { Monitor, Tablet, Smartphone, X, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WeddingPreview from './WeddingPreview';
import LocationPreview from './LocationPreview';
import BlogPreview from './BlogPreview';

interface PreviewPanelProps {
  type: 'wedding' | 'location' | 'blog' | 'fotobox' | 'review' | 'page';
  slug?: string;
}

const deviceWidths = {
  desktop: 'w-full',
  tablet: 'w-[768px]',
  mobile: 'w-[375px]',
};

export default function PreviewPanel({ type, slug }: PreviewPanelProps) {
  const { isPreviewOpen, setIsPreviewOpen, previewMode, setPreviewMode, previewData } = usePreview();

  if (!isPreviewOpen) return null;

  const PreviewComponent = {
    wedding: WeddingPreview,
    location: LocationPreview,
    blog: BlogPreview,
    fotobox: BlogPreview, // Fallback
    review: BlogPreview,  // Fallback
    page: BlogPreview,    // Fallback
  }[type];

  const getPreviewUrl = () => {
    if (!slug) return null;
    const routes: Record<string, string> = {
      wedding: `/hochzeit/${slug}`,
      location: `/locations/${slug}`,
      blog: `/blog/${slug}`,
      fotobox: `/fotobox/${slug}`,
    };
    return routes[type] || null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold">Live-Vorschau</h2>
            
            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-[#0A0A0A] rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  previewMode === 'desktop' 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'text-gray-400 hover:text-white'
                )}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  previewMode === 'tablet' 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'text-gray-400 hover:text-white'
                )}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  previewMode === 'mobile' 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'text-gray-400 hover:text-white'
                )}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {previewUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Im Browser öffnen
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPreviewOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-auto bg-[#1a1a1a] p-4 flex justify-center">
          <div 
            className={cn(
              'bg-[#0A0A0A] rounded-lg overflow-auto shadow-2xl transition-all duration-300',
              deviceWidths[previewMode],
              previewMode !== 'desktop' && 'max-h-full'
            )}
            style={{
              height: previewMode === 'mobile' ? '667px' : previewMode === 'tablet' ? '1024px' : 'auto',
            }}
          >
            <PreviewComponent />
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#141414] flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <span>
              Ansicht: {previewMode === 'desktop' ? 'Desktop' : previewMode === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'}
            </span>
            <span>•</span>
            <span>
              Typ: {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <RefreshCw className="w-4 h-4" />
            <span>Automatische Aktualisierung aktiv</span>
          </div>
        </div>
      </div>
    </div>
  );
}



