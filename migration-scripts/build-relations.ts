#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

interface Entity {
  id: string;
  name: string;
  type: string;
  properties: any;
}

interface Relation {
  from_entity_id: string;
  to_entity_id: string;
  relation_type: string;
  strength: number;
  metadata: any;
}

async function buildAllRelations() {
  console.log('🔗 Starting relation building...');
  
  // Load all entities
  const { data: entities } = await supabase
    .from('entities')
    .select('*');
  
  if (!entities) {
    console.error('❌ No entities found');
    return;
  }
  
  console.log(`📊 Found ${entities.length} entities`);
  
  const relations: Relation[] = [];
  
  // 1. Build couple relations (married_to)
  console.log('\n💑 Building couple relations...');
  const coupleRelations = await buildCoupleRelations(entities);
  relations.push(...coupleRelations);
  console.log(`✅ Created ${coupleRelations.length} couple relations`);
  
  // 2. Build photographer relations (photographed_by)
  console.log('\n📸 Building photographer relations...');
  const photographerRelations = await buildPhotographerRelations(entities);
  relations.push(...photographerRelations);
  console.log(`✅ Created ${photographerRelations.length} photographer relations`);
  
  // 3. Build wedding venue relations (wedding_at)
  console.log('\n🏰 Building wedding venue relations...');
  const venueRelations = await buildWeddingVenueRelations(entities);
  relations.push(...venueRelations);
  console.log(`✅ Created ${venueRelations.length} venue relations`);
  
  // 4. Build location hierarchy relations (located_in)
  console.log('\n🗺️ Building location hierarchy relations...');
  const locationRelations = await buildLocationHierarchyRelations(entities);
  relations.push(...locationRelations);
  console.log(`✅ Created ${locationRelations.length} location relations`);
  
  // 5. Build service relations (provides, offers_service)
  console.log('\n🛠️ Building service relations...');
  const serviceRelations = await buildServiceRelations(entities);
  relations.push(...serviceRelations);
  console.log(`✅ Created ${serviceRelations.length} service relations`);
  
  // 6. Build content feature relations (featured_in)
  console.log('\n⭐ Building content feature relations...');
  const featureRelations = await buildContentFeatureRelations(entities);
  relations.push(...featureRelations);
  console.log(`✅ Created ${featureRelations.length} feature relations`);
  
  // 7. Build similarity relations (similar_to)
  console.log('\n🔄 Building similarity relations...');
  const similarityRelations = await buildSimilarityRelations(entities);
  relations.push(...similarityRelations);
  console.log(`✅ Created ${similarityRelations.length} similarity relations`);
  
  // Store all relations
  console.log('\n💾 Storing relations in database...');
  let storedRelations = 0;
  let errors = 0;
  
  for (const relation of relations) {
    try {
      const { error } = await supabase
        .from('relations')
        .upsert({
          from_entity_id: relation.from_entity_id,
          to_entity_id: relation.to_entity_id,
          relation_type: relation.relation_type,
          strength: relation.strength,
          metadata: relation.metadata
        }, {
          onConflict: 'from_entity_id,to_entity_id,relation_type'
        });
      
      if (error) {
        console.error(`❌ Error storing relation:`, error);
        errors++;
      } else {
        storedRelations++;
      }
    } catch (error) {
      console.error(`❌ Error processing relation:`, error);
      errors++;
    }
  }
  
  console.log(`\n✅ Relation building completed!`);
  console.log(`📊 Stored: ${storedRelations}, Errors: ${errors}, Total: ${relations.length}`);
}

async function buildCoupleRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  const couples: { [key: string]: Entity[] } = {};
  
  // Group people by wedding
  for (const entity of entities) {
    if (entity.type === 'person' && entity.properties?.role === 'couple') {
      const weddingSlug = entity.properties.wedding_slug;
      if (weddingSlug) {
        if (!couples[weddingSlug]) couples[weddingSlug] = [];
        couples[weddingSlug].push(entity);
      }
    }
  }
  
  // Create married_to relations for each couple
  for (const [weddingSlug, coupleMembers] of Object.entries(couples)) {
    if (coupleMembers.length === 2) {
      const [person1, person2] = coupleMembers;
      
      // Bidirectional married_to relation
      relations.push({
        from_entity_id: person1.id,
        to_entity_id: person2.id,
        relation_type: 'married_to',
        strength: 1.0,
        metadata: {
          wedding_slug: weddingSlug,
          wedding_date: person1.properties.wedding_date
        }
      });
      
      relations.push({
        from_entity_id: person2.id,
        to_entity_id: person1.id,
        relation_type: 'married_to',
        strength: 1.0,
        metadata: {
          wedding_slug: weddingSlug,
          wedding_date: person1.properties.wedding_date
        }
      });
    }
  }
  
  return relations;
}

