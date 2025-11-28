'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Trash2, Loader2, ArrowLeft, Star } from 'lucide-react';
import TextField from '../forms/TextField';
import DateField from '../forms/DateField';
import ToggleField from '../forms/ToggleField';
import Link from 'next/link';

interface Review {
  id: string;
  author_name: string;
  review_text: string;
  rating: number;
  review_date?: string;
  source?: string;
  source_url?: string;
  published?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ReviewEditorProps {
  review?: Review;
  isNew?: boolean;
}

export default function ReviewEditor({ review, isNew = false }: ReviewEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [authorName, setAuthorName] = useState(review?.author_name || '');
  const [reviewText, setReviewText] = useState(review?.review_text || '');
  const [rating, setRating] = useState(review?.rating || 5);
  const [reviewDate, setReviewDate] = useState<Date | null>(
    review?.review_date ? new Date(review.review_date) : new Date()
  );
  const [source, setSource] = useState(review?.source || '');
  const [sourceUrl, setSourceUrl] = useState(review?.source_url || '');
  const [published, setPublished] = useState(review?.published ?? true);
  const [featured, setFeatured] = useState(review?.featured || false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const data = {
        author_name: authorName,
        review_text: reviewText,
        rating,
        review_date: reviewDate?.toISOString().split('T')[0],
        source: source || null,
        source_url: sourceUrl || null,
        published,
        featured,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data: newReview, error: insertError } = await supabase
          .from('reviews')
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        router.push(`/admin/reviews/${newReview.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('reviews')
          .update(data)
          .eq('id', review!.id);

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
    if (!confirm('Möchten Sie diese Bewertung wirklich löschen?')) return;

    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review!.id);

      if (deleteError) throw deleteError;
      router.push('/admin/reviews');
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
          <Link href="/admin/reviews">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Neue Bewertung' : 'Bewertung bearbeiten'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-400">ID: {review?.id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
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

      {/* Editor */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="bg-[#141414] border border-white/10">
          <TabsTrigger value="content" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Inhalt
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
            Einstellungen
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <TextField
                label="Autor"
                name="authorName"
                value={authorName}
                onChange={setAuthorName}
                required
                placeholder="Name des Bewertenden"
              />
              <DateField
                label="Bewertungsdatum"
                value={reviewDate}
                onChange={setReviewDate}
              />
              
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bewertung
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-600 hover:text-yellow-500/50'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-400">{rating} von 5</span>
                </div>
              </div>
            </div>
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <TextField
                label="Bewertungstext"
                name="reviewText"
                value={reviewText}
                onChange={setReviewText}
                multiline
                rows={6}
                required
                placeholder="Was hat der Kunde geschrieben?"
              />
              <TextField
                label="Quelle"
                name="source"
                value={source}
                onChange={setSource}
                placeholder="z.B. Google, Facebook, Hochzeitsportal"
              />
              <TextField
                label="Quell-URL"
                name="sourceUrl"
                value={sourceUrl}
                onChange={setSourceUrl}
                placeholder="https://..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
            <ToggleField
              label="Sichtbar"
              description="Wenn aktiviert, wird die Bewertung auf der Website angezeigt"
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



