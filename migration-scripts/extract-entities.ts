#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

interface Entity {
  name: string;
  type: 'person' | 'location' | 'venue' | 'service' | 'event' | 'date' | 'style' | 'photographer';
  description?: string;
  properties: any;
  confidence: number;
}

interface ExtractedEntities {
  persons: Entity[];
  locations: Entity[];
  venues: Entity[];
  services: Entity[];
  events: Entity[];
  dates: Entity[];
  styles: Entity[];
}

async function extractEntitiesFromText(text: string, contentType: string): Promise<ExtractedEntities> {
  // Call Supabase Edge Function for entity extraction
  const { data, error } = await supabase.functions.invoke('extract-entities', {
    body: { text, contentType }
  });
  
  if (error) {
    console.error('Error extracting entities:', error);
    return {
      persons: [],
      locations: [],
      venues: [],
      services: [],
      events: [],
      dates: [],
      styles: []
    };
  }
  
  return data.entities;
}

async function extractAllEntities() {
  console.log('🔍 Starting entity extraction...');
  
  const allEntities: Entity[] = [];
  const contentEntityMappings: any[] = [];
  
  // 1. Extract from Weddings
  console.log('\n🤵👰 Extracting entities from weddings...');
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*');
  
  if (weddings) {
    for (const wedding of weddings) {
      const text = [
        wedding.title,
        wedding.couple_names,
        wedding.description,
        wedding.location
      ].filter(Boolean).join(' ');
      
      // Extract couple names manually (more reliable than AI for this)
      if (wedding.couple_names) {
        const coupleNames = wedding.couple_names.split(/[&+,]/).map(name => name.trim());
        
        for (const name of coupleNames) {
          if (name && name.length > 1) {
            const entity: Entity = {
              name: name,
              type: 'person',
              description: `Braut/Bräutigam aus Hochzeit ${wedding.slug}`,
              properties: {
                role: 'couple',
                wedding_slug: wedding.slug,
                wedding_date: wedding.wedding_date
              },
              confidence: 0.95
            };
            
            allEntities.push(entity);
            
            // Map to content
            contentEntityMappings.push({
              content_type: 'wedding',
              content_id: wedding.id,
              entity_name: name,
              entity_type: 'person',
              relevance: 1.0,
              context: 'couple_names'
            });
          }
        }
      }
      
      // Extract location/venue
      if (wedding.location) {
        const entity: Entity = {
          name: wedding.location,
          type: 'venue',
          description: `Hochzeitslocation für ${wedding.couple_names}`,
          properties: {
            wedding_slug: wedding.slug,
            couple: wedding.couple_names
          },
          confidence: 0.8
        };
        
        allEntities.push(entity);
        
        contentEntityMappings.push({
          content_type: 'wedding',
          content_id: wedding.id,
          entity_name: wedding.location,
          entity_type: 'venue',
          relevance: 0.9,
          context: 'wedding_location'
        });
      }
      
      // Extract photographer (Daniel Zangerle)
      const photographer: Entity = {
        name: 'Daniel Zangerle',
        type: 'photographer',
        description: 'Professioneller Hochzeitsfotograf von dz-photo',
        properties: {
          business: 'dz-photo',
          specialization: 'wedding_photography'
        },
        confidence: 1.0
      };
      
      allEntities.push(photographer);
      
      contentEntityMappings.push({
        content_type: 'wedding',
        content_id: wedding.id,
        entity_name: 'Daniel Zangerle',
        entity_type: 'photographer',
        relevance: 1.0,
        context: 'photographer'
      });
      
      console.log(`✅ Processed wedding: ${wedding.slug}`);
    }
  }
  
  // 2. Extract from Locations
  console.log('\n🏰 Extracting entities from locations...');
  const { data: locations } = await supabase
    .from('locations')
    .select('*');
  
  if (locations) {
    for (const location of locations) {
      // Venue entity
      const venueEntity: Entity = {
        name: location.name,
        type: 'venue',
        description: location.description,
        properties: {
          slug: location.slug,
          city: location.city,
          region: location.region,
          capacity_min: location.capacity_min,
          capacity_max: location.capacity_max,
          features: location.features,
          website: location.website,
          phone: location.phone
        },
        confidence: 1.0
      };
      
      allEntities.push(venueEntity);
      
      contentEntityMappings.push({
        content_type: 'location',
        content_id: location.id,
        entity_name: location.name,
        entity_type: 'venue',
        relevance: 1.0,
        context: 'main_venue'
      });
      
      // City/Region entities
      if (location.city) {
        const cityEntity: Entity = {
          name: location.city,
          type: 'location',
          description: `Stadt in ${location.region}`,
          properties: {
            region: location.region,
            type: 'city'
          },
          confidence: 0.9
        };
        
        allEntities.push(cityEntity);
        
        contentEntityMappings.push({
          content_type: 'location',
          content_id: location.id,
          entity_name: location.city,
          entity_type: 'location',
          relevance: 0.8,
          context: 'city'
        });
      }
      
      if (location.region) {
        const regionEntity: Entity = {
          name: location.region,
          type: 'location',
          description: 'Region in Österreich',
          properties: {
            type: 'region',
            country: 'Austria'
          },
          confidence: 0.9
        };
        
        allEntities.push(regionEntity);
        
        contentEntityMappings.push({
          content_type: 'location',
          content_id: location.id,
          entity_name: location.region,
          entity_type: 'location',
          relevance: 0.7,
          context: 'region'
        });
      }
      
      console.log(`✅ Processed location: ${location.slug}`);
    }
  }
  
  // 3. Extract from Blog Posts
  console.log('\n📝 Extracting entities from blog posts...');
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (blogPosts) {
    for (const post of blogPosts) {
      // Wedding tip/advice entity
      if (post.number) {
        const tipEntity: Entity = {
          name: `Hochzeitstipp ${post.number}`,
          type: 'service',
          description: post.title,
          properties: {
            slug: post.slug,
            number: post.number,
            category: 'wedding_advice',
            content_type: 'tip'
          },
          confidence: 0.8
        };
        
        allEntities.push(tipEntity);
        
        contentEntityMappings.push({
          content_type: 'blog',
          content_id: post.id,
          entity_name: `Hochzeitstipp ${post.number}`,
          entity_type: 'service',
          relevance: 1.0,
          context: 'main_topic'
        });
      }
      
      // Extract wedding-related services mentioned in tips
      const weddingServices = extractWeddingServicesFromText(post.title + ' ' + post.content);
      for (const service of weddingServices) {
        allEntities.push(service);
        
        contentEntityMappings.push({
          content_type: 'blog',
          content_id: post.id,
          entity_name: service.name,
          entity_type: service.type,
          relevance: 0.6,
          context: 'mentioned_service'
        });
      }
      
      console.log(`✅ Processed blog post: ${post.slug}`);
    }
  }
  
  // 4. Extract from Fotobox Services
  console.log('\n📸 Extracting entities from fotobox services...');
  const { data: services } = await supabase
    .from('fotobox_services')
    .select('*');
  
  if (services) {
    for (const service of services) {
      const serviceEntity: Entity = {
        name: service.name,
        type: 'service',
        description: service.description,
        properties: {
          slug: service.slug,
          service_type: service.service_type,
          price: service.price,
          currency: service.currency,
          popular: service.popular,
          features: service.features,
          category: 'fotobox'
        },
        confidence: 1.0
      };
      
      allEntities.push(serviceEntity);
      
      contentEntityMappings.push({
        content_type: 'fotobox',
        content_id: service.id,
        entity_name: service.name,
        entity_type: 'service',
        relevance: 1.0,
        context: 'main_service'
      });
      
      console.log(`✅ Processed fotobox service: ${service.slug}`);
    }
  }
  
  // 5. Extract from Reviews
  console.log('\n⭐ Extracting entities from reviews...');
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*');
  
  if (reviews) {
    for (const review of reviews) {
      // Customer entity
      if (review.author_name) {
        const customerEntity: Entity = {
          name: review.author_name,
          type: 'person',
          description: `Kunde von dz-photo`,
          properties: {
            role: 'customer',
            rating: review.rating,
            review_source: review.source
          },
          confidence: 0.9
        };
        
        allEntities.push(customerEntity);
        
        contentEntityMappings.push({
          content_type: 'review',
          content_id: review.id,
          entity_name: review.author_name,
          entity_type: 'person',
          relevance: 1.0,
          context: 'review_author'
        });
      }
      
      console.log(`✅ Processed review: ${review.author_name}`);
    }
  }
  
  // Remove duplicates and store entities
  console.log('\n💾 Storing entities in database...');
  const uniqueEntities = removeDuplicateEntities(allEntities);
  
  let storedEntities = 0;
  let errors = 0;
  
  for (const entity of uniqueEntities) {
    try {
      const { data, error } = await supabase
        .from('entities')
        .upsert({
          name: entity.name,
          type: entity.type,
          description: entity.description,
          properties: entity.properties,
          confidence: entity.confidence
        }, {
          onConflict: 'name,type'
        })
        .select('id')
        .single();
      
      if (error) {
        console.error(`❌ Error storing entity ${entity.name}:`, error);
        errors++;
      } else {
        storedEntities++;
        
        // Store content-entity mappings
        const relevantMappings = contentEntityMappings.filter(
          m => m.entity_name === entity.name && m.entity_type === entity.type
        );
        
        for (const mapping of relevantMappings) {
          await supabase
            .from('content_entities')
            .upsert({
              content_type: mapping.content_type,
              content_id: mapping.content_id,
              entity_id: data.id,
              relevance: mapping.relevance,
              context: mapping.context
            }, {
              onConflict: 'content_type,content_id,entity_id'
            });
        }
      }
    } catch (error) {
      console.error(`❌ Error processing entity ${entity.name}:`, error);
      errors++;
    }
  }
  
  console.log(`\n✅ Entity extraction completed!`);
  console.log(`📊 Stored: ${storedEntities}, Errors: ${errors}, Total: ${uniqueEntities.length}`);
}

