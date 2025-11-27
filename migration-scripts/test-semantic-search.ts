#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

async function testSemanticSearch() {
  console.log('🔍 Testing Semantic Search System...');
  
  // Test queries
  const testQueries = [
    'romantische Hochzeit im Schloss',
    'Hochzeitstipps für Schuhe',
    'Fotobox für Hochzeit',
    'Hochzeitslocation in Oberösterreich',
    'Brautpaarshooting Informationen'
  ];
  
  for (const query of testQueries) {
    console.log(`\n🔍 Searching for: "${query}"`);
    
    try {
      // Generate embedding for search query
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
        body: { text: query }
      });
      
      if (embeddingError) {
        console.error('❌ Error generating embedding:', embeddingError);
        continue;
      }
      
      // Perform vector similarity search
      const { data: searchResults, error: searchError } = await supabase.rpc('match_embeddings', {
        query_embedding: embeddingData.embedding,
        match_threshold: 0.1,
        match_count: 5
      });
      
      if (searchError) {
        console.error('❌ Error searching:', searchError);
        continue;
      }
      
      console.log(`📊 Found ${searchResults?.length || 0} results:`);
      
      if (searchResults && searchResults.length > 0) {
        for (const result of searchResults) {
          console.log(`  🎯 ${result.content_type}: ${result.metadata?.slug || result.metadata?.name || 'Unknown'}`);
          console.log(`     Similarity: ${(result.similarity * 100).toFixed(1)}%`);
          console.log(`     Text: ${result.content_text.substring(0, 100)}...`);
        }
      } else {
        console.log('  No results found');
      }
      
    } catch (error) {
      console.error(`❌ Error processing query "${query}":`, error);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function testEmbeddingsStats() {
  console.log('\n📊 Embeddings Statistics:');
  
  // Count embeddings by content type
  const { data: stats } = await supabase
    .from('embeddings')
    .select('content_type')
    .then(({ data }) => {
      if (!data) return { data: [] };
      const counts = data.reduce((acc: any, item) => {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts) };
    });
  
  if (stats) {
    for (const [type, count] of stats) {
      console.log(`  ${type}: ${count} embeddings`);
    }
  }
  
  // Test vector similarity function
  console.log('\n🧪 Testing vector similarity function...');
  const { data: testResult, error } = await supabase.rpc('match_embeddings', {
    query_embedding: Array(1536).fill(0.1), // Test embedding
    match_threshold: 0.0,
    match_count: 3
  });
  
  if (error) {
    console.error('❌ Vector function error:', error);
  } else {
    console.log(`✅ Vector function works! Found ${testResult?.length || 0} results`);
  }
}

async function demonstrateUseCases() {
  console.log('\n🎯 Demonstrating Real-World Use Cases...');
  
  // Use Case 1: Find similar weddings
  console.log('\n1️⃣ Find romantic castle weddings:');
  const { data: embeddingData1 } = await supabase.functions.invoke('generate-embedding', {
    body: { text: 'romantische Hochzeit Schloss elegant' }
  });
  
  if (embeddingData1) {
    const { data: romanticWeddings } = await supabase.rpc('match_embeddings', {
      query_embedding: embeddingData1.embedding,
      match_threshold: 0.2,
      match_count: 3,
      content_type_filter: 'wedding'
    });
    
    romanticWeddings?.forEach(wedding => {
      console.log(`  💒 ${wedding.metadata?.slug}: ${(wedding.similarity * 100).toFixed(1)}% match`);
    });
  }
  
  // Use Case 2: Find wedding tips
  console.log('\n2️⃣ Find wedding shoe tips:');
  const { data: embeddingData2 } = await supabase.functions.invoke('generate-embedding', {
    body: { text: 'Hochzeitsschuhe Tipps bequem' }
  });
  
  if (embeddingData2) {
    const { data: shoeTips } = await supabase.rpc('match_embeddings', {
      query_embedding: embeddingData2.embedding,
      match_threshold: 0.2,
      match_count: 3,
      content_type_filter: 'blog'
    });
    
    shoeTips?.forEach(tip => {
      console.log(`  👠 ${tip.metadata?.slug}: ${(tip.similarity * 100).toFixed(1)}% match`);
    });
  }
  
  // Use Case 3: Find venues
  console.log('\n3️⃣ Find venues in Oberösterreich:');
  const { data: embeddingData3 } = await supabase.functions.invoke('generate-embedding', {
    body: { text: 'Hochzeitslocation Oberösterreich Venue' }
  });
  
  if (embeddingData3) {
    const { data: venues } = await supabase.rpc('match_embeddings', {
      query_embedding: embeddingData3.embedding,
      match_threshold: 0.2,
      match_count: 5,
      content_type_filter: 'location'
    });
    
    venues?.forEach(venue => {
      console.log(`  🏰 ${venue.metadata?.slug}: ${(venue.similarity * 100).toFixed(1)}% match`);
    });
  }
}

// Run all tests
if (require.main === module) {
  testEmbeddingsStats()
    .then(() => testSemanticSearch())
    .then(() => demonstrateUseCases())
    .catch(console.error);
}

export { testSemanticSearch };
