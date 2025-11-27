#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

const BASE_URL = 'https://www.dz-photo.at';
const PHOTOGRAPHER_NAME = 'Daniel Zangerle';
const BUSINESS_NAME = 'dz-photo';

interface SchemaOrgData {
  '@context': string;
  '@type': string;
  '@id'?: string;
  [key: string]: any;
}

async function generateAllSchemas() {
  console.log('📊 Starting Schema.org generation...');
  
  // 1. Generate Organization Schema (Homepage)
  console.log('\n🏢 Generating Organization Schema...');
  await generateOrganizationSchema();
  
  // 2. Generate Person Schema (Photographer)
  console.log('\n👤 Generating Person Schema...');
  await generatePersonSchema();
  
  // 3. Generate Location/Place Schemas
  console.log('\n🏰 Generating Location Schemas...');
  await generateLocationSchemas();
  
  // 4. Generate Wedding Event Schemas
  console.log('\n💒 Generating Wedding Event Schemas...');
  await generateWeddingSchemas();
  
  // 5. Generate Blog Article Schemas
  console.log('\n📝 Generating Blog Article Schemas...');
  await generateBlogSchemas();
  
  // 6. Generate Service Schemas
  console.log('\n📸 Generating Service Schemas...');
  await generateServiceSchemas();
  
  // 7. Generate Review Schemas
  console.log('\n⭐ Generating Review Schemas...');
  await generateReviewSchemas();
  
  console.log('\n✅ Schema.org generation completed!');
}

async function generateOrganizationSchema() {
  // Get homepage data
  const { data: homepage } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single();
  
  if (!homepage) {
    console.error('❌ Homepage not found');
    return;
  }
  
  const organizationSchema: SchemaOrgData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#organization`,
    'name': BUSINESS_NAME,
    'alternateName': 'Daniel Zangerle Fotografie',
    'description': 'Professionelle Hochzeitsfotografie in Oberösterreich und Umgebung. Natürliche und emotionale Bilder für euren besonderen Tag.',
    'url': BASE_URL,
    'logo': `${BASE_URL}/images/logo.png`,
    'image': `${BASE_URL}/images/daniel-zangerle-photographer.jpg`,
    'telephone': '+43 664 123 456 789', // Placeholder
    'email': 'info@dz-photo.at',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Musterstraße 123',
      'addressLocality': 'Wels',
      'postalCode': '4600',
      'addressRegion': 'Oberösterreich',
      'addressCountry': 'AT'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 48.1547,
      'longitude': 13.9234
    },
    'areaServed': [
      {
        '@type': 'State',
        'name': 'Oberösterreich'
      },
      {
        '@type': 'Country',
        'name': 'Austria'
      }
    ],
    'serviceType': 'Hochzeitsfotografie',
    'priceRange': '€€€',
    'openingHours': 'Mo-Fr 09:00-18:00',
    'sameAs': [
      'https://www.facebook.com/dzphoto',
      'https://www.instagram.com/dz_photo_at',
      'https://www.linkedin.com/in/daniel-zangerle'
    ],
    'founder': {
      '@id': `${BASE_URL}/#person`
    },
    'employee': {
      '@id': `${BASE_URL}/#person`
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Hochzeitsfotografie Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Hochzeitsfotografie',
            'description': 'Professionelle Fotografie für euren besonderen Tag'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Fotobox Service',
            'description': 'Interaktive Fotobox für eure Hochzeitsfeier'
          }
        }
      ]
    }
  };
  
  // Store Organization Schema
  const { error } = await supabase
    .from('structured_data')
    .upsert({
      content_type: 'page',
      content_id: homepage.id,
      schema_type: 'LocalBusiness',
      schema_data: organizationSchema,
      priority: 1.0
    }, {
      onConflict: 'content_type,content_id,schema_type'
    });
  
  if (error) {
    console.error('❌ Error storing Organization schema:', error);
  } else {
    console.log('✅ Organization schema generated');
  }
}