function extractWeddingServicesFromText(text: string): Entity[] {
  const services: Entity[] = [];
  const lowerText = text.toLowerCase();
  
  // Common wedding services mentioned in tips
  const serviceKeywords = {
    'Hochzeitsfotografie': ['fotograf', 'photography', 'foto'],
    'Fotobox': ['fotobox', 'photobooth'],
    'Hochzeitsplanung': ['planung', 'planner', 'organisation'],
    'Catering': ['catering', 'essen', 'buffet'],
    'Musik': ['musik', 'dj', 'band'],
    'Blumen': ['blumen', 'florist', 'dekoration'],
    'Hochzeitstorte': ['torte', 'kuchen', 'cake'],
    'Einladungen': ['einladung', 'karte', 'invitation'],
    'Hochzeitskleid': ['kleid', 'dress', 'brautkleid'],
    'Anzug': ['anzug', 'suit', 'smoking']
  };
  
  for (const [serviceName, keywords] of Object.entries(serviceKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        services.push({
          name: serviceName,
          type: 'service',
          description: `Hochzeitsservice: ${serviceName}`,
          properties: {
            category: 'wedding_service',
            keywords: keywords
          },
          confidence: 0.7
        });
        break; // Only add once per service
      }
    }
  }
  
  return services;
}

function removeDuplicateEntities(entities: Entity[]): Entity[] {
  const seen = new Set<string>();
  const unique: Entity[] = [];
  
  for (const entity of entities) {
    const key = `${entity.name.toLowerCase()}-${entity.type}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(entity);
    }
  }
  
  return unique;
}

// Run entity extraction
if (require.main === module) {
  extractAllEntities().catch(console.error);
}

export { extractAllEntities };
