'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Upload,
  Search,
  Folder,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadImage, resizeImage } from '@/lib/upload';

interface MediaFile {
  name: string;
  url: string;
  folder: string;
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  multiple?: boolean;
  onSelectMultiple?: (urls: string[]) => void;
  defaultFolder?: string;
}

const FOLDERS = [
  { name: 'Alle', value: '' },
  { name: 'Hochzeiten', value: 'wedding' },
  { name: 'Locations', value: 'location' },
  { name: 'Blog', value: 'blog' },
  { name: 'Fotobox', value: 'fotobox' },
  { name: 'Sonstige', value: 'other' },
];

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
  onSelectMultiple,
  defaultFolder = '',
}: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();

    try {
      const foldersToLoad = selectedFolder ? [selectedFolder] : FOLDERS.filter(f => f.value).map(f => f.value);
      const allFiles: MediaFile[] = [];

      for (const folder of foldersToLoad) {
        const { data, error } = await supabase.storage
          .from('images')
          .list(folder, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (!error && data) {
          const folderFiles = data
            .filter(file => !file.name.startsWith('.'))
            .map(file => {
              const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(`${folder}/${file.name}`);

              return {
                name: file.name,
                url: urlData.publicUrl,
                folder,
              };
            });
          allFiles.push(...folderFiles);
        }
      }

      setFiles(allFiles);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (open) {
      loadFiles();
      setSelectedFiles([]);
    }
  }, [open, loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const folder = selectedFolder || 'other';
      const resizedFile = await resizeImage(file, 1920, 1080);
      const result = await uploadImage(resizedFile, folder);

      if (result.success && result.url) {
        if (multiple) {
          setSelectedFiles(prev => [...prev, result.url!]);
        } else {
          onSelect(result.url);
          onClose();
        }
        await loadFiles();
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (url: string) => {
    if (multiple) {
      setSelectedFiles(prev =>
        prev.includes(url)
          ? prev.filter(f => f !== url)
          : [...prev, url]
      );
    } else {
      onSelect(url);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (multiple && onSelectMultiple) {
      onSelectMultiple(selectedFiles);
    }
    onClose();
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-[#141414] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Bild auswählen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {FOLDERS.map(folder => (
                <Button
                  key={folder.value}
                  variant={selectedFolder === folder.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedFolder(folder.value)}
                  className={cn(
                    selectedFolder === folder.value
                      ? 'bg-[#D4AF37] text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  <Folder className="w-3 h-3 mr-1" />
                  {folder.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 pl-10 bg-[#1A1A1A] border-white/10 text-white text-sm"
                />
              </div>

              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] cursor-pointer"
                >
                  <span>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Files Grid */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                Keine Bilder gefunden
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {filteredFiles.map((file) => (
                  <div
                    key={file.url}
                    onClick={() => handleSelect(file.url)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all',
                      selectedFiles.includes(file.url)
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50'
                        : 'border-transparent hover:border-white/20'
                    )}
                  >
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {selectedFiles.includes(file.url) ? (
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {multiple && selectedFiles.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <p className="text-gray-400">
                {selectedFiles.length} Bild(er) ausgewählt
              </p>
              <Button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]"
              >
                Auswählen
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