async function generatePersonSchema() {
  // Get homepage for Person schema
  const { data: homepage } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single();
  
  if (!homepage) return;
  
  const personSchema: SchemaOrgData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    'name': PHOTOGRAPHER_NAME,
    'givenName': 'Daniel',
    'familyName': 'Zangerle',
    'jobTitle': 'Hochzeitsfotograf',
    'description': 'Professioneller Hochzeitsfotograf mit Leidenschaft für natürliche und emotionale Bilder.',
    'url': BASE_URL,
    'image': `${BASE_URL}/images/daniel-zangerle-portrait.jpg`,
    'email': 'daniel@dz-photo.at',
    'telephone': '+43 664 123 456 789',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Wels',
      'addressRegion': 'Oberösterreich',
      'addressCountry': 'AT'
    },
    'worksFor': {
      '@id': `${BASE_URL}/#organization`
    },
    'hasOccupation': {
      '@type': 'Occupation',
      'name': 'Hochzeitsfotograf',
      'occupationLocation': {
        '@type': 'State',
        'name': 'Oberösterreich'
      }
    },
    'knowsAbout': [
      'Hochzeitsfotografie',
      'Portraitfotografie',
      'Eventfotografie',
      'Bildbearbeitung',
      'Fotobox Services'
    ],
    'sameAs': [
      'https://www.instagram.com/dz_photo_at',
      'https://www.facebook.com/dzphoto'
    ]
  };
  
  const { error } = await supabase
    .from('structured_data')
    .upsert({
      content_type: 'page',
      content_id: homepage.id,
      schema_type: 'Person',
      schema_data: personSchema,
      priority: 0.9
    }, {
      onConflict: 'content_type,content_id,schema_type'
    });
  
  if (error) {
    console.error('❌ Error storing Person schema:', error);
  } else {
    console.log('✅ Person schema generated');
  }
}

async function generateLocationSchemas() {
  const { data: locations } = await supabase
    .from('locations')
    .select('*');
  
  if (!locations) return;
  
  let generated = 0;
  
  for (const location of locations) {
    const placeSchema: SchemaOrgData = {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${BASE_URL}/locations/${location.slug}#place`,
      'name': location.name,
      'description': location.description || `Traumhafte Hochzeitslocation ${location.name} in ${location.city}`,
      'url': `${BASE_URL}/locations/${location.slug}`,
      'image': location.cover_image || `${BASE_URL}/images/locations/${location.slug}-cover.jpg`,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': location.address || '',
        'addressLocality': location.city || '',
        'postalCode': location.postal_code || '',
        'addressRegion': location.region || 'Oberösterreich',
        'addressCountry': 'AT'
      },
      'telephone': location.phone || '',
      'email': location.email || '',
      'url': location.website || `${BASE_URL}/locations/${location.slug}`,
      'priceRange': '€€€',
      'amenityFeature': (location.features || []).map((feature: string) => ({
        '@type': 'LocationFeatureSpecification',
        'name': feature
      }))
    };
    
    // Add geo coordinates if available
    if (location.latitude && location.longitude) {
      placeSchema.geo = {
        '@type': 'GeoCoordinates',
        'latitude': location.latitude,
        'longitude': location.longitude
      };
    }
    
    // Add capacity if available
    if (location.capacity_min || location.capacity_max) {
      placeSchema.maximumAttendeeCapacity = location.capacity_max || 200;
    }
    
    const { error } = await supabase
      .from('structured_data')
      .upsert({
        content_type: 'location',
        content_id: location.id,
        schema_type: 'Place',
        schema_data: placeSchema,
        priority: 0.8
      }, {
        onConflict: 'content_type,content_id,schema_type'
      });
    
    if (error) {
      console.error(`❌ Error storing Place schema for ${location.slug}:`, error);
    } else {
      generated++;
    }
  }
  
  console.log(`✅ Generated ${generated} Place schemas`);
}