async function buildPhotographerRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  const photographer = entities.find(e => e.type === 'photographer' && e.name === 'Daniel Zangerle');
  if (!photographer) return relations;
  
  // All couples were photographed by Daniel Zangerle
  const couples = entities.filter(e => e.type === 'person' && e.properties?.role === 'couple');
  
  for (const couple of couples) {
    relations.push({
      from_entity_id: couple.id,
      to_entity_id: photographer.id,
      relation_type: 'photographed_by',
      strength: 1.0,
      metadata: {
        wedding_slug: couple.properties.wedding_slug,
        service_type: 'wedding_photography'
      }
    });
  }
  
  // Photographer provides services
  const services = entities.filter(e => e.type === 'service');
  
  for (const service of services) {
    relations.push({
      from_entity_id: photographer.id,
      to_entity_id: service.id,
      relation_type: 'provides',
      strength: 0.9,
      metadata: {
        business: 'dz-photo',
        service_category: service.properties?.category
      }
    });
  }
  
  return relations;
}

async function buildWeddingVenueRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  // Get content-entity mappings to find wedding-venue connections
  const { data: contentEntities } = await supabase
    .from('content_entities')
    .select(`
      *,
      entity:entities(*)
    `)
    .eq('content_type', 'wedding');
  
  if (!contentEntities) return relations;
  
  // Group by content_id to find couples and venues for same wedding
  const weddingMappings: { [key: string]: any[] } = {};
  
  for (const mapping of contentEntities) {
    const contentId = mapping.content_id;
    if (!weddingMappings[contentId]) weddingMappings[contentId] = [];
    weddingMappings[contentId].push(mapping);
  }
  
  // Create wedding_at relations
  for (const [contentId, mappings] of Object.entries(weddingMappings)) {
    const couples = mappings.filter(m => m.entity?.type === 'person');
    const venues = mappings.filter(m => m.entity?.type === 'venue');
    
    for (const couple of couples) {
      for (const venue of venues) {
        relations.push({
          from_entity_id: couple.entity.id,
          to_entity_id: venue.entity.id,
          relation_type: 'wedding_at',
          strength: 0.95,
          metadata: {
            content_id: contentId,
            content_type: 'wedding'
          }
        });
      }
    }
  }
  
  return relations;
}

async function buildLocationHierarchyRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  const venues = entities.filter(e => e.type === 'venue');
  const locations = entities.filter(e => e.type === 'location');
  
  // Connect venues to cities/regions
  for (const venue of venues) {
    const venueCity = venue.properties?.city;
    const venueRegion = venue.properties?.region;
    
    if (venueCity) {
      const cityEntity = locations.find(l => l.name.toLowerCase() === venueCity.toLowerCase());
      if (cityEntity) {
        relations.push({
          from_entity_id: venue.id,
          to_entity_id: cityEntity.id,
          relation_type: 'located_in',
          strength: 0.9,
          metadata: {
            location_type: 'city'
          }
        });
      }
    }
    
    if (venueRegion) {
      const regionEntity = locations.find(l => l.name.toLowerCase() === venueRegion.toLowerCase());
      if (regionEntity) {
        relations.push({
          from_entity_id: venue.id,
          to_entity_id: regionEntity.id,
          relation_type: 'located_in',
          strength: 0.8,
          metadata: {
            location_type: 'region'
          }
        });
      }
    }
  }
  
  return relations;
}

