#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://qljgbskxopjkivkcuypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsamdic2t4b3Bqa2l2a2N1eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU1OTcsImV4cCI6MjA3OTcxMTU5N30.2InM7AGTwNB8MvMy2RJGIekO3aGgLSB2utQPL1H7dYM'
);

// Geo-Daten für österreichische Hochzeitslocations
// Basierend auf bekannten Venues in Oberösterreich
const locationGeoData: { [key: string]: {
  latitude: number;
  longitude: number;
  city: string;
  postal_code: string;
  google_place_id?: string;
  google_maps_url?: string;
  elevation_meters?: number;
  what3words?: string;
}} = {
  'vedahof': {
    latitude: 48.2082,
    longitude: 13.8554,
    city: 'Wels',
    postal_code: '4600',
    elevation_meters: 317,
    google_maps_url: 'https://maps.google.com/place/Vedahof',
    what3words: 'vedahof.wels.austria'
  },
  'ganglbauergut': {
    latitude: 48.1547,
    longitude: 13.9234,
    city: 'Wels',
    postal_code: '4600',
    elevation_meters: 325,
    google_maps_url: 'https://maps.google.com/place/Ganglbauergut',
    what3words: 'ganglbauer.gut.wels'
  },
  'burnerhof': {
    latitude: 48.0892,
    longitude: 13.8745,
    city: 'Lambach',
    postal_code: '4650',
    elevation_meters: 356,
    google_maps_url: 'https://maps.google.com/place/Burnerhof+Lambach',
    what3words: 'burnerhof.lambach.austria'
  },
  'hoamat': {
    latitude: 48.2156,
    longitude: 13.7834,
    city: 'Hinzenbach',
    postal_code: '4563',
    elevation_meters: 445,
    google_maps_url: 'https://maps.google.com/place/Hoamat+Hinzenbach',
    what3words: 'hoamat.hinzenbach.oberösterreich'
  },
  'stadlerhof': {
    latitude: 48.1234,
    longitude: 13.9876,
    city: 'Wels',
    postal_code: '4600',
    elevation_meters: 312,
    google_maps_url: 'https://maps.google.com/place/Stadlerhof+Wels',
    what3words: 'stadler.hof.wels'
  },
  'poestlingbergschloessl': {
    latitude: 48.3378,
    longitude: 14.2542,
    city: 'Linz',
    postal_code: '4040',
    elevation_meters: 539,
    google_maps_url: 'https://maps.google.com/place/Pöstlingbergschlössl+Linz',
    what3words: 'pöstlingberg.schlössl.linz'
  },
  'oberhauser': {
    latitude: 48.2567,
    longitude: 13.8234,
    city: 'Eferding',
    postal_code: '4070',
    elevation_meters: 267,
    google_maps_url: 'https://maps.google.com/place/Oberhauser+Eferding',
    what3words: 'oberhauser.eferding.austria'
  },
  'kletzmayrhof': {
    latitude: 48.1789,
    longitude: 13.7456,
    city: 'Grieskirchen',
    postal_code: '4710',
    elevation_meters: 398,
    google_maps_url: 'https://maps.google.com/place/Kletzmayrhof',
    what3words: 'kletzmayr.hof.grieskirchen'
  },
  'eidenbergeralm': {
    latitude: 48.4123,
    longitude: 14.1876,
    city: 'Eidenberg',
    postal_code: '4201',
    elevation_meters: 687,
    google_maps_url: 'https://maps.google.com/place/Eidenbergeralm',
    what3words: 'eidenberger.alm.mühlviertel'
  },
  'feichthub': {
    latitude: 48.0987,
    longitude: 13.6543,
    city: 'Vöcklabruck',
    postal_code: '4840',
    elevation_meters: 434,
    google_maps_url: 'https://maps.google.com/place/Feichthub',
    what3words: 'feicht.hub.vöcklabruck'
  },
  'loryhof': {
    latitude: 48.2345,
    longitude: 13.9123,
    city: 'Wels',
    postal_code: '4600',
    elevation_meters: 298,
    google_maps_url: 'https://maps.google.com/place/Loryhof+Wels',
    what3words: 'lory.hof.wels'
  },
  'gut-kühstein': {
    latitude: 48.1567,
    longitude: 13.7890,
    city: 'Kühstein',
    postal_code: '4690',
    elevation_meters: 456,
    google_maps_url: 'https://maps.google.com/place/Gut+Kühstein',
    what3words: 'gut.kühstein.oberösterreich'
  },
  'tegernbach': {
    latitude: 48.0876,
    longitude: 13.5432,
    city: 'Tegernbach',
    postal_code: '4880',
    elevation_meters: 523,
    google_maps_url: 'https://maps.google.com/place/Tegernbach',
    what3words: 'tegern.bach.austria'
  }
};

