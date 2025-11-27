# OpenAI Embeddings + Entity/Relation Graph Plan
## DZ-Photo Knowledge Graph & Semantic Search System

### 🎯 Ziel
Erstelle ein intelligentes Knowledge Graph System mit OpenAI Embeddings für:
- **Semantic Search** über alle Inhalte
- **Entity Recognition** (Personen, Orte, Events, Services)
- **Relation Mapping** zwischen Entities
- **SEO-optimierte Content Discovery**
- **Intelligente Empfehlungen**

---

## 📊 Database Schema Erweiterung

### 1. Embeddings Tabelle
```sql
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'wedding', 'location', 'blog', 'fotobox', 'review', 'page'
  content_id UUID NOT NULL,
  content_text TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for vector similarity search
CREATE INDEX embeddings_vector_idx ON embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX embeddings_content_idx ON embeddings (content_type, content_id);
```

### 2. Entities Tabelle
```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'person', 'location', 'venue', 'service', 'event', 'date', 'style'
  description TEXT,
  properties JSONB, -- Flexible properties per entity type
  confidence FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, type)
);

CREATE INDEX entities_type_idx ON entities (type);
CREATE INDEX entities_name_idx ON entities (name);
```

### 3. Relations Tabelle
```sql
CREATE TABLE relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  to_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL, -- 'married_to', 'photographed_at', 'offers_service', 'located_in', 'featured_in'
  strength FLOAT DEFAULT 1.0, -- Relationship strength (0-1)
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_entity_id, to_entity_id, relation_type)
);

CREATE INDEX relations_from_idx ON relations (from_entity_id);
CREATE INDEX relations_to_idx ON relations (to_entity_id);
CREATE INDEX relations_type_idx ON relations (relation_type);
```

### 4. Content-Entity Mapping
```sql
CREATE TABLE content_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  relevance FLOAT DEFAULT 1.0,
  context TEXT, -- Where/how the entity appears in content
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, content_id, entity_id)
);

CREATE INDEX content_entities_content_idx ON content_entities (content_type, content_id);
CREATE INDEX content_entities_entity_idx ON content_entities (entity_id);
```

---

## 🔧 Implementation Plan

### Phase 1: Embeddings Generation (Woche 1)

#### 1.1 Supabase Edge Function für Embeddings
```typescript
// supabase/functions/generate-embeddings/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  
  // Generate embeddings for all content
  // Process weddings, locations, blog posts, etc.
  
  return new Response(JSON.stringify({ success: true }))
})
```

#### 1.2 Content Processing Script
- **Weddings**: Title + Couple Names + Description + Location
- **Locations**: Name + Description + Features + Address
- **Blog Posts**: Title + Content + Excerpt
- **Fotobox**: Service Name + Description + Features
- **Reviews**: Author + Review Text
- **Pages**: Title + Content

#### 1.3 Batch Processing
```typescript
// scripts/generate-all-embeddings.ts
const contentTypes = ['weddings', 'locations', 'blog_posts', 'fotobox_services', 'reviews', 'pages'];

for (const contentType of contentTypes) {
  await processContentTypeEmbeddings(contentType);
}
```

### Phase 2: Entity Extraction (Woche 2)

#### 2.1 OpenAI-basierte Entity Recognition
```typescript
// Entity Types für DZ-Photo:
const entityTypes = {
  person: ['bride', 'groom', 'couple', 'photographer'],
  location: ['city', 'venue', 'region', 'country'],
  venue: ['hotel', 'castle', 'garden', 'church'],
  service: ['photography', 'fotobox', 'wedding_planning'],
  event: ['wedding', 'engagement', 'reception'],
  date: ['wedding_date', 'season', 'year'],
  style: ['romantic', 'vintage', 'modern', 'rustic']
};
```

#### 2.2 Entity Extraction Prompts
```typescript
const extractionPrompt = `
Analyze this wedding photography content and extract entities:

Content: "${content}"

Extract entities in these categories:
- PERSONS: Bride, groom, couple names
- LOCATIONS: Cities, venues, regions mentioned
- VENUES: Specific wedding locations, hotels, castles
- SERVICES: Photography services, fotobox, packages
- EVENTS: Wedding types, ceremonies, receptions
- DATES: Wedding dates, seasons, years
- STYLES: Photography styles, wedding themes

Return JSON format with confidence scores.
`;
```

#### 2.3 Automated Entity Processing
- **Weddings**: Extract couple names, wedding dates, venues
- **Locations**: Extract venue names, cities, features
- **Blog Posts**: Extract tips categories, mentioned services
- **Reviews**: Extract customer names, mentioned services

### Phase 3: Relation Mapping (Woche 3)

#### 3.1 Relation Types für DZ-Photo
```typescript
const relationTypes = {
  // Person Relations
  'married_to': 'Person -> Person',
  'photographed_by': 'Person -> Person (Photographer)',
  
  // Location Relations  
  'wedding_at': 'Person -> Venue',
  'located_in': 'Venue -> City/Region',
  'offers_service': 'Venue -> Service',
  
  // Content Relations
  'featured_in': 'Person/Venue -> Content',
  'mentions': 'Content -> Entity',
  'recommends': 'Content -> Service/Venue',
  
  // Service Relations
  'provides': 'Photographer -> Service',
  'suitable_for': 'Service -> Event_Type'
};
```

