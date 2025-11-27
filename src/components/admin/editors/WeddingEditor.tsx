'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Trash2, Loader2, ArrowLeft, Monitor } from 'lucide-react';
import TextField from '../forms/TextField';
import SlugField from '../forms/SlugField';
import ImageField from '../forms/ImageField';
import GalleryField from '../forms/GalleryField';
import DateField from '../forms/DateField';
import ToggleField from '../forms/ToggleField';
import TagsField from '../forms/TagsField';
import LexicalEditor from '../LexicalEditor';
import Link from 'next/link';
import type { Wedding } from '@/lib/supabase';
import { PreviewProvider, usePreview } from '../PreviewProvider';
import { PreviewPanel } from '../preview';

interface WeddingEditorProps {
  wedding?: Wedding;
  isNew?: boolean;
}

function WeddingEditorInner({ wedding, isNew = false }: WeddingEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePreview, setIsPreviewOpen } = usePreview();

  // Form state
  const [title, setTitle] = useState(wedding?.title || '');
  const [slug, setSlug] = useState(wedding?.slug || '');
  const [coupleNames, setCoupleNames] = useState(wedding?.couple_names || '');
  const [weddingDate, setWeddingDate] = useState<Date | null>(
    wedding?.wedding_date ? new Date(wedding.wedding_date) : null
  );
  const [location, setLocation] = useState(wedding?.location || '');
  const [description, setDescription] = useState(wedding?.description || '');
  const [content, setContent] = useState(wedding?.content || '');
  const [coverImage, setCoverImage] = useState(wedding?.cover_image || '');
  const [images, setImages] = useState<string[]>(
    Array.isArray(wedding?.images) 
      ? wedding.images.map(img => typeof img === 'string' ? img : img.url || '')
      : []
  );
  const [featured, setFeatured] = useState(wedding?.featured || false);
  const [published, setPublished] = useState(wedding?.published || false);
  const [metaTitle, setMetaTitle] = useState(wedding?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(wedding?.meta_description || '');
  const [focusKeywords, setFocusKeywords] = useState<string[]>(wedding?.focus_keywords || []);

  // Update preview whenever form data changes
  const syncPreview = useCallback(() => {
    updatePreview({
      title,
      slug,
      coupleNames,
      weddingDate,
      location,
      description,
      content,
      coverImage,
      images,
      featured,
      published,
      metaTitle,
      metaDescription,
    });
  }, [title, slug, coupleNames, weddingDate, location, description, content, coverImage, images, featured, published, metaTitle, metaDescription, updatePreview]);

  useEffect(() => {
    syncPreview();
  }, [syncPreview]);

  const handleSave = async () => {
    console.log('🔥 handleSave called!');
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      console.log('📝 Saving data:', { title, slug, description, content });
      
      const data = {
        title,
        slug,
        couple_names: coupleNames,
        wedding_date: weddingDate?.toISOString().split('T')[0],
        location,
        description,
        content,
        cover_image: coverImage || null,
        images,
        featured,
        published,
        meta_title: metaTitle || title,
        meta_description: metaDescription || description?.substring(0, 160),
        focus_keywords: focusKeywords,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data: newWedding, error: insertError } = await supabase
          .from('weddings')
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        router.push(`/admin/weddings/${newWedding.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('weddings')
          .update(data)
          .eq('id', wedding!.id);

        if (updateError) {
          console.error('❌ Update error:', updateError);
          throw updateError;
        }
        console.log('✅ Update successful!');
      }

      // Show success message
      alert('✅ Erfolgreich gespeichert!');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Möchten Sie diese Hochzeit wirklich löschen?')) return;

    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase
        .from('weddings')
        .delete()
        .eq('id', wedding!.id);

      if (deleteError) throw deleteError;
      router.push('/admin/weddings');
    } catch (err: any) {
      setError(err.message || 'Löschen fehlgeschlagen');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/weddings">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Neue Hochzeit' : 'Hochzeit bearbeiten'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-400">ID: {wedding?.id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="border-white/10 text-gray-400 hover:text-white"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Live-Vorschau
          </Button>
          {!isNew && (
            <>
              <Link href={`/hochzeit/${slug}`} target="_blank">
                <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Im Browser
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </>
          )}
          <Button
            type="button"
            onClick={() => {
              console.log('Button clicked!');
              handleSave();
            }}
            disabled={saving}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-[#E5C158] hover:to-[#D4AF37]"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Speichern
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Editor Tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="bg-[#141414] border border-white/10">
          <TabsTrigger value="content" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Inhalt
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Medien
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            SEO
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Einstellungen
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6 bg-[#141414] border border-white/10 rounded-xl p-6">
              <TextField
                label="Titel"
                name="title"
                value={title}
                onChange={setTitle}
                required
                placeholder="z.B. Traumhochzeit am See"
              />
              <SlugField
                value={slug}
                onChange={setSlug}
                sourceValue={title}
                baseUrl="https://dz-photo.at/hochzeit"
                required
              />
              <TextField
                label="Paar-Namen"
                name="coupleNames"
                value={coupleNames}
                onChange={setCoupleNames}
                placeholder="z.B. Lisa & Markus"
              />
              <DateField
                label="Hochzeitsdatum"
                value={weddingDate}
                onChange={setWeddingDate}
              />
              <TextField
                label="Location"
                name="location"
                value={location}
                onChange={setLocation}
                placeholder="z.B. Gut Kühstein, Oberösterreich"
              />
            </div>
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
              <TextField
                label="Kurzbeschreibung"
                name="description"
                value={description}
                onChange={setDescription}
                multiline
                rows={4}
                placeholder="Kurze Beschreibung der Hochzeit..."
              />
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Inhalt</h3>
            <LexicalEditor
              initialContent={content}
              onChange={setContent}
              placeholder="Erzählen Sie die Geschichte dieser Hochzeit..."
              minHeight="400px"
            />
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <ImageField
              label="Titelbild"
              value={coverImage}
              onChange={(v) => setCoverImage(v || '')}
              folder="wedding"
              aspectRatio="video"
            />
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <GalleryField
              label="Galerie"
              value={images}
              onChange={setImages}
              folder="wedding"
              maxImages={50}
            />
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
            <TextField
              label="Meta-Titel"
              name="metaTitle"
              value={metaTitle}
              onChange={setMetaTitle}
              placeholder={title || 'Wird automatisch generiert'}
              description="Erscheint in Suchergebnissen (max. 60 Zeichen)"
            />
            <TextField
              label="Meta-Beschreibung"
              name="metaDescription"
              value={metaDescription}
              onChange={setMetaDescription}
              multiline
              rows={3}
              placeholder={description?.substring(0, 160) || 'Wird automatisch generiert'}
              description="Erscheint in Suchergebnissen (max. 160 Zeichen)"
            />
            <TagsField
              label="Focus Keywords"
              value={focusKeywords}
              onChange={setFocusKeywords}
              placeholder="Keyword eingeben..."
              suggestions={['Hochzeitsfotograf', 'Oberösterreich', 'Hochzeitsfotos', 'Brautpaar']}
            />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
            <ToggleField
              label="Veröffentlicht"
              description="Wenn aktiviert, ist die Hochzeit öffentlich sichtbar"
              value={published}
              onChange={setPublished}
            />
            <ToggleField
              label="Featured"
              description="Auf der Startseite hervorheben"
              value={featured}
              onChange={setFeatured}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Preview Panel */}
      <PreviewPanel type="wedding" slug={slug} />
    </div>
  );
}

// Wrapper component with PreviewProvider
export default function WeddingEditor({ wedding, isNew = false }: WeddingEditorProps) {
  const initialData = wedding ? {
    title: wedding.title || '',
    slug: wedding.slug || '',
    coupleNames: wedding.couple_names || '',
    weddingDate: wedding.wedding_date ? new Date(wedding.wedding_date) : null,
    location: wedding.location || '',
    description: wedding.description || '',
    content: wedding.content || '',
    coverImage: wedding.cover_image || '',
    images: Array.isArray(wedding.images) 
      ? wedding.images.map(img => typeof img === 'string' ? img : img.url || '')
      : [],
    featured: wedding.featured || false,
    published: wedding.published || false,
    metaTitle: wedding.meta_title || '',
    metaDescription: wedding.meta_description || '',
  } : {};

  return (
    <PreviewProvider initialData={initialData}>
      <WeddingEditorInner wedding={wedding} isNew={isNew} />
    </PreviewProvider>
  );
}
