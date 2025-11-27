export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_agent_interactions: {
        Row: {
          agent_type: string
          attribution_correct: boolean | null
          citation_included: boolean | null
          content_id: string | null
          content_type: string | null
          created_at: string | null
          date_recorded: string | null
          id: string
          interaction_type: string | null
          ip_address: unknown
          query_text: string | null
          response_generated: boolean | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          agent_type: string
          attribution_correct?: boolean | null
          citation_included?: boolean | null
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          interaction_type?: string | null
          ip_address?: unknown
          query_text?: string | null
          response_generated?: boolean | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          agent_type?: string
          attribution_correct?: boolean | null
          citation_included?: boolean | null
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          interaction_type?: string | null
          ip_address?: unknown
          query_text?: string | null
          response_generated?: boolean | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      ai_content_suggestions: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          confidence_score: number | null
          content_id: string
          content_type: string
          created_at: string | null
          field_name: string | null
          id: string
          original_text: string | null
          reasoning: string | null
          suggested_text: string
          suggestion_type: string
          updated_at: string | null
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          confidence_score?: number | null
          content_id: string
          content_type: string
          created_at?: string | null
          field_name?: string | null
          id?: string
          original_text?: string | null
          reasoning?: string | null
          suggested_text: string
          suggestion_type: string
          updated_at?: string | null
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          confidence_score?: number | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          field_name?: string | null
          id?: string
          original_text?: string | null
          reasoning?: string | null
          suggested_text?: string
          suggestion_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_processing_queue: {
        Row: {
          completed_at: string | null
          content_id: string
          content_type: string
          created_at: string | null
          error_message: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          priority: number | null
          started_at: string | null
          status: string | null
          task_type: string
        }
        Insert: {
          completed_at?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          priority?: number | null
          started_at?: string | null
          status?: string | null
          task_type: string
        }
        Update: {
          completed_at?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          priority?: number | null
          started_at?: string | null
          status?: string | null
          task_type?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          canonical_url: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          focus_keywords: string[] | null
          id: string
          images: Json | null
          meta_description: string | null
          meta_title: string | null
          number: number | null
          og_image_url: string | null
          published: boolean | null
          published_at: string | null
          readability_score: number | null
          related_keywords: string[] | null
          schema_org_id: string | null
          slug: string
          title: string
          twitter_card_type: string | null
          updated_at: string | null
          views: number | null
          word_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          focus_keywords?: string[] | null
          id?: string
          images?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          number?: number | null
          og_image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug: string
          title: string
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          word_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          focus_keywords?: string[] | null
          id?: string
          images?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          number?: number | null
          og_image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug?: string
          title?: string
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          word_count?: number | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          ip_address: unknown
          message: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          user_agent: string | null
          wedding_date: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          ip_address?: unknown
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          user_agent?: string | null
          wedding_date?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          ip_address?: unknown
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          user_agent?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      content_entities: {
        Row: {
          content_id: string
          content_type: string
          context: string | null
          created_at: string | null
          entity_id: string | null
          id: string
          relevance: number | null
        }
        Insert: {
          content_id: string
          content_type: string
          context?: string | null
          created_at?: string | null
          entity_id?: string | null
          id?: string
          relevance?: number | null
        }
        Update: {
          content_id?: string
          content_type?: string
          context?: string | null
          created_at?: string | null
          entity_id?: string | null
          id?: string
          relevance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      content_keyword_mapping: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          density: number | null
          id: string
          keyword_id: string | null
          position_score: number | null
          usage_type: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          density?: number | null
          id?: string
          keyword_id?: string | null
          position_score?: number | null
          usage_type?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          density?: number | null
          id?: string
          keyword_id?: string | null
          position_score?: number | null
          usage_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_keyword_mapping_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "seo_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      content_quality_metrics: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          last_analyzed: string | null
          metric_type: string
          metric_value: number | null
          status: string | null
          target_value: number | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          last_analyzed?: string | null
          metric_type: string
          metric_value?: number | null
          status?: string | null
          target_value?: number | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          last_analyzed?: string | null
          metric_type?: string
          metric_value?: number | null
          status?: string | null
          target_value?: number | null
        }
        Relationships: []
      }
      conversion_tracking: {
        Row: {
          browser: string | null
          content_id: string | null
          content_type: string | null
          conversion_type: string
          conversion_value: number | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          id: string
          referrer: string | null
          source_url: string | null
          user_session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          browser?: string | null
          content_id?: string | null
          content_type?: string | null
          conversion_type: string
          conversion_value?: number | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          referrer?: string | null
          source_url?: string | null
          user_session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          browser?: string | null
          content_id?: string | null
          content_type?: string | null
          conversion_type?: string
          conversion_value?: number | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          referrer?: string | null
          source_url?: string | null
          user_session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          content_id: string
          content_text: string
          content_type: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_text: string
          content_type: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_text?: string
          content_type?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      entities: {
        Row: {
          confidence: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          properties: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          properties?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          properties?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fotobox_services: {
        Row: {
          active: boolean | null
          canonical_url: string | null
          content: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          display_order: number | null
          featured_image: string | null
          features: Json | null
          focus_keywords: string[] | null
          id: string
          images: Json | null
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          popular: boolean | null
          price: number | null
          published: boolean | null
          readability_score: number | null
          related_keywords: string[] | null
          schema_org_id: string | null
          service_type: string | null
          slug: string
          twitter_card_type: string | null
          updated_at: string | null
          views: number | null
          word_count: number | null
        }
        Insert: {
          active?: boolean | null
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          featured_image?: string | null
          features?: Json | null
          focus_keywords?: string[] | null
          id?: string
          images?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          popular?: boolean | null
          price?: number | null
          published?: boolean | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          service_type?: string | null
          slug: string
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          word_count?: number | null
        }
        Update: {
          active?: boolean | null
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          featured_image?: string | null
          features?: Json | null
          focus_keywords?: string[] | null
          id?: string
          images?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          popular?: boolean | null
          price?: number | null
          published?: boolean | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          service_type?: string | null
          slug?: string
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          word_count?: number | null
        }
        Relationships: []
      }
      location_analytics: {
        Row: {
          created_at: string | null
          date_recorded: string | null
          id: string
          location_id: string | null
          metric_type: string
          metric_value: number | null
          referrer_source: string | null
          search_query: string | null
        }
        Insert: {
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          location_id?: string | null
          metric_type: string
          metric_value?: number | null
          referrer_source?: string | null
          search_query?: string | null
        }
        Update: {
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          location_id?: string | null
          metric_type?: string
          metric_value?: number | null
          referrer_source?: string | null
          search_query?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_analytics_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          canonical_url: string | null
          capacity_max: number | null
          capacity_min: number | null
          city: string | null
          country: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          elevation_meters: number | null
          email: string | null
          featured: boolean | null
          features: Json | null
          focus_keywords: string[] | null
          google_maps_url: string | null
          google_place_id: string | null
          id: string
          images: Json | null
          latitude: number | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          phone: string | null
          postal_code: string | null
          published: boolean | null
          readability_score: number | null
          region: string | null
          related_keywords: string[] | null
          schema_org_id: string | null
          slug: string
          timezone: string | null
          twitter_card_type: string | null
          updated_at: string | null
          views: number | null
          website: string | null
          what3words: string | null
          word_count: number | null
        }
        Insert: {
          address?: string | null
          canonical_url?: string | null
          capacity_max?: number | null
          capacity_min?: number | null
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          elevation_meters?: number | null
          email?: string | null
          featured?: boolean | null
          features?: Json | null
          focus_keywords?: string[] | null
          google_maps_url?: string | null
          google_place_id?: string | null
          id?: string
          images?: Json | null
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          phone?: string | null
          postal_code?: string | null
          published?: boolean | null
          readability_score?: number | null
          region?: string | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug: string
          timezone?: string | null
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          website?: string | null
          what3words?: string | null
          word_count?: number | null
        }
        Update: {
          address?: string | null
          canonical_url?: string | null
          capacity_max?: number | null
          capacity_min?: number | null
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          elevation_meters?: number | null
          email?: string | null
          featured?: boolean | null
          features?: Json | null
          focus_keywords?: string[] | null
          google_maps_url?: string | null
          google_place_id?: string | null
          id?: string
          images?: Json | null
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          phone?: string | null
          postal_code?: string | null
          published?: boolean | null
          readability_score?: number | null
          region?: string | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug?: string
          timezone?: string | null
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          website?: string | null
          what3words?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      page_analytics: {
        Row: {
          avg_time_on_page: number | null
          bounce_rate: number | null
          content_id: string
          content_type: string
          conversion_rate: number | null
          core_web_vitals: Json | null
          date_recorded: string | null
          id: string
          last_updated: string | null
          lighthouse_score: number | null
          page_views: number | null
          unique_visitors: number | null
        }
        Insert: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          content_id: string
          content_type: string
          conversion_rate?: number | null
          core_web_vitals?: Json | null
          date_recorded?: string | null
          id?: string
          last_updated?: string | null
          lighthouse_score?: number | null
          page_views?: number | null
          unique_visitors?: number | null
        }
        Update: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          content_id?: string
          content_type?: string
          conversion_rate?: number | null
          core_web_vitals?: Json | null
          date_recorded?: string | null
          id?: string
          last_updated?: string | null
          lighthouse_score?: number | null
          page_views?: number | null
          unique_visitors?: number | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          canonical_url: string | null
          content: string | null
          created_at: string | null
          focus_keywords: string[] | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          page_type: string | null
          published: boolean | null
          readability_score: number | null
          related_keywords: string[] | null
          schema_org_id: string | null
          slug: string
          title: string
          twitter_card_type: string | null
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          focus_keywords?: string[] | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          page_type?: string | null
          published?: boolean | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug: string
          title: string
          twitter_card_type?: string | null
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          focus_keywords?: string[] | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          page_type?: string | null
          published?: boolean | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug?: string
          title?: string
          twitter_card_type?: string | null
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      performance_benchmarks: {
        Row: {
          benchmark_type: string
          content_id: string | null
          content_type: string | null
          created_at: string | null
          date_recorded: string | null
          id: string
          measurement_tool: string | null
          metric_name: string
          metric_value: number | null
          status: string | null
          target_value: number | null
        }
        Insert: {
          benchmark_type: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          measurement_tool?: string | null
          metric_name: string
          metric_value?: number | null
          status?: string | null
          target_value?: number | null
        }
        Update: {
          benchmark_type?: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          measurement_tool?: string | null
          metric_name?: string
          metric_value?: number | null
          status?: string | null
          target_value?: number | null
        }
        Relationships: []
      }
      regional_seo_data: {
        Row: {
          competitor_analysis: Json | null
          created_at: string | null
          economic_data: Json | null
          id: string
          local_keywords: string[] | null
          location_id: string | null
          population: number | null
          region_name: string
          region_type: string
          seasonal_trends: Json | null
          updated_at: string | null
        }
        Insert: {
          competitor_analysis?: Json | null
          created_at?: string | null
          economic_data?: Json | null
          id?: string
          local_keywords?: string[] | null
          location_id?: string | null
          population?: number | null
          region_name: string
          region_type: string
          seasonal_trends?: Json | null
          updated_at?: string | null
        }
        Update: {
          competitor_analysis?: Json | null
          created_at?: string | null
          economic_data?: Json | null
          id?: string
          local_keywords?: string[] | null
          location_id?: string | null
          population?: number | null
          region_name?: string
          region_type?: string
          seasonal_trends?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regional_seo_data_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      relations: {
        Row: {
          created_at: string | null
          from_entity_id: string | null
          id: string
          metadata: Json | null
          relation_type: string
          strength: number | null
          to_entity_id: string | null
        }
        Insert: {
          created_at?: string | null
          from_entity_id?: string | null
          id?: string
          metadata?: Json | null
          relation_type: string
          strength?: number | null
          to_entity_id?: string | null
        }
        Update: {
          created_at?: string | null
          from_entity_id?: string | null
          id?: string
          metadata?: Json | null
          relation_type?: string
          strength?: number | null
          to_entity_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relations_from_entity_id_fkey"
            columns: ["from_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relations_to_entity_id_fkey"
            columns: ["to_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          approved: boolean | null
          author_name: string
          canonical_url: string | null
          created_at: string | null
          display_order: number | null
          featured: boolean | null
          focus_keywords: string[] | null
          id: string
          location_id: string | null
          og_image_url: string | null
          published: boolean | null
          rating: number | null
          readability_score: number | null
          related_keywords: string[] | null
          review_text: string
          schema_org_id: string | null
          source: string | null
          twitter_card_type: string | null
          wedding_date: string | null
          wedding_id: string | null
          word_count: number | null
        }
        Insert: {
          approved?: boolean | null
          author_name: string
          canonical_url?: string | null
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          focus_keywords?: string[] | null
          id?: string
          location_id?: string | null
          og_image_url?: string | null
          published?: boolean | null
          rating?: number | null
          readability_score?: number | null
          related_keywords?: string[] | null
          review_text: string
          schema_org_id?: string | null
          source?: string | null
          twitter_card_type?: string | null
          wedding_date?: string | null
          wedding_id?: string | null
          word_count?: number | null
        }
        Update: {
          approved?: boolean | null
          author_name?: string
          canonical_url?: string | null
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          focus_keywords?: string[] | null
          id?: string
          location_id?: string | null
          og_image_url?: string | null
          published?: boolean | null
          rating?: number | null
          readability_score?: number | null
          related_keywords?: string[] | null
          review_text?: string
          schema_org_id?: string | null
          source?: string | null
          twitter_card_type?: string | null
          wedding_date?: string | null
          wedding_id?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          schema_type: string
          template_data: Json
          template_name: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          schema_type: string
          template_data: Json
          template_name: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          schema_type?: string
          template_data?: Json
          template_name?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          avg_position: number | null
          click_through_rate: number | null
          clicks: number | null
          country_code: string | null
          created_at: string | null
          date_recorded: string | null
          device_type: string | null
          id: string
          impressions: number | null
          query: string
          results_count: number | null
          search_source: string | null
        }
        Insert: {
          avg_position?: number | null
          click_through_rate?: number | null
          clicks?: number | null
          country_code?: string | null
          created_at?: string | null
          date_recorded?: string | null
          device_type?: string | null
          id?: string
          impressions?: number | null
          query: string
          results_count?: number | null
          search_source?: string | null
        }
        Update: {
          avg_position?: number | null
          click_through_rate?: number | null
          clicks?: number | null
          country_code?: string | null
          created_at?: string | null
          date_recorded?: string | null
          device_type?: string | null
          id?: string
          impressions?: number | null
          query?: string
          results_count?: number | null
          search_source?: string | null
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          competition_level: string | null
          created_at: string | null
          id: string
          industry: string | null
          keyword: string
          keyword_type: string | null
          location: string | null
          relevance_score: number | null
          search_volume: number | null
        }
        Insert: {
          competition_level?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          keyword: string
          keyword_type?: string | null
          location?: string | null
          relevance_score?: number | null
          search_volume?: number | null
        }
        Update: {
          competition_level?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          keyword?: string
          keyword_type?: string | null
          location?: string | null
          relevance_score?: number | null
          search_volume?: number | null
        }
        Relationships: []
      }
      seo_metrics: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          date_recorded: string | null
          device_type: string | null
          id: string
          metric_type: string
          metric_value: number | null
          search_query: string | null
          source: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          date_recorded?: string | null
          device_type?: string | null
          id?: string
          metric_type: string
          metric_value?: number | null
          search_query?: string | null
          source?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          date_recorded?: string | null
          device_type?: string | null
          id?: string
          metric_type?: string
          metric_value?: number | null
          search_query?: string | null
          source?: string | null
        }
        Relationships: []
      }
      social_media_analytics: {
        Row: {
          clicks: number | null
          comments: number | null
          content_id: string | null
          content_type: string | null
          created_at: string | null
          date_recorded: string | null
          engagement: number | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          likes: number | null
          platform: string
          post_id: string | null
          post_url: string | null
          reach: number | null
          saves: number | null
          shares: number | null
        }
        Insert: {
          clicks?: number | null
          comments?: number | null
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          date_recorded?: string | null
          engagement?: number | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          platform: string
          post_id?: string | null
          post_url?: string | null
          reach?: number | null
          saves?: number | null
          shares?: number | null
        }
        Update: {
          clicks?: number | null
          comments?: number | null
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          date_recorded?: string | null
          engagement?: number | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          platform?: string
          post_id?: string | null
          post_url?: string | null
          reach?: number | null
          saves?: number | null
          shares?: number | null
        }
        Relationships: []
      }
      structured_data: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          last_updated: string | null
          priority: number | null
          schema_data: Json
          schema_type: string
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          priority?: number | null
          schema_data: Json
          schema_type: string
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          priority?: number | null
          schema_data?: Json
          schema_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tracking_api_queue: {
        Row: {
          api_endpoint: string
          attempts: number | null
          created_at: string | null
          error_message: string | null
          event_id: string | null
          headers: Json | null
          id: string
          max_attempts: number | null
          payload: Json
          platform: string
          processed_at: string | null
          response_body: string | null
          response_status: number | null
          scheduled_at: string | null
          status: string | null
        }
        Insert: {
          api_endpoint: string
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          event_id?: string | null
          headers?: Json | null
          id?: string
          max_attempts?: number | null
          payload: Json
          platform: string
          processed_at?: string | null
          response_body?: string | null
          response_status?: number | null
          scheduled_at?: string | null
          status?: string | null
        }
        Update: {
          api_endpoint?: string
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          event_id?: string | null
          headers?: Json | null
          id?: string
          max_attempts?: number | null
          payload?: Json
          platform?: string
          processed_at?: string | null
          response_body?: string | null
          response_status?: number | null
          scheduled_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_api_queue_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "tracking_events"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          browser_name: string | null
          browser_version: string | null
          city: string | null
          client_id: string | null
          consent_categories: string[] | null
          consent_given: boolean | null
          consent_timestamp: string | null
          content_id: string | null
          content_slug: string | null
          content_type: string | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          event_name: string
          event_parameters: Json | null
          event_type: string
          facebook_browser_id: string | null
          facebook_click_id: string | null
          facebook_event_id: string | null
          google_measurement_id: string | null
          id: string
          ip_address: unknown
          os_name: string | null
          page_title: string | null
          page_url: string
          processed_at: string | null
          referrer: string | null
          sent_to_facebook: boolean | null
          sent_to_google: boolean | null
          user_agent: string | null
          user_session_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          client_id?: string | null
          consent_categories?: string[] | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          content_id?: string | null
          content_slug?: string | null
          content_type?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          event_name: string
          event_parameters?: Json | null
          event_type: string
          facebook_browser_id?: string | null
          facebook_click_id?: string | null
          facebook_event_id?: string | null
          google_measurement_id?: string | null
          id?: string
          ip_address?: unknown
          os_name?: string | null
          page_title?: string | null
          page_url: string
          processed_at?: string | null
          referrer?: string | null
          sent_to_facebook?: boolean | null
          sent_to_google?: boolean | null
          user_agent?: string | null
          user_session_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          client_id?: string | null
          consent_categories?: string[] | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          content_id?: string | null
          content_slug?: string | null
          content_type?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          event_name?: string
          event_parameters?: Json | null
          event_type?: string
          facebook_browser_id?: string | null
          facebook_click_id?: string | null
          facebook_event_id?: string | null
          google_measurement_id?: string | null
          id?: string
          ip_address?: unknown
          os_name?: string | null
          page_title?: string | null
          page_url?: string
          processed_at?: string | null
          referrer?: string | null
          sent_to_facebook?: boolean | null
          sent_to_google?: boolean | null
          user_agent?: string | null
          user_session_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser_name: string | null
          city: string | null
          conversion_timestamp: string | null
          conversion_type: string | null
          conversion_value: number | null
          converted: boolean | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          first_referrer: string | null
          first_utm_campaign: string | null
          first_utm_medium: string | null
          first_utm_source: string | null
          first_visit: string | null
          id: string
          last_activity: string | null
          os_name: string | null
          page_views: number | null
          screen_resolution: string | null
          session_id: string
          timezone: string | null
          total_events: number | null
          updated_at: string | null
          user_fingerprint: string | null
        }
        Insert: {
          browser_name?: string | null
          city?: string | null
          conversion_timestamp?: string | null
          conversion_type?: string | null
          conversion_value?: number | null
          converted?: boolean | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          first_referrer?: string | null
          first_utm_campaign?: string | null
          first_utm_medium?: string | null
          first_utm_source?: string | null
          first_visit?: string | null
          id?: string
          last_activity?: string | null
          os_name?: string | null
          page_views?: number | null
          screen_resolution?: string | null
          session_id: string
          timezone?: string | null
          total_events?: number | null
          updated_at?: string | null
          user_fingerprint?: string | null
        }
        Update: {
          browser_name?: string | null
          city?: string | null
          conversion_timestamp?: string | null
          conversion_type?: string | null
          conversion_value?: number | null
          converted?: boolean | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          first_referrer?: string | null
          first_utm_campaign?: string | null
          first_utm_medium?: string | null
          first_utm_source?: string | null
          first_visit?: string | null
          id?: string
          last_activity?: string | null
          os_name?: string | null
          page_views?: number | null
          screen_resolution?: string | null
          session_id?: string
          timezone?: string | null
          total_events?: number | null
          updated_at?: string | null
          user_fingerprint?: string | null
        }
        Relationships: []
      }
      weddings: {
        Row: {
          canonical_url: string | null
          couple_names: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          focus_keywords: string[] | null
          id: string
          images: Json | null
          location: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          published: boolean | null
          readability_score: number | null
          related_keywords: string[] | null
          schema_org_id: string | null
          slug: string
          title: string
          twitter_card_type: string | null
          updated_at: string | null
          views: number | null
          wedding_date: string | null
          word_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          couple_names?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          focus_keywords?: string[] | null
          id?: string
          images?: Json | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published?: boolean | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug: string
          title: string
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          wedding_date?: string | null
          word_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          couple_names?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          focus_keywords?: string[] | null
          id?: string
          images?: Json | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published?: boolean | null
          readability_score?: number | null
          related_keywords?: string[] | null
          schema_org_id?: string | null
          slug?: string
          title?: string
          twitter_card_type?: string | null
          updated_at?: string | null
          views?: number | null
          wedding_date?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_content_quality_score: {
        Args: { p_content_id: string; p_content_type: string }
        Returns: number
      }
      calculate_performance_score: {
        Args: {
          p_content_id: string
          p_content_type: string
          p_date_from?: string
          p_date_to?: string
        }
        Returns: Json
      }
      create_tracking_event: {
        Args: {
          p_client_id?: string
          p_consent_categories?: string[]
          p_consent_given?: boolean
          p_content_id?: string
          p_content_type?: string
          p_event_name: string
          p_event_parameters?: Json
          p_event_type: string
          p_facebook_browser_id?: string
          p_facebook_click_id?: string
          p_ip_address?: unknown
          p_page_title?: string
          p_page_url: string
          p_referrer?: string
          p_session_id: string
          p_user_agent?: string
          p_utm_campaign?: string
          p_utm_medium?: string
          p_utm_source?: string
        }
        Returns: string
      }
      find_nearby_locations: {
        Args: {
          center_lat: number
          center_lng: number
          limit_count?: number
          radius_km?: number
        }
        Returns: {
          city: string
          distance_km: number
          id: string
          latitude: number
          longitude: number
          name: string
          slug: string
        }[]
      }
      find_related_entities: {
        Args: {
          entity_ids: string[]
          max_depth?: number
          min_strength?: number
        }
        Returns: {
          entity_id: string
          entity_name: string
          entity_type: string
          relation_path: string[]
          total_strength: number
        }[]
      }
      generate_schema_jsonld: {
        Args: {
          p_base_url?: string
          p_content_id: string
          p_content_type: string
        }
        Returns: Json
      }
      get_tracking_statistics: {
        Args: { p_date_from?: string; p_date_to?: string }
        Returns: Json
      }
      match_embeddings: {
        Args: {
          content_type_filter?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content_id: string
          content_text: string
          content_type: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      process_tracking_queue: {
        Args: { p_batch_size?: number; p_platform?: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