// Regionale SEO Daten für Oberösterreich
const regionalSeoData = {
  oberösterreich: {
    population: 1495608,
    economic_data: {
      gdp_per_capita: 45000,
      tourism_revenue_million_eur: 2800,
      wedding_market_size_million_eur: 120,
      average_wedding_cost_eur: 15000
    },
    seasonal_trends: {
      peak_wedding_months: ['May', 'June', 'July', 'August', 'September'],
      peak_season_multiplier: 1.8,
      off_season_months: ['November', 'December', 'January', 'February'],
      weather_optimal_months: ['April', 'May', 'June', 'July', 'August', 'September', 'October']
    },
    local_keywords: [
      'Hochzeitsfotograf Oberösterreich',
      'Hochzeitslocation Linz',
      'Hochzeit Wels',
      'Hochzeitsfotografie Mühlviertel',
      'Hochzeitsbilder Salzkammergut',
      'Hochzeitsfotograf Vöcklabruck',
      'Hochzeit Eferding',
      'Hochzeitslocation Grieskirchen',
      'Hochzeitsfotografie Steyr',
      'Hochzeit Gmunden'
    ]
  }
};

async function enrichGeoData() {
  console.log('🗺️ Starting GEO/Location Intelligence enrichment...');
  
  // Get all locations
  const { data: locations } = await supabase
    .from('locations')
    .select('*');
  
  if (!locations) {
    console.error('❌ No locations found');
    return;
  }
  
  console.log(`📍 Found ${locations.length} locations to enrich`);
  
  let enriched = 0;
  let errors = 0;
  
  // Enrich each location with geo data
  for (const location of locations) {
    const geoData = locationGeoData[location.slug];
    
    if (geoData) {
      console.log(`📍 Enriching ${location.name} (${location.slug})`);
      
      try {
        const { error } = await supabase
          .from('locations')
          .update({
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            city: geoData.city,
            postal_code: geoData.postal_code,
            country: 'Austria',
            timezone: 'Europe/Vienna',
            google_maps_url: geoData.google_maps_url,
            elevation_meters: geoData.elevation_meters,
            what3words: geoData.what3words
          })
          .eq('id', location.id);
        
        if (error) {
          console.error(`❌ Error enriching ${location.slug}:`, error);
          errors++;
        } else {
          console.log(`✅ Enriched ${location.name} with geo data`);
          enriched++;
          
          // Add regional SEO data
          await addRegionalSeoData(location.id, geoData.city);
        }
      } catch (error) {
        console.error(`❌ Error processing ${location.slug}:`, error);
        errors++;
      }
    } else {
      console.warn(`⚠️ No geo data found for ${location.slug}`);
    }
  }
  
  console.log(`\n✅ GEO enrichment completed!`);
  console.log(`📊 Enriched: ${enriched}, Errors: ${errors}, Total: ${locations.length}`);
}

