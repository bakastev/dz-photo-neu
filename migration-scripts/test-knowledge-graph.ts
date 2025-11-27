#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function testKnowledgeGraph() {
  console.log('🧪 Testing Knowledge Graph System...');
  
  // 1. Test Entity Queries
  console.log('\n🔍 Testing Entity Queries...');
  await testEntityQueries();
  
  // 2. Test Relation Queries
  console.log('\n🔗 Testing Relation Queries...');
  await testRelationQueries();
  
  // 3. Test Graph Traversal
  console.log('\n🌐 Testing Graph Traversal...');
  await testGraphTraversal();
  
  // 4. Test Content-Entity Mappings
  console.log('\n📄 Testing Content-Entity Mappings...');
  await testContentEntityMappings();
  
  // 5. Test Similarity Queries
  console.log('\n🔄 Testing Similarity Queries...');
  await testSimilarityQueries();
  
  console.log('\n✅ Knowledge Graph testing completed!');
}

async function testEntityQueries() {
  // Get entity counts by type
  const { data: entityCounts } = await supabase
    .from('entities')
    .select('type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('📊 Entity counts by type:');
  if (entityCounts) {
    for (const [type, count] of entityCounts) {
      console.log(`  ${type}: ${count}`);
    }
  }
  
  // Find specific entities
  const { data: photographers } = await supabase
    .from('entities')
    .select('*')
    .eq('type', 'photographer');
  
  console.log(`\n📸 Found ${photographers?.length || 0} photographers:`);
  photographers?.forEach(p => console.log(`  - ${p.name}`));
  
  const { data: venues } = await supabase
    .from('entities')
    .select('*')
    .eq('type', 'venue')
    .limit(5);
  
  console.log(`\n🏰 Sample venues (first 5):`);
  venues?.forEach(v => console.log(`  - ${v.name} (${v.properties?.city || 'Unknown city'})`));
  
  const { data: couples } = await supabase
    .from('entities')
    .select('*')
    .eq('type', 'person')
    .limit(5);
  
  console.log(`\n💑 Sample couples (first 5):`);
  couples?.forEach(c => console.log(`  - ${c.name} (${c.properties?.wedding_slug || 'Unknown wedding'})`));
}

async function testRelationQueries() {
  // Get relation counts by type
  const { data: relationCounts } = await supabase
    .from('relations')
    .select('relation_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, relation) => {
        acc[relation.relation_type] = (acc[relation.relation_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('📊 Relation counts by type:');
  if (relationCounts) {
    for (const [type, count] of relationCounts) {
      console.log(`  ${type}: ${count}`);
    }
  }
  
  // Find married couples
  const { data: marriedCouples } = await supabase
    .from('relations')
    .select(`
      *,
      from_entity:from_entity_id(name, type),
      to_entity:to_entity_id(name, type)
    `)
    .eq('relation_type', 'married_to')
    .limit(5);
  
  console.log(`\n💑 Sample married couples:`);
  marriedCouples?.forEach(r => {
    console.log(`  - ${r.from_entity?.name} ↔ ${r.to_entity?.name}`);
  });
  
  // Find photographer relations
  const { data: photographerRelations } = await supabase
    .from('relations')
    .select(`
      *,
      from_entity:from_entity_id(name, type),
      to_entity:to_entity_id(name, type)
    `)
    .eq('relation_type', 'photographed_by')
    .limit(5);
  
  console.log(`\n📸 Sample photographer relations:`);
  photographerRelations?.forEach(r => {
    console.log(`  - ${r.from_entity?.name} → photographed by → ${r.to_entity?.name}`);
  });
}

async function testGraphTraversal() {
  // Find a person entity to start traversal from
  const { data: person } = await supabase
    .from('entities')
    .select('*')
    .eq('type', 'person')
    .limit(1)
    .single();
  
  if (!person) {
    console.log('❌ No person entity found for traversal test');
    return;
  }
  
  console.log(`🚶 Starting graph traversal from: ${person.name}`);
  
  // Find all direct relations from this person
  const { data: directRelations } = await supabase
    .from('relations')
    .select(`
      *,
      to_entity:to_entity_id(name, type, properties)
    `)
    .eq('from_entity_id', person.id);
  
  console.log(`\n🔗 Direct relations from ${person.name}:`);
  directRelations?.forEach(r => {
    console.log(`  - ${r.relation_type} → ${r.to_entity?.name} (${r.to_entity?.type})`);
  });
  
  // Find second-degree relations (relations of relations)
  if (directRelations && directRelations.length > 0) {
    const relatedEntityIds = directRelations.map(r => r.to_entity_id);
    
    const { data: secondDegreeRelations } = await supabase
      .from('relations')
      .select(`
        *,
        from_entity:from_entity_id(name, type),
        to_entity:to_entity_id(name, type)
      `)
      .in('from_entity_id', relatedEntityIds)
      .neq('to_entity_id', person.id) // Avoid going back to start
      .limit(10);
    
    console.log(`\n🔗🔗 Second-degree relations:`);
    secondDegreeRelations?.forEach(r => {
      console.log(`  - ${r.from_entity?.name} → ${r.relation_type} → ${r.to_entity?.name}`);
    });
  }
}

async function testContentEntityMappings() {
  // Get content-entity mapping counts
  const { data: mappingCounts } = await supabase
    .from('content_entities')
    .select('content_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, mapping) => {
        acc[mapping.content_type] = (acc[mapping.content_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  console.log('📊 Content-Entity mappings by content type:');
  if (mappingCounts) {
    for (const [type, count] of mappingCounts) {
      console.log(`  ${type}: ${count} mappings`);
    }
  }
  
  // Find entities for a specific wedding
  const { data: weddingMappings } = await supabase
    .from('content_entities')
    .select(`
      *,
      entity:entities(name, type, properties)
    `)
    .eq('content_type', 'wedding')
    .limit(10);
  
  console.log(`\n💒 Sample wedding-entity mappings:`);
  weddingMappings?.forEach(m => {
    console.log(`  - ${m.entity?.name} (${m.entity?.type}) - relevance: ${m.relevance}`);
  });
  
  // Find high-relevance mappings
  const { data: highRelevanceMappings } = await supabase
    .from('content_entities')
    .select(`
      *,
      entity:entities(name, type)
    `)
    .gte('relevance', 0.9)
    .limit(10);
  
  console.log(`\n⭐ High-relevance mappings (≥0.9):`);
  highRelevanceMappings?.forEach(m => {
    console.log(`  - ${m.entity?.name} (${m.entity?.type}) in ${m.content_type} - ${m.relevance}`);
  });
}

async function testSimilarityQueries() {
  // Find similar venues
  const { data: similarVenues } = await supabase
    .from('relations')
    .select(`
      *,
      from_entity:from_entity_id(name, type, properties),
      to_entity:to_entity_id(name, type, properties)
    `)
    .eq('relation_type', 'similar_to')
    .eq('from_entity.type', 'venue')
    .gte('strength', 0.7)
    .limit(10);
  
  console.log(`\n🏰 Similar venues (strength ≥0.7):`);
  similarVenues?.forEach(r => {
    console.log(`  - ${r.from_entity?.name} ↔ ${r.to_entity?.name} (${r.strength})`);
  });
  
  // Find similar services
  const { data: similarServices } = await supabase
    .from('relations')
    .select(`
      *,
      from_entity:from_entity_id(name, type, properties),
      to_entity:to_entity_id(name, type, properties)
    `)
    .eq('relation_type', 'similar_to')
    .eq('from_entity.type', 'service')
    .limit(5);
  
  console.log(`\n🛠️ Similar services:`);
  similarServices?.forEach(r => {
    console.log(`  - ${r.from_entity?.name} ↔ ${r.to_entity?.name} (${r.strength})`);
  });
}

async function demonstrateUseCases() {
  console.log('\n🎯 Demonstrating Real-World Use Cases...');
  
  // Use Case 1: Find all venues in a specific region
  console.log('\n1️⃣ Find venues in Oberösterreich:');
  const { data: oberosterreichVenues } = await supabase
    .from('entities')
    .select('*')
    .eq('type', 'venue')
    .like('properties->>region', '%Oberösterreich%');
  
  console.log(`Found ${oberosterreichVenues?.length || 0} venues in Oberösterreich`);
  oberosterreichVenues?.slice(0, 3).forEach(v => {
    console.log(`  - ${v.name} in ${v.properties?.city}`);
  });
  
  // Use Case 2: Find couples who got married at similar venues
  console.log('\n2️⃣ Find couples at similar venues:');
  const { data: venueRelations } = await supabase
    .from('relations')
    .select(`
      *,
      from_entity:from_entity_id(name, type),
      to_entity:to_entity_id(name, type)
    `)
    .eq('relation_type', 'wedding_at')
    .limit(5);
  
  console.log(`Found ${venueRelations?.length || 0} wedding-venue relations`);
  venueRelations?.forEach(r => {
    console.log(`  - ${r.from_entity?.name} married at ${r.to_entity?.name}`);
  });
  
  // Use Case 3: Find all services provided by photographer
  console.log('\n3️⃣ Services provided by Daniel Zangerle:');
  const { data: photographerServices } = await supabase
    .from('relations')
    .select(`
      *,
      from_entity:from_entity_id(name, type),
      to_entity:to_entity_id(name, type)
    `)
    .eq('relation_type', 'provides')
    .eq('from_entity.name', 'Daniel Zangerle')
    .limit(10);
  
  console.log(`Found ${photographerServices?.length || 0} services`);
  photographerServices?.forEach(r => {
    console.log(`  - ${r.to_entity?.name}`);
  });
}

// Run all tests
if (require.main === module) {
  testKnowledgeGraph()
    .then(() => demonstrateUseCases())
    .catch(console.error);
}

export { testKnowledgeGraph };
