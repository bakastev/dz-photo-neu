import { supabase } from './supabase';
import type { Wedding, Location, BlogPost, FotoboxService, Review, Page } from './supabase';

// Homepage Data Fetching
export async function getHomepageData() {
  try {
    console.log('🔍 Fetching homepage data from Supabase...');
    console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Supabase Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
    
    const [
      { data: featuredWeddings, error: weddingsError },
      { data: locations, error: locationsError },
      { data: fotoboxServices, error: fotoboxError },
      { data: blogPosts, error: blogError },
      { data: reviews, error: reviewsError },
      { data: aboutData, error: aboutError }
    ] = await Promise.all([
      supabase.from('weddings').select('*').eq('featured', true).eq('published', true).limit(6),
      supabase.from('locations').select('*').eq('published', true).limit(8),
      supabase.from('fotobox_services').select('*').eq('published', true).limit(3),
      supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(6),
      supabase.from('reviews').select('*').eq('published', true).limit(6),
      supabase.from('pages').select('*').eq('slug', 'ueber-mich').eq('published', true).limit(1)
    ]);

      // Detailed error logging
      if (weddingsError) console.error('❌ Weddings error:', weddingsError);
      if (locationsError) console.error('❌ Locations error:', locationsError);
      if (fotoboxError) console.error('❌ Fotobox error:', fotoboxError);
      if (blogError) console.error('❌ Blog error:', blogError);
      if (reviewsError) console.error('❌ Reviews error:', reviewsError);
      if (aboutError) console.error('❌ About error:', aboutError);

      console.log('📊 Data fetched:', {
        weddings: featuredWeddings && featuredWeddings.length || 0,
        locations: (locations?.length ?? 0) || 0,
        fotobox: (fotoboxServices?.length ?? 0) || 0,
        blog: (blogPosts?.length ?? 0) || 0,
        reviews: (reviews?.length ?? 0) || 0
      });
      
      // Detailed data inspection
      console.log('🔍 Sample data:');
      if (featuredWeddings && featuredWeddings.length > 0) {
        console.log('  Wedding sample:', {
          id: featuredWeddings[0].id,
          title: featuredWeddings[0].title,
          featured: featuredWeddings[0].featured,
          published: featuredWeddings[0].published
        });
      }
      if (locations && ((locations?.length ?? 0) ?? 0) > 0) {
        console.log('  Location sample:', {
          id: locations[0].id,
          name: locations[0].name,
          published: locations[0].published
        });
      }

    return {
      hero: {
        title: 'Professioneller Hochzeitsfotograf Oberösterreich',
        subtitle: 'Daniel Zangerle',
        description: 'Emotionale Hochzeitsreportagen, traumhafte Locations und professionelle Fotobox-Services',
        ctaPrimary: 'Jetzt Termin anfragen',
        ctaSecondary: 'Portfolio ansehen'
      },
      about: aboutData?.[0] || null,
      services: {
        wedding: { 
          title: 'Hochzeitsfotografie', 
          description: 'Emotionale Momente Ihres besonderen Tages',
          icon: 'Heart',
          features: ['Ganztägige Begleitung', 'Professionelle Nachbearbeitung', 'Online-Galerie']
        },
        locations: { 
          title: 'Traumhafte Locations', 
          description: 'Die schönsten Hochzeitslocations in Oberösterreich',
          icon: 'MapPin',
          features: ['Location-Scouting', 'Beste Fotospots', 'Regionale Expertise']
        },
        fotobox: { 
          title: 'Fotobox Services', 
          description: 'Unvergessliche Momente mit unserer Deluxe-Fotobox',
          icon: 'Camera',
          features: ['Sofortausdrucke', 'Online-Galerie', 'Accessoires inklusive']
        }
      },
      portfolio: { 
        weddings: featuredWeddings || [], 
        locations: locations || [] 
      },
      fotobox: fotoboxServices || [],
      testimonials: reviews || [],
      blog: blogPosts || [],
      faq: [
        {
          question: 'Wie weit im Voraus sollte ich buchen?',
          answer: 'Idealerweise 6-12 Monate vor Ihrem Hochzeitstermin, besonders für beliebte Termine wie Samstage im Sommer.'
        },
        {
          question: 'Was ist in meinem Hochzeitspaket enthalten?',
          answer: 'Ganztägige Begleitung, professionelle Nachbearbeitung aller Bilder, Online-Galerie und Auswahl der schönsten Momente.'
        },
        {
          question: 'Können wir ein Verlobungsshooting machen?',
          answer: 'Ja, gerne! Ein Verlobungsshooting ist eine perfekte Gelegenheit, sich vor der Hochzeit kennenzulernen.'
        },
        {
          question: 'Wie lange dauert die Bildbearbeitung?',
          answer: 'In der Regel erhalten Sie Ihre fertig bearbeiteten Bilder 2-4 Wochen nach der Hochzeit.'
        },
        {
          question: 'Arbeiten Sie auch außerhalb von Oberösterreich?',
          answer: 'Ja, ich fotografiere gerne auch in ganz Österreich und darüber hinaus. Reisekosten werden individuell berechnet.'
        }
      ],
      contact: {
        phone: '+43 XXX XXX XXX',
        email: 'info@dz-photo.at',
        address: 'Oberösterreich, Wels & Umgebung',
        socialMedia: {
          instagram: 'https://instagram.com/dzphoto',
          facebook: 'https://facebook.com/dzphoto'
        }
      }
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
