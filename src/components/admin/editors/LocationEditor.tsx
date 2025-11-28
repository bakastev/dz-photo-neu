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
import ToggleField from '../forms/ToggleField';
import TagsField from '../forms/TagsField';
import LexicalEditor from '../LexicalEditor';
import Link from 'next/link';
import type { Location } from '@/lib/supabase';
import { PreviewProvider, usePreview } from '../PreviewProvider';
import { PreviewPanel } from '../preview';

interface LocationEditorProps {
  location?: Location;
  isNew?: boolean;
}

function LocationEditorInner({ location, isNew = false }: LocationEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePreview, setIsPreviewOpen } = usePreview();

  // Form state
  const [name, setName] = useState(location?.name || '');
  const [slug, setSlug] = useState(location?.slug || '');
  const [city, setCity] = useState(location?.city || '');
  const [region, setRegion] = useState(location?.region || '');
  const [address, setAddress] = useState(location?.address || '');
  const [description, setDescription] = useState(location?.description || '');
  const [content, setContent] = useState(location?.content || '');
  const [coverImage, setCoverImage] = useState(location?.cover_image || '');
  const [images, setImages] = useState<string[]>(
    Array.isArray(location?.images)
      ? location.images.map(img => typeof img === 'string' ? img : img.url || '')
      : []
  );
  const [latitude, setLatitude] = useState(location?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(location?.longitude?.toString() || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(location?.google_maps_url || '');
  const [featured, setFeatured] = useState(location?.featured || false);
  const [published, setPublished] = useState(location?.published || false);
  const [metaTitle, setMetaTitle] = useState(location?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(location?.meta_description || '');
  const [focusKeywords, setFocusKeywords] = useState<string[]>(location?.focus_keywords || []);
  const [features, setFeatures] = useState<string[]>(location?.features || []);
  const [capacityMin, setCapacityMin] = useState(location?.capacity_min?.toString() || '');
  const [capacityMax, setCapacityMax] = useState(location?.capacity_max?.toString() || '');

  // Update preview whenever form data changes
  const syncPreview = useCallback(() => {
    updatePreview({
      name,
      slug,
      city,
      region,
      address,
      description,
      content,
      coverImage,
      images,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      features,
      capacityMin: capacityMin ? parseInt(capacityMin) : undefined,
      capacityMax: capacityMax ? parseInt(capacityMax) : undefined,
      featured,
      published,
      metaTitle,
      metaDescription,
    });
  }, [name, slug, city, region, address, description, content, coverImage, images, latitude, longitude, features, capacityMin, capacityMax, featured, published, metaTitle, metaDescription, updatePreview]);

  useEffect(() => {
    syncPreview();
  }, [syncPreview]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const data = {
        name,
        slug,
        city,
        region,
        address,
        description,
        cover_image: coverImage || null,
        images,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        google_maps_url: googleMapsUrl || null,
        featured,
        published,
        meta_title: metaTitle || name,
        meta_description: metaDescription || description?.substring(0, 160),
        focus_keywords: focusKeywords,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data: newLocation, error: insertError } = await supabase
          .from('locations')
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        router.push(`/admin/locations/${newLocation.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('locations')
          .update(data)
          .eq('id', location!.id);

        if (updateError) throw updateError;
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Möchten Sie diese Location wirklich löschen?')) return;

    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase
        .from('locations')
        .delete()
        .eq('id', location!.id);

      if (deleteError) throw deleteError;
      router.push('/admin/locations');
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
          <Link href="/admin/locations">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Neue Location' : 'Location bearbeiten'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-400">ID: {location?.id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Live-Vorschau
          </Button>
          {!isNew && (
            <>
              <Link href={`/locations/${slug}`} target="_blank">
                <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30">
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
            onClick={handleSave}
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
          <TabsTrigger value="location" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Standort
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
                label="Name"
                name="name"
                value={name}
                onChange={setName}
                required
                placeholder="z.B. Gut Kühstein"
              />
              <SlugField
                value={slug}
                onChange={setSlug}
                sourceValue={name}
                baseUrl="https://dz-photo.at/locations"
                required
              />
              <TextField
                label="Stadt"
                name="city"
                value={city}
                onChange={setCity}
                placeholder="z.B. Pucking"
              />
              <TextField
                label="Region"
                name="region"
                value={region}
                onChange={setRegion}
                placeholder="z.B. Oberösterreich"
              />
            </div>
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
              <LexicalEditor
                initialContent={description}
                onChange={setDescription}
                placeholder="Beschreiben Sie die Location..."
                minHeight="300px"
              />
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <ImageField
              label="Titelbild"
              value={coverImage}
              onChange={(v) => setCoverImage(v || '')}
              folder="location"
              aspectRatio="video"
            />
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <GalleryField
              label="Galerie"
              value={images}
              onChange={setImages}
              folder="location"
              maxImages={50}
            />
          </div>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
            <TextField
              label="Adresse"
              name="address"
              value={address}
              onChange={setAddress}
              placeholder="Vollständige Adresse"
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Breitengrad (Latitude)"
                name="latitude"
                value={latitude}
                onChange={setLatitude}
                placeholder="z.B. 48.2082"
              />
              <TextField
                label="Längengrad (Longitude)"
                name="longitude"
                value={longitude}
                onChange={setLongitude}
                placeholder="z.B. 14.1278"
              />
            </div>
            <TextField
              label="Google Maps URL"
              name="googleMapsUrl"
              value={googleMapsUrl}
              onChange={setGoogleMapsUrl}
              placeholder="https://maps.google.com/..."
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
              placeholder={name || 'Wird automatisch generiert'}
            />
            <TextField
              label="Meta-Beschreibung"
              name="metaDescription"
              value={metaDescription}
              onChange={setMetaDescription}
              multiline
              rows={3}
              placeholder="Wird automatisch generiert"
            />
            <TagsField
              label="Focus Keywords"
              value={focusKeywords}
              onChange={setFocusKeywords}
              suggestions={['Hochzeitslocation', 'Oberösterreich', 'Bauernhof', 'Scheune']}
            />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
            <ToggleField
              label="Veröffentlicht"
              description="Wenn aktiviert, ist die Location öffentlich sichtbar"
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
      <PreviewPanel type="location" slug={slug} />
    </div>
  );
}

// Wrapper component with PreviewProvider
export default function LocationEditor({ location, isNew = false }: LocationEditorProps) {
  const initialData = location ? {
    name: location.name || '',
    slug: location.slug || '',
    city: location.city || '',
    region: location.region || '',
    address: location.address || '',
    description: location.description || '',
    content: location.content || '',
    coverImage: location.cover_image || '',
    images: Array.isArray(location.images)
      ? location.images.map(img => typeof img === 'string' ? img : img.url || '')
      : [],
    latitude: location.latitude,
    longitude: location.longitude,
    features: location.features || [],
    capacityMin: location.capacity_min,
    capacityMax: location.capacity_max,
    featured: location.featured || false,
    published: location.published || false,
    metaTitle: location.meta_title || '',
    metaDescription: location.meta_description || '',
  } : {};

  return (
    <PreviewProvider initialData={initialData}>
      <LocationEditorInner location={location} isNew={isNew} />
    </PreviewProvider>
  );
}
