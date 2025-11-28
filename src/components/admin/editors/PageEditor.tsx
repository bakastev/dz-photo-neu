'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import TextField from '../forms/TextField';
import SlugField from '../forms/SlugField';
import SelectField from '../forms/SelectField';
import ToggleField from '../forms/ToggleField';
import LexicalEditor from '../LexicalEditor';
import Link from 'next/link';

interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  page_type?: string;
  published?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

interface PageEditorProps {
  page?: Page;
  isNew?: boolean;
}

const pageTypeOptions = [
  { value: 'standard', label: 'Standardseite' },
  { value: 'landing', label: 'Landingpage' },
  { value: 'legal', label: 'Rechtliches (Impressum, Datenschutz)' },
  { value: 'contact', label: 'Kontaktseite' },
];

export default function PageEditor({ page, isNew = false }: PageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [content, setContent] = useState(page?.content || '');
  const [pageType, setPageType] = useState(page?.page_type || 'standard');
  const [published, setPublished] = useState(page?.published || false);
  const [metaTitle, setMetaTitle] = useState(page?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(page?.meta_description || '');

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const data = {
        title,
        slug,
        content,
        page_type: pageType,
        published,
        meta_title: metaTitle || title,
        meta_description: metaDescription,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data: newPage, error: insertError } = await supabase
          .from('pages')
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        router.push(`/admin/pages/${newPage.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('pages')
          .update(data)
          .eq('id', page!.id);

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
    if (!confirm('Möchten Sie diese Seite wirklich löschen?')) return;

    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('id', page!.id);

      if (deleteError) throw deleteError;
      router.push('/admin/pages');
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
          <Link href="/admin/pages">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Neue Seite' : 'Seite bearbeiten'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-400">ID: {page?.id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <>
              <Link href={`/${slug}`} target="_blank">
                <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
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
          <TabsTrigger value="seo" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            SEO
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Einstellungen
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
                <TextField
                  label="Titel"
                  name="title"
                  value={title}
                  onChange={setTitle}
                  required
                  placeholder="Seitentitel"
                />
                <SlugField
                  value={slug}
                  onChange={setSlug}
                  sourceValue={title}
                  baseUrl="https://dz-photo.at"
                  required
                />
              </div>
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Inhalt</h3>
                <LexicalEditor
                  initialContent={content}
                  onChange={setContent}
                  placeholder="Seiteninhalt..."
                  minHeight="400px"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
                <SelectField
                  label="Seitentyp"
                  value={pageType}
                  onChange={setPageType}
                  options={pageTypeOptions}
                />
              </div>
            </div>
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
            />
            <TextField
              label="Meta-Beschreibung"
              name="metaDescription"
              value={metaDescription}
              onChange={setMetaDescription}
              multiline
              rows={3}
              placeholder="Seitenbeschreibung für Suchmaschinen..."
            />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
            <ToggleField
              label="Veröffentlicht"
              description="Wenn aktiviert, ist die Seite öffentlich sichtbar"
              value={published}
              onChange={setPublished}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}