async function generateWeddingSchemas() {
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*');
  
  if (!weddings) return;
  
  let generated = 0;
  
  for (const wedding of weddings) {
    const eventSchema: SchemaOrgData = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      '@id': `${BASE_URL}/hochzeit/${wedding.slug}#event`,
      'name': wedding.title,
      'description': wedding.description || `Hochzeitsfotografie ${wedding.couple_names}`,
      'url': `${BASE_URL}/hochzeit/${wedding.slug}`,
      'image': wedding.cover_image || `${BASE_URL}/images/weddings/${wedding.slug}-cover.jpg`,
      'startDate': wedding.wedding_date || '2024-06-01',
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'organizer': {
        '@id': `${BASE_URL}/#organization`
      },
      'performer': {
        '@id': `${BASE_URL}/#person`
      },
      'about': {
        '@type': 'Thing',
        'name': 'Hochzeitsfotografie',
        'description': 'Professionelle Fotografie einer Hochzeitsfeier'
      }
    };
    
    // Add location if available
    if (wedding.location) {
      eventSchema.location = {
        '@type': 'Place',
        'name': wedding.location
      };
    }
    
    // Add attendees (couple)
    if (wedding.couple_names) {
      const names = wedding.couple_names.split(/[&+,]/).map(name => name.trim());
      eventSchema.attendee = names.map(name => ({
        '@type': 'Person',
        'name': name
      }));
    }
    
    const { error } = await supabase
      .from('structured_data')
      .upsert({
        content_type: 'wedding',
        content_id: wedding.id,
        schema_type: 'Event',
        schema_data: eventSchema,
        priority: 0.7
      }, {
        onConflict: 'content_type,content_id,schema_type'
      });
    
    if (error) {
      console.error(`❌ Error storing Event schema for ${wedding.slug}:`, error);
    } else {
      generated++;
    }
  }
  
  console.log(`✅ Generated ${generated} Event schemas`);
}

async function generateBlogSchemas() {
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (!blogPosts) return;
  
  let generated = 0;
  
  for (const post of blogPosts) {
    const articleSchema: SchemaOrgData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${BASE_URL}/tipp/${post.slug}#article`,
      'headline': post.title,
      'description': post.excerpt || post.meta_description || '',
      'url': `${BASE_URL}/tipp/${post.slug}`,
      'image': post.featured_image || `${BASE_URL}/images/blog/${post.slug}-featured.jpg`,
      'datePublished': post.published_at || post.created_at,
      'dateModified': post.updated_at,
      'author': {
        '@id': `${BASE_URL}/#person`
      },
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/tipp/${post.slug}`
      },
      'articleSection': 'Hochzeitstipps',
      'wordCount': post.word_count || 500,
      'keywords': (post.focus_keywords || []).join(', '),
      'about': {
        '@type': 'Thing',
        'name': 'Hochzeitsplanung',
        'description': 'Tipps und Ratschläge für die Hochzeitsplanung'
      }
    };
    
    // Add HowTo schema for tip articles
    if (post.slug.includes('tipp-') && post.content) {
      const howToSchema: SchemaOrgData = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        '@id': `${BASE_URL}/tipp/${post.slug}#howto`,
        'name': post.title,
        'description': post.excerpt || '',
        'image': post.featured_image || '',
        'totalTime': 'PT10M',
        'supply': [
          {
            '@type': 'HowToSupply',
            'name': 'Hochzeitsplanung'
          }
        ],
        'step': [
          {
            '@type': 'HowToStep',
            'name': 'Tipp befolgen',
            'text': post.excerpt || 'Befolgen Sie die Anweisungen in diesem Hochzeitstipp'
          }
        ]
      };
      
      // Store HowTo schema separately
      await supabase
        .from('structured_data')
        .upsert({
          content_type: 'blog',
          content_id: post.id,
          schema_type: 'HowTo',
          schema_data: howToSchema,
          priority: 0.6
        }, {
          onConflict: 'content_type,content_id,schema_type'
        });
    }
    
    const { error } = await supabase
      .from('structured_data')
      .upsert({
        content_type: 'blog',
        content_id: post.id,
        schema_type: 'BlogPosting',
        schema_data: articleSchema,
        priority: 0.7
      }, {
        onConflict: 'content_type,content_id,schema_type'
      });
    
    if (error) {
      console.error(`❌ Error storing BlogPosting schema for ${post.slug}:`, error);
    } else {
      generated++;
    }
  }
  
  console.log(`✅ Generated ${generated} BlogPosting schemas`);
}