async function buildServiceRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  const services = entities.filter(e => e.type === 'service');
  const venues = entities.filter(e => e.type === 'venue');
  
  // Venues offer wedding services
  for (const venue of venues) {
    const weddingServices = services.filter(s => 
      s.properties?.category === 'wedding_service' || 
      s.name.toLowerCase().includes('hochzeit')
    );
    
    for (const service of weddingServices) {
      relations.push({
        from_entity_id: venue.id,
        to_entity_id: service.id,
        relation_type: 'offers_service',
        strength: 0.7,
        metadata: {
          service_category: service.properties?.category
        }
      });
    }
  }
  
  // Services are suitable for events
  const weddingServices = services.filter(s => 
    s.properties?.category === 'wedding_service' || 
    s.properties?.category === 'fotobox' ||
    s.name.toLowerCase().includes('hochzeit')
  );
  
  for (const service of weddingServices) {
    // Create a wedding event entity if it doesn't exist
    let weddingEvent = entities.find(e => e.type === 'event' && e.name === 'Hochzeit');
    if (!weddingEvent) {
      // We'll create this relation conceptually
      relations.push({
        from_entity_id: service.id,
        to_entity_id: service.id, // Self-reference for now, will be updated when event entities exist
        relation_type: 'suitable_for',
        strength: 0.8,
        metadata: {
          event_type: 'wedding',
          service_category: service.properties?.category
        }
      });
    }
  }
  
  return relations;
}

async function buildContentFeatureRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  // Get all content-entity mappings
  const { data: contentEntities } = await supabase
    .from('content_entities')
    .select(`
      *,
      entity:entities(*)
    `);
  
  if (!contentEntities) return relations;
  
  // Create featured_in relations for high-relevance mappings
  for (const mapping of contentEntities) {
    if (mapping.relevance >= 0.8 && mapping.entity) {
      relations.push({
        from_entity_id: mapping.entity.id,
        to_entity_id: mapping.entity.id, // Will be updated to content entity when we have content entities
        relation_type: 'featured_in',
        strength: mapping.relevance,
        metadata: {
          content_type: mapping.content_type,
          content_id: mapping.content_id,
          context: mapping.context
        }
      });
    }
  }
  
  return relations;
}

async function buildSimilarityRelations(entities: Entity[]): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  // Similar venues (same region)
  const venues = entities.filter(e => e.type === 'venue');
  
  for (let i = 0; i < venues.length; i++) {
    for (let j = i + 1; j < venues.length; j++) {
      const venue1 = venues[i];
      const venue2 = venues[j];
      
      let similarity = 0;
      
      // Same region
      if (venue1.properties?.region === venue2.properties?.region) {
        similarity += 0.3;
      }
      
      // Same city
      if (venue1.properties?.city === venue2.properties?.city) {
        similarity += 0.4;
      }
      
      // Similar capacity
      const cap1 = venue1.properties?.capacity_max || 0;
      const cap2 = venue2.properties?.capacity_max || 0;
      if (cap1 > 0 && cap2 > 0) {
        const capSimilarity = 1 - Math.abs(cap1 - cap2) / Math.max(cap1, cap2);
        similarity += capSimilarity * 0.3;
      }
      
      if (similarity >= 0.5) {
        relations.push({
          from_entity_id: venue1.id,
          to_entity_id: venue2.id,
          relation_type: 'similar_to',
          strength: similarity,
          metadata: {
            similarity_factors: {
              region: venue1.properties?.region === venue2.properties?.region,
              city: venue1.properties?.city === venue2.properties?.city,
              capacity: cap1 > 0 && cap2 > 0
            }
          }
        });
        
        // Bidirectional
        relations.push({
          from_entity_id: venue2.id,
          to_entity_id: venue1.id,
          relation_type: 'similar_to',
          strength: similarity,
          metadata: {
            similarity_factors: {
              region: venue1.properties?.region === venue2.properties?.region,
              city: venue1.properties?.city === venue2.properties?.city,
              capacity: cap1 > 0 && cap2 > 0
            }
          }
        });
      }
    }
  }
  
  // Similar services (same category)
  const services = entities.filter(e => e.type === 'service');
  
  for (let i = 0; i < services.length; i++) {
    for (let j = i + 1; j < services.length; j++) {
      const service1 = services[i];
      const service2 = services[j];
      
      if (service1.properties?.category === service2.properties?.category) {
        relations.push({
          from_entity_id: service1.id,
          to_entity_id: service2.id,
          relation_type: 'similar_to',
          strength: 0.7,
          metadata: {
            similarity_factor: 'same_category',
            category: service1.properties.category
          }
        });
        
        relations.push({
          from_entity_id: service2.id,
          to_entity_id: service1.id,
          relation_type: 'similar_to',
          strength: 0.7,
          metadata: {
            similarity_factor: 'same_category',
            category: service1.properties.category
          }
        });
      }
    }
  }
  
  return relations;
}

// Run relation building
if (require.main === module) {
  buildAllRelations().catch(console.error);
}

export { buildAllRelations };
