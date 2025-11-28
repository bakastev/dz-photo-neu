import { supabase } from './supabase';
import type { Wedding, Location, BlogPost, FotoboxService, Review, Page } from './supabase';

// Helper to get section content from homepage_sections table
async function getHomepageSections() {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('section_key, content, enabled')
    .eq('enabled', true)
    .order('display_order');

  if (error) {
    console.error('❌ Error fetching homepage sections:', error);
    return {};
  }

  // Convert array to object keyed by section_key
  return (data || []).reduce((acc: Record<string, any>, section) => {
    acc[section.section_key] = section.content;
    return acc;
  }, {});
}

// Homepage Data Fetching - Now fully dynamic from database
export async function getHomepageData() {
  try {
    console.log('🔍 Fetching homepage data from Supabase...');
    
    // Fetch all data in parallel
    const [
      sections,
      { data: featuredWeddings, error: weddingsError },
      { data: locations, error: locationsError },
      { data: fotoboxServices, error: fotoboxError },
      { data: blogPosts, error: blogError },
      { data: reviews, error: reviewsError }
    ] = await Promise.all([
      getHomepageSections(),
      supabase.from('weddings').select('*').eq('featured', true).eq('published', true).limit(6),
      supabase.from('locations').select('*').eq('published', true).limit(8),
      supabase.from('fotobox_services').select('*').eq('published', true).order('display_order', { ascending: true }).order('price', { ascending: true }).limit(3),
      supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(6),
      supabase.from('reviews').select('*').eq('published', true).limit(6)
    ]);

    // Error logging
    if (weddingsError) console.error('❌ Weddings error:', weddingsError);
    if (locationsError) console.error('❌ Locations error:', locationsError);
    if (fotoboxError) console.error('❌ Fotobox error:', fotoboxError);
    if (blogError) console.error('❌ Blog error:', blogError);
    if (reviewsError) console.error('❌ Reviews error:', reviewsError);

    console.log('📊 Data fetched:', {
      sections: Object.keys(sections).length,
      weddings: featuredWeddings?.length || 0,
      locations: locations?.length || 0,
      fotobox: fotoboxServices?.length || 0,
      blog: blogPosts?.length || 0,
      reviews: reviews?.length || 0
    });

    return {
      // Section content from database
      hero: sections.hero || {},
      about: sections.about || {},
      services: sections.services || {},
      portfolioConfig: sections.portfolio || {},
      fotoboxConfig: sections.fotobox || {},
      testimonialsConfig: sections.testimonials || {},
      blogConfig: sections.blog || {},
      faq: sections.faq || {},
      contact: sections.contact || {},
      
      // Dynamic data from content tables
      portfolio: { 
        weddings: featuredWeddings || [], 
        locations: locations || [] 
      },
      fotobox: fotoboxServices || [],
      testimonials: reviews || [],
      blog: blogPosts || []
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}

// Schema.org Data Fetching
export async function getSchemaData(type: string, id?: string) {
  try {
    const { data } = await supabase
      .from('structured_data')
      .select('schema_data')
      .eq('content_type', type)
      .eq('content_id', id || 'homepage')
      .single();

    return data?.schema_data;
  } catch (error) {
    console.error('Error fetching schema data:', error);
    return null;
  }
}

// Generate Homepage Schema.org
export async function generateHomepageSchema() {
  try {
    const { data: business } = await supabase
      .from('structured_data')
      .select('schema_data')
      .eq('content_type', 'LocalBusiness')
      .single();

    return {
      '@context': 'https://schema.org',
      '@graph': [
        business?.schema_data || {
          '@type': 'LocalBusiness',
          '@id': 'https://www.dz-photo.at/#business',
          'name': 'Daniel Zangerle - DZ-Photo',
          'description': 'Professionelle Hochzeitsfotografie in Oberösterreich',
          'url': 'https://www.dz-photo.at',
          'telephone': '+43XXXXXXXXX',
          'email': 'info@dz-photo.at',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Wels',
            'addressRegion': 'Oberösterreich',
            'addressCountry': 'AT'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 48.1598,
            'longitude': 14.0254
          },
          'openingHours': 'Mo-Fr 09:00-18:00',
          'priceRange': '€€€'
        },
        {
          '@type': 'WebSite',
          '@id': 'https://www.dz-photo.at/#website',
          'url': 'https://www.dz-photo.at',
          'name': 'Daniel Zangerle Hochzeitsfotografie',
          'description': 'Professionelle Hochzeitsfotografie in Oberösterreich',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://www.dz-photo.at/blog?search={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'Person',
          '@id': 'https://www.dz-photo.at/#person',
          'name': 'Daniel Zangerle',
          'jobTitle': 'Hochzeitsfotograf',
          'worksFor': {
            '@id': 'https://www.dz-photo.at/#business'
          },
          'url': 'https://www.dz-photo.at',
          'sameAs': [
            'https://instagram.com/dzphoto',
            'https://facebook.com/dzphoto'
          ]
        }
      ]
    };
  } catch (error) {
    console.error('Error generating homepage schema:', error);
    return null;
  }
}

// Wedding Data Fetching
export async function getWeddingBySlug(slug: string): Promise<Wedding | null> {
  try {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching wedding:', error);
    return null;
  }
}

export async function getAllWeddings(): Promise<Wedding[]> {
  try {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('published', true)
      .order('wedding_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching weddings:', error);
    return [];
  }
}

// Location Data Fetching
export async function getLocationBySlug(slug: string): Promise<Location | null> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

export async function getAllLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('published', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

// Blog Data Fetching
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fotobox Data Fetching
export async function getFotoboxServiceBySlug(slug: string): Promise<FotoboxService | null> {
  try {
    const { data, error } = await supabase
      .from('fotobox_services')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching fotobox service:', error);
    return null;
  }
}

export async function getAllFotoboxServices(): Promise<FotoboxService[]> {
  try {
    const { data, error } = await supabase
      .from('fotobox_services')
      .select('*')
      .eq('published', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching fotobox services:', error);
    return [];
  }
}

// Static Params Generation for ISR
export async function generateWeddingStaticParams() {
  const weddings = await getAllWeddings();
  return weddings.map((wedding) => ({
    slug: wedding.slug,
  }));
}

export async function generateLocationStaticParams() {
  const locations = await getAllLocations();
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateBlogStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateFotoboxStaticParams() {
  const services = await getAllFotoboxServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}
