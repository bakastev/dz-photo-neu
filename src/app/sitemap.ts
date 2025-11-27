import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.dz-photo.at';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/hochzeit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fotobox`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic wedding pages
  const { data: weddings } = await supabase
    .from('weddings')
    .select('slug, updated_at')
    .eq('published', true);

  const weddingPages: MetadataRoute.Sitemap = (weddings || []).map((wedding) => ({
    url: `${baseUrl}/hochzeit/${wedding.slug}`,
    lastModified: wedding.updated_at ? new Date(wedding.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic location pages
  const { data: locations } = await supabase
    .from('locations')
    .select('slug, updated_at')
    .eq('published', true);

  const locationPages: MetadataRoute.Sitemap = (locations || []).map((location) => ({
    url: `${baseUrl}/locations/${location.slug}`,
    lastModified: location.updated_at ? new Date(location.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic blog pages
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true);

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...weddingPages, ...locationPages, ...blogPages];
}

