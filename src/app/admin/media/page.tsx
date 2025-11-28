'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  Search,
  Grid,
  List,
  Folder,
  Trash2,
  Download,
  Check,
  Loader2,
  ImageIcon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadMultipleImages, resizeImage, deleteImage } from '@/lib/upload';

interface MediaFile {
  name: string;
  url: string;
  folder: string;
  size?: number;
  created_at?: string;
}

const FOLDERS = [
  { name: 'Alle', value: '' },
  { name: 'Hochzeiten', value: 'wedding' },
  { name: 'Locations', value: 'location' },
  { name: 'Blog', value: 'blog' },
  { name: 'Fotobox', value: 'fotobox' },
  { name: 'Sonstige', value: 'other' },
];

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();

    // Recursive function to list all files in a folder and its subfolders
    const listFilesRecursively = async (folder: string): Promise<MediaFile[]> => {
      const { data, error } = await supabase.storage
        .from('images')
        .list(folder, {
          limit: 500,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error || !data) return [];

      const files: MediaFile[] = [];
      
      for (const item of data) {
        if (item.name.startsWith('.') || item.name === '.emptyFolderPlaceholder') continue;
        
        const fullPath = folder ? `${folder}/${item.name}` : item.name;
        
        // Check if item is a folder (no metadata means it's a folder)
        if (!item.metadata || item.metadata.mimetype === undefined) {
          // It's a subfolder, recurse into it
          const subFiles = await listFilesRecursively(fullPath);
          files.push(...subFiles);
        } else {
          // It's a file
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(fullPath);

          files.push({
            name: item.name,
            url: urlData.publicUrl,
            folder: folder || 'root',
            size: item.metadata?.size,
            created_at: item.created_at,
          });
        }
      }

      return files;
    };

    try {
      const foldersToLoad = selectedFolder ? [selectedFolder] : FOLDERS.filter(f => f.value).map(f => f.value);
      const allFiles: MediaFile[] = [];

      for (const folder of foldersToLoad) {
        const folderFiles = await listFilesRecursively(folder);
        allFiles.push(...folderFiles);
      }

      setFiles(allFiles);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (fileList: File[]) => {
    if (fileList.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const folder = selectedFolder || 'other';
      const resizedFiles = await Promise.all(
        fileList.map(file => resizeImage(file, 1920, 1080))
      );

      await uploadMultipleImages(resizedFiles, folder, (index, progress) => {
        setUploadProgress(Math.round(((index + progress.percentage / 100) / fileList.length) * 100));
      });

      await loadFiles();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleUpload(files);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleUpload(files);
  }, [selectedFolder]);

  const handleDelete = async () => {
    if (selectedFiles.length === 0) return;
    if (!confirm(`Möchten Sie ${selectedFiles.length} Datei(en) wirklich löschen?`)) return;

    const supabase = createBrowserSupabaseClient();

    for (const fileUrl of selectedFiles) {
      const file = files.find(f => f.url === fileUrl);
      if (file) {
        await supabase.storage
          .from('images')
          .remove([`${file.folder}/${file.name}`]);
      }
    }

    setSelectedFiles([]);
    await loadFiles();
  };

  const toggleFileSelection = (url: string) => {
    setSelectedFiles(prev =>
      prev.includes(url)
        ? prev.filter(f => f !== url)
        : [...prev, url]
    );
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Medien" description={`${files.length} Dateien`} />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Folder Filter */}
            {FOLDERS.map(folder => (
              <Button
                key={folder.value}
                variant={selectedFolder === folder.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFolder(folder.value)}
                className={cn(
                  selectedFolder === folder.value
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-white hover:bg-white/10'
                )}
              >
                <Folder className="w-4 h-4 mr-1" />
                {folder.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-10 bg-[#141414] border-white/10 text-white"
              />
            </div>

            {/* View Toggle */}
            <div className="flex border border-white/10 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-none',
                  viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'
                )}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-none',
                  viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400'
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Delete Button */}
            {selectedFiles.length > 0 && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {selectedFiles.length} löschen
              </Button>
            )}

            {/* Upload Button */}
            <label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <Button
                asChild
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-[#E5C158] hover:to-[#D4AF37] cursor-pointer"
              >
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Hochladen
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-8 transition-colors text-center',
            dragOver ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-white/20'
          )}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">
            Bilder hierher ziehen oder <span className="text-[#D4AF37]">klicken</span> zum Hochladen
          </p>
          <p className="text-gray-500 text-sm mt-1">
            JPG, PNG, WebP bis 10MB • Wird in "{FOLDERS.find(f => f.value === (selectedFolder || 'other'))?.name}" gespeichert
          </p>
        </div>

        {/* Files Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Keine Dateien gefunden</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.url}
                onClick={() => toggleFileSelection(file.url)}
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
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs truncate">{file.name}</p>
                  <p className="text-gray-400 text-xs capitalize">{file.folder}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0A0A0A]">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(filteredFiles.map(f => f.url));
                        } else {
                          setSelectedFiles([]);
                        }
                      }}
                      className="rounded border-white/20"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Vorschau</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Ordner</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFiles.map((file) => (
                  <tr key={file.url} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.url)}
                        onChange={() => toggleFileSelection(file.url)}
                        className="rounded border-white/20"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image src={file.url} alt={file.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">{file.name}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{file.folder}</td>
                    <td className="px-4 py-3 text-right">
                      <a href={file.url} download target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                          <Download className="w-4 h-4" />
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