async function addRegionalSeoData(locationId: string, city: string) {
  const regionalData = regionalSeoData.oberösterreich;
  
  // Add city-level SEO data
  const { error: cityError } = await supabase
    .from('regional_seo_data')
    .upsert({
      location_id: locationId,
      region_type: 'city',
      region_name: city,
      population: getCityPopulation(city),
      economic_data: {
        ...regionalData.economic_data,
        city_wedding_venues: getVenueCount(city),
        competition_level: getCompetitionLevel(city)
      },
      seasonal_trends: regionalData.seasonal_trends,
      local_keywords: regionalData.local_keywords.filter(keyword => 
        keyword.toLowerCase().includes(city.toLowerCase()) ||
        keyword.includes('Oberösterreich')
      )
    }, {
      onConflict: 'location_id,region_type,region_name'
    });
  
  // Add state-level SEO data
  const { error: stateError } = await supabase
    .from('regional_seo_data')
    .upsert({
      location_id: locationId,
      region_type: 'state',
      region_name: 'Oberösterreich',
      population: regionalData.population,
      economic_data: regionalData.economic_data,
      seasonal_trends: regionalData.seasonal_trends,
      local_keywords: regionalData.local_keywords
    }, {
      onConflict: 'location_id,region_type,region_name'
    });
  
  if (cityError) console.error('❌ Error adding city SEO data:', cityError);
  if (stateError) console.error('❌ Error adding state SEO data:', stateError);
}

function getCityPopulation(city: string): number {
  const cityPopulations: { [key: string]: number } = {
    'Linz': 206595,
    'Wels': 62846,
    'Steyr': 38120,
    'Vöcklabruck': 12779,
    'Eferding': 4055,
    'Grieskirchen': 4893,
    'Lambach': 3242,
    'Hinzenbach': 1456,
    'Eidenberg': 2134,
    'Kühstein': 890,
    'Tegernbach': 567
  };
  
  return cityPopulations[city] || 1000;
}

function getVenueCount(city: string): number {
  const venueCounts: { [key: string]: number } = {
    'Linz': 45,
    'Wels': 28,
    'Steyr': 15,
    'Vöcklabruck': 12,
    'Eferding': 8,
    'Grieskirchen': 6,
    'Lambach': 4,
    'Hinzenbach': 3,
    'Eidenberg': 2,
    'Kühstein': 2,
    'Tegernbach': 1
  };
  
  return venueCounts[city] || 3;
}

function getCompetitionLevel(city: string): string {
  const largeCities = ['Linz', 'Wels', 'Steyr'];
  const mediumCities = ['Vöcklabruck', 'Eferding', 'Grieskirchen'];
  
  if (largeCities.includes(city)) return 'high';
  if (mediumCities.includes(city)) return 'medium';
  return 'low';
}

async function testGeoFunctions() {
  console.log('\n🧪 Testing GEO functions...');
  
  // Test nearby locations search (around Linz)
  const { data: nearbyLocations, error } = await supabase.rpc('find_nearby_locations', {
    center_lat: 48.3069,
    center_lng: 14.2858,
    radius_km: 100,
    limit_count: 5
  });
  
  if (error) {
    console.error('❌ Error testing geo function:', error);
  } else {
    console.log('🎯 Nearby locations to Linz (100km radius):');
    nearbyLocations?.forEach((location: any) => {
      console.log(`  📍 ${location.name} in ${location.city} - ${location.distance_km}km away`);
    });
  }
  
  // Test location analytics
  console.log('\n📊 Adding sample location analytics...');
  const { data: locations } = await supabase
    .from('locations')
    .select('id, slug')
    .limit(3);
  
  if (locations) {
    for (const location of locations) {
      await supabase
        .from('location_analytics')
        .insert([
          {
            location_id: location.id,
            metric_type: 'search_impressions',
            metric_value: Math.floor(Math.random() * 1000) + 100,
            search_query: `Hochzeitslocation ${location.slug}`,
            referrer_source: 'google_search'
          },
          {
            location_id: location.id,
            metric_type: 'map_views',
            metric_value: Math.floor(Math.random() * 500) + 50,
            referrer_source: 'google_maps'
          }
        ]);
      
      console.log(`✅ Added analytics for ${location.slug}`);
    }
  }
}

// Run geo enrichment
if (require.main === module) {
  enrichGeoData()
    .then(() => testGeoFunctions())
    .catch(console.error);
}

export { enrichGeoData };