#### 3.2 Relation Extraction Logic
```typescript
// Automatic relation detection
const detectRelations = async (entities: Entity[]) => {
  // Couple relations (married_to)
  const couples = detectCouples(entities);
  
  // Location relations (wedding_at, located_in)
  const locationRelations = detectLocationRelations(entities);
  
  // Service relations (offers_service, provides)
  const serviceRelations = detectServiceRelations(entities);
  
  return [...couples, ...locationRelations, ...serviceRelations];
};
```

#### 3.3 Cross-Content Relations
- **Wedding -> Location**: "Hochzeit fand statt in..."
- **Blog -> Service**: "Tipp erwähnt Service..."
- **Review -> Wedding**: "Bewertung bezieht sich auf..."
- **Location -> Features**: "Location bietet..."

### Phase 4: Search & Query System (Woche 4)

#### 4.1 Semantic Search API
```typescript
// supabase/functions/semantic-search/index.ts
const semanticSearch = async (query: string, filters?: SearchFilters) => {
  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(query);
  
  // 2. Vector similarity search
  const similarContent = await vectorSearch(queryEmbedding, filters);
  
  // 3. Entity-based expansion
  const relatedEntities = await findRelatedEntities(query);
  
  // 4. Combine and rank results
  return combineResults(similarContent, relatedEntities);
};
```

#### 4.2 Graph Queries
```typescript
// Find related content through entity graph
const findRelatedContent = async (contentId: string, contentType: string) => {
  // 1. Get entities for this content
  const entities = await getContentEntities(contentId, contentType);
  
  // 2. Find related entities through relations
  const relatedEntities = await getRelatedEntities(entities);
  
  // 3. Find other content with these entities
  const relatedContent = await getContentByEntities(relatedEntities);
  
  return relatedContent;
};
```

#### 4.3 Intelligent Recommendations
```typescript
// Wedding venue recommendations based on style/location
const recommendVenues = async (weddingStyle: string, region: string) => {
  const query = `${weddingStyle} wedding venues in ${region}`;
  return await semanticSearch(query, { contentType: 'locations' });
};

// Similar weddings based on style/venue
const findSimilarWeddings = async (weddingId: string) => {
  const entities = await getContentEntities(weddingId, 'wedding');
  return await findRelatedContent(weddingId, 'wedding');
};
```

---

## 🚀 API Endpoints

### 1. Search Endpoints
```typescript
// GET /api/search/semantic?q=romantic+castle+wedding
// GET /api/search/similar?id=wedding-123&type=wedding
// GET /api/search/recommendations?style=vintage&location=linz
```

### 2. Entity Endpoints
```typescript
// GET /api/entities?type=venue&location=oberösterreich
// GET /api/entities/relations?from=person-123&type=married_to
// GET /api/graph/explore?entity=vedahof&depth=2
```

### 3. Analytics Endpoints
```typescript
// GET /api/analytics/popular-venues
// GET /api/analytics/trending-styles
// GET /api/analytics/seasonal-trends
```

---

## 📈 SEO Benefits

### 1. Content Discovery
- **Ähnliche Hochzeiten** basierend auf Stil/Location
- **Venue-Empfehlungen** für spezifische Anforderungen
- **Service-Vorschläge** basierend auf Wedding-Typ

### 2. Internal Linking
- **Automatische Verlinkung** zwischen verwandten Inhalten
- **Contextual Recommendations** in jedem Content-Piece
- **Topic Clusters** für bessere SEO-Struktur

### 3. Rich Snippets
- **Structured Data** aus Entity Graph
- **FAQ-Generierung** aus Relations
- **Event Schema** für Weddings

---

## 🔧 Implementation Scripts

### 1. Database Setup
```bash
# Create extensions and tables
npx tsx scripts/setup-embeddings-schema.ts
```

### 2. Content Processing
```bash
# Generate embeddings for all content
npx tsx scripts/generate-embeddings.ts

# Extract entities from content
npx tsx scripts/extract-entities.ts

# Build relation graph
npx tsx scripts/build-relations.ts
```

### 3. Search Testing
```bash
# Test semantic search
npx tsx scripts/test-semantic-search.ts

# Test entity queries
npx tsx scripts/test-entity-graph.ts
```

---

## 📊 Success Metrics

### 1. Technical Metrics
- **Embedding Coverage**: 100% aller Inhalte
- **Entity Accuracy**: >90% korrekte Extraktion
- **Search Relevance**: <200ms Response Time
- **Graph Completeness**: >80% Relations mapped

### 2. SEO Metrics
- **Internal Link Density**: +300% durch Auto-Linking
- **Content Discoverability**: +250% durch Recommendations
- **User Engagement**: +150% durch bessere Content-Connections
- **Search Rankings**: Bessere Topic Authority

### 3. User Experience
- **Search Satisfaction**: Relevante Ergebnisse
- **Content Exploration**: Intuitive Navigation
- **Recommendation Accuracy**: Passende Vorschläge

---

## 🎯 Next Steps

1. **Database Schema** erstellen und deployen
2. **Embeddings Generation** implementieren
3. **Entity Extraction** entwickeln
4. **Relation Mapping** aufbauen
5. **Search API** implementieren
6. **Frontend Integration** vorbereiten

Dieses System wird DZ-Photo zu einer der intelligentesten Hochzeitsfotografie-Websites machen! 🚀
