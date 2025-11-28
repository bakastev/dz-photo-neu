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
import DateField from '../forms/DateField';
import SelectField from '../forms/SelectField';
import ToggleField from '../forms/ToggleField';
import TagsField from '../forms/TagsField';
import LexicalEditor from '../LexicalEditor';
import Link from 'next/link';
import type { BlogPost } from '@/lib/supabase';
import { PreviewProvider, usePreview } from '../PreviewProvider';
import { PreviewPanel } from '../preview';

interface BlogEditorProps {
  post?: BlogPost;
  isNew?: boolean;
}

const categoryOptions = [
  { value: 'tipps', label: 'Tipps & Tricks' },
  { value: 'hochzeit', label: 'Hochzeit' },
  { value: 'fotografie', label: 'Fotografie' },
  { value: 'location', label: 'Locations' },
  { value: 'inspiration', label: 'Inspiration' },
];

function BlogEditorInner({ post, isNew = false }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePreview, setIsPreviewOpen } = usePreview();

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [publishedAt, setPublishedAt] = useState<Date | null>(
    post?.published_at ? new Date(post.published_at) : new Date()
  );
  const [published, setPublished] = useState(post?.published || false);
  const [featured, setFeatured] = useState(post?.featured || false);
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || '');
  const [focusKeywords, setFocusKeywords] = useState<string[]>(post?.focus_keywords || []);

  // Update preview whenever form data changes
  const syncPreview = useCallback(() => {
    updatePreview({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      publishedAt,
      featured,
      published,
      metaTitle,
      metaDescription,
    });
  }, [title, slug, excerpt, content, featuredImage, category, tags, publishedAt, featured, published, metaTitle, metaDescription, updatePreview]);

  useEffect(() => {
    syncPreview();
  }, [syncPreview]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const data = {
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage || null,
        category,
        tags,
        published_at: publishedAt?.toISOString(),
        published,
        featured,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt?.substring(0, 160),
        focus_keywords: focusKeywords,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data: newPost, error: insertError } = await supabase
          .from('blog_posts')
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        router.push(`/admin/blog/${newPost.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(data)
          .eq('id', post!.id);

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
    if (!confirm('Möchten Sie diesen Beitrag wirklich löschen?')) return;

    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post!.id);

      if (deleteError) throw deleteError;
      router.push('/admin/blog');
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
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Neuer Blog-Beitrag' : 'Beitrag bearbeiten'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-400">ID: {post?.id}</p>
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
              <Link href={`/blog/${slug}`} target="_blank">
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
                  placeholder="z.B. 10 Tipps für perfekte Hochzeitsfotos"
                />
                <SlugField
                  value={slug}
                  onChange={setSlug}
                  sourceValue={title}
                  baseUrl="https://dz-photo.at/blog"
                  required
                />
                <TextField
                  label="Auszug"
                  name="excerpt"
                  value={excerpt}
                  onChange={setExcerpt}
                  multiline
                  rows={3}
                  placeholder="Kurze Zusammenfassung des Beitrags..."
                />
              </div>
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Inhalt</h3>
                <LexicalEditor
                  initialContent={content}
                  onChange={setContent}
                  placeholder="Schreiben Sie Ihren Beitrag..."
                  minHeight="500px"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
                <SelectField
                  label="Kategorie"
                  value={category}
                  onChange={setCategory}
                  options={categoryOptions}
                  placeholder="Kategorie wählen..."
                />
                <DateField
                  label="Veröffentlichungsdatum"
                  value={publishedAt}
                  onChange={setPublishedAt}
                />
                <TagsField
                  label="Tags"
                  value={tags}
                  onChange={setTags}
                  suggestions={['Hochzeit', 'Fotografie', 'Tipps', 'Location', 'Braut', 'Bräutigam']}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <ImageField
              label="Beitragsbild"
              value={featuredImage}
              onChange={(v) => setFeaturedImage(v || '')}
              folder="blog"
              aspectRatio="video"
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
            />
            <TextField
              label="Meta-Beschreibung"
              name="metaDescription"
              value={metaDescription}
              onChange={setMetaDescription}
              multiline
              rows={3}
              placeholder={excerpt || 'Wird automatisch generiert'}
            />
            <TagsField
              label="Focus Keywords"
              value={focusKeywords}
              onChange={setFocusKeywords}
              suggestions={['Hochzeitsfotograf', 'Tipps', 'Hochzeitsfotos']}
            />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
            <ToggleField
              label="Veröffentlicht"
              description="Wenn aktiviert, ist der Beitrag öffentlich sichtbar"
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
      <PreviewPanel type="blog" slug={slug} />
    </div>
  );
}

// Wrapper component with PreviewProvider
export default function BlogEditor({ post, isNew = false }: BlogEditorProps) {
  const initialData = post ? {
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    featuredImage: post.featured_image || '',
    category: post.category || '',
    tags: post.tags || [],
    publishedAt: post.published_at ? new Date(post.published_at) : null,
    featured: post.featured || false,
    published: post.published || false,
    metaTitle: post.meta_title || '',
    metaDescription: post.meta_description || '',
  } : {};

  return (
    <PreviewProvider initialData={initialData}>
      <BlogEditorInner post={post} isNew={isNew} />
    </PreviewProvider>
  );
}