async function generateServiceSchemas() {
  const { data: services } = await supabase
    .from('fotobox_services')
    .select('*');
  
  if (!services) return;
  
  let generated = 0;
  
  for (const service of services) {
    const serviceSchema: SchemaOrgData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${BASE_URL}/fotobox/${service.slug}#service`,
      'name': service.name,
      'description': service.description || '',
      'url': `${BASE_URL}/fotobox/${service.slug}`,
      'image': service.cover_image || `${BASE_URL}/images/fotobox/${service.slug}-cover.jpg`,
      'provider': {
        '@id': `${BASE_URL}/#organization`
      },
      'serviceType': service.service_type || 'Fotobox Service',
      'areaServed': {
        '@type': 'State',
        'name': 'Oberösterreich'
      },
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': service.name,
        'itemListElement': (service.features || []).map((feature: string) => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': feature
          }
        }))
      }
    };
    
    // Add pricing if available
    if (service.price && service.currency) {
      serviceSchema.offers = {
        '@type': 'Offer',
        'price': service.price,
        'priceCurrency': service.currency,
        'availability': 'https://schema.org/InStock'
      };
    }
    
    const { error } = await supabase
      .from('structured_data')
      .upsert({
        content_type: 'fotobox',
        content_id: service.id,
        schema_type: 'Service',
        schema_data: serviceSchema,
        priority: 0.6
      }, {
        onConflict: 'content_type,content_id,schema_type'
      });
    
    if (error) {
      console.error(`❌ Error storing Service schema for ${service.slug}:`, error);
    } else {
      generated++;
    }
  }
  
  console.log(`✅ Generated ${generated} Service schemas`);
}

async function generateReviewSchemas() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*');
  
  if (!reviews) return;
  
  let generated = 0;
  
  for (const review of reviews) {
    const reviewSchema: SchemaOrgData = {
      '@context': 'https://schema.org',
      '@type': 'Review',
      '@id': `${BASE_URL}/reviews/${review.id}#review`,
      'reviewBody': review.review_text || '',
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': review.rating || 5,
        'bestRating': 5,
        'worstRating': 1
      },
      'author': {
        '@type': 'Person',
        'name': review.author_name || 'Anonymer Kunde'
      },
      'itemReviewed': {
        '@id': `${BASE_URL}/#organization`
      },
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      },
      'datePublished': review.created_at
    };
    
    const { error } = await supabase
      .from('structured_data')
      .upsert({
        content_type: 'review',
        content_id: review.id,
        schema_type: 'Review',
        schema_data: reviewSchema,
        priority: 0.5
      }, {
        onConflict: 'content_type,content_id,schema_type'
      });
    
    if (error) {
      console.error(`❌ Error storing Review schema for ${review.id}:`, error);
    } else {
      generated++;
    }
  }
  
  console.log(`✅ Generated ${generated} Review schemas`);
}

async function testSchemaGeneration() {
  console.log('\n🧪 Testing Schema.org generation...');
  
  // Test schema retrieval function
  const { data: homepage } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .single();
  
  if (homepage) {
    const { data: schemaResult, error } = await supabase.rpc('generate_schema_jsonld', {
      p_content_type: 'page',
      p_content_id: homepage.id,
      p_base_url: BASE_URL
    });
    
    if (error) {
      console.error('❌ Error testing schema function:', error);
    } else {
      console.log('✅ Schema function works!');
      console.log('📄 Sample schema keys:', Object.keys(schemaResult || {}));
    }
  }
  
  // Count generated schemas
  const { data: schemaCount } = await supabase
    .from('structured_data')
    .select('schema_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, item) => {
        acc[item.schema_type] = (acc[item.schema_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('\n📊 Generated Schema.org types:');
  if (schemaCount) {
    for (const [type, count] of schemaCount) {
      console.log(`  ${type}: ${count} schemas`);
    }
  }
}

// Run schema generation
if (require.main === module) {
  generateAllSchemas()
    .then(() => testSchemaGeneration())
    .catch(console.error);
}

export { generateAllSchemas };
