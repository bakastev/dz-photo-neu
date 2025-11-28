'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import TextField from '../forms/TextField';
import SlugField from '../forms/SlugField';
import ImageField from '../forms/ImageField';
import GalleryField from '../forms/GalleryField';
import SelectField from '../forms/SelectField';
import ToggleField from '../forms/ToggleField';
import TagsField from '../forms/TagsField';
import LexicalEditor from '../LexicalEditor';
import Link from 'next/link';

interface FotoboxService {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  service_type?: string;
  price?: number;
  duration_hours?: number;
  features?: string[];
  cover_image?: string;
  images?: any[];
  published?: boolean;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

interface FotoboxEditorProps {
  service?: FotoboxService;
  isNew?: boolean;
}

const serviceTypeOptions = [
  { value: 'standard', label: 'Standard Paket' },
  { value: 'premium', label: 'Premium Paket' },
  { value: 'deluxe', label: 'Deluxe Paket' },
  { value: 'addon', label: 'Zusatzleistung' },
];

export default function FotoboxEditor({ service, isNew = false }: FotoboxEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(service?.name || '');
  const [slug, setSlug] = useState(service?.slug || '');
  const [description, setDescription] = useState(service?.description || '');
  const [content, setContent] = useState(service?.content || '');
  const [serviceType, setServiceType] = useState(service?.service_type || 'standard');
  const [price, setPrice] = useState(service?.price?.toString() || '');
  const [durationHours, setDurationHours] = useState(service?.duration_hours?.toString() || '');
  const [features, setFeatures] = useState<string[]>(service?.features || []);
  const [coverImage, setCoverImage] = useState(service?.cover_image || '');
  const [images, setImages] = useState<string[]>(
    Array.isArray(service?.images)
      ? service.images.map(img => typeof img === 'string' ? img : img.url || '')
      : []
  );
  const [published, setPublished] = useState(service?.published || false);
  const [featured, setFeatured] = useState(service?.featured || false);
  const [metaTitle, setMetaTitle] = useState(service?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(service?.meta_description || '');

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const data = {
        name,
        slug,
        description,
        content,
        service_type: serviceType,
        price: price ? parseFloat(price) : null,
        duration_hours: durationHours ? parseInt(durationHours) : null,
        features,
        cover_image: coverImage || null,
        images,
        published,
        featured,
        meta_title: metaTitle || name,
        meta_description: metaDescription || description?.substring(0, 160),
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data: newService, error: insertError } = await supabase
          .from('fotobox_services')
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        router.push(`/admin/fotobox/${newService.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('fotobox_services')
          .update(data)
          .eq('id', service!.id);

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
    if (!confirm('Möchten Sie diesen Service wirklich löschen?')) return;

    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase
        .from('fotobox_services')
        .delete()
        .eq('id', service!.id);

      if (deleteError) throw deleteError;
      router.push('/admin/fotobox');
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
          <Link href="/admin/fotobox">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Neuer Fotobox Service' : 'Service bearbeiten'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-400">ID: {service?.id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <>
              <Link href={`/fotobox/${slug}`} target="_blank">
                <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30">
                  <Eye className="w-4 h-4 mr-2" />
                  Vorschau
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
          <TabsTrigger value="pricing" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Preise & Features
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
                placeholder="z.B. Premium Fotobox Paket"
              />
              <SlugField
                value={slug}
                onChange={setSlug}
                sourceValue={name}
                baseUrl="https://dz-photo.at/fotobox"
                required
              />
              <SelectField
                label="Service-Typ"
                value={serviceType}
                onChange={setServiceType}
                options={serviceTypeOptions}
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
                placeholder="Kurze Beschreibung des Services..."
              />
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detailbeschreibung</h3>
            <LexicalEditor
              initialContent={content}
              onChange={setContent}
              placeholder="Ausführliche Beschreibung des Services..."
              minHeight="300px"
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
              folder="fotobox"
              aspectRatio="video"
            />
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <GalleryField
              label="Galerie"
              value={images}
              onChange={setImages}
              folder="fotobox"
              maxImages={20}
            />
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Preis (€)"
                name="price"
                value={price}
                onChange={setPrice}
                placeholder="z.B. 599"
              />
              <TextField
                label="Dauer (Stunden)"
                name="durationHours"
                value={durationHours}
                onChange={setDurationHours}
                placeholder="z.B. 4"
              />
            </div>
            <TagsField
              label="Features / Leistungen"
              value={features}
              onChange={setFeatures}
              placeholder="Feature hinzufügen..."
              suggestions={[
                'Unbegrenzte Aufnahmen',
                'Sofortdruck',
                'Requisiten',
                'Online-Galerie',
                'USB-Stick',
                'Gästebuch',
                'Greenscreen',
                'GIF-Funktion',
              ]}
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
              placeholder={description?.substring(0, 160) || 'Wird automatisch generiert'}
            />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
            <ToggleField
              label="Veröffentlicht"
              description="Wenn aktiviert, ist der Service öffentlich sichtbar"
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
    </div>
  );
}



