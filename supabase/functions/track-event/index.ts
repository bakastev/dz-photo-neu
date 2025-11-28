import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';

interface TrackingEventRequest {
  event_type: string;
  event_name: string;
  session_id: string;
  page_url: string;
  page_title?: string;
  content_type?: string;
  content_id?: string;
  event_parameters?: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  consent_given?: boolean;
  consent_categories?: string[];
  client_id?: string;
  facebook_browser_id?: string; // fbp
  facebook_click_id?: string;   // fbc
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request
    const trackingData: TrackingEventRequest = await req.json();
    
    // Extract IP address from request
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    
    // Extract User-Agent
    const userAgent = req.headers.get('user-agent') || '';
    
    // Validate required fields
    if (!trackingData.event_type || !trackingData.event_name || !trackingData.session_id || !trackingData.page_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: event_type, event_name, session_id, page_url' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create tracking event using database function
    const { data: eventId, error: dbError } = await supabaseClient.rpc('create_tracking_event', {
      p_event_type: trackingData.event_type,
      p_event_name: trackingData.event_name,
      p_session_id: trackingData.session_id,
      p_page_url: trackingData.page_url,
      p_page_title: trackingData.page_title,
      p_content_type: trackingData.content_type,
      p_content_id: trackingData.content_id,
      p_event_parameters: trackingData.event_parameters || {},
      p_user_agent: trackingData.user_agent || userAgent,
      p_ip_address: trackingData.ip_address || clientIP,
      p_referrer: trackingData.referrer,
      p_utm_source: trackingData.utm_source,
      p_utm_medium: trackingData.utm_medium,
      p_utm_campaign: trackingData.utm_campaign,
      p_consent_given: trackingData.consent_given || false,
      p_consent_categories: trackingData.consent_categories || [],
      p_client_id: trackingData.client_id,
      p_facebook_browser_id: trackingData.facebook_browser_id,
      p_facebook_click_id: trackingData.facebook_click_id
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to create tracking event', details: dbError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Process server-side tracking if consent given
    if (trackingData.consent_given && trackingData.consent_categories?.includes('marketing')) {
      await processServerSideTracking(supabaseClient, eventId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: eventId,
        message: 'Event tracked successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Tracking error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processServerSideTracking(supabaseClient: any, eventId: string) {
  try {
    // Get pending API queue items for this event
    const { data: queueItems, error } = await supabaseClient
      .from('tracking_api_queue')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching queue items:', error);
      return;
    }

    // Process each queue item
    for (const item of queueItems || []) {
      try {
        await processQueueItem(supabaseClient, item);
      } catch (error) {
        console.error(`Error processing queue item ${item.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in processServerSideTracking:', error);
  }
}

async function processQueueItem(supabaseClient: any, queueItem: any) {
  try {
    // Mark as processing
    await supabaseClient
      .from('tracking_api_queue')
      .update({ 
        status: 'processing', 
        attempts: queueItem.attempts + 1 
      })
      .eq('id', queueItem.id);

    let response;
    let success = false;

    if (queueItem.platform === 'facebook') {
      // Send to Meta Conversion API
      response = await fetch(queueItem.api_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'dz-photo-server/1.0'
        },
        body: JSON.stringify(queueItem.payload)
      });

      success = response.ok;
    } else if (queueItem.platform === 'google') {
      // Send to Google Analytics 4 Measurement Protocol
      const payload = queueItem.payload;
      const url = `${queueItem.api_endpoint}?measurement_id=${payload.measurement_id}&api_secret=${payload.api_secret}`;
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: payload.client_id,
          events: payload.events
        })
      });

      success = response.ok;
    }

    // Update queue item status
    const updateData: any = {
      processed_at: new Date().toISOString(),
      response_status: response?.status || 0
    };

    if (success) {
      updateData.status = 'sent';
      updateData.response_body = await response?.text() || '';
    } else {
      updateData.status = queueItem.attempts >= queueItem.max_attempts ? 'failed' : 'pending';
      updateData.error_message = `HTTP ${response?.status}: ${await response?.text() || 'Unknown error'}`;
    }

    await supabaseClient
      .from('tracking_api_queue')
      .update(updateData)
      .eq('id', queueItem.id);

    // Update tracking event status
    if (success) {
      const eventUpdate: any = {};
      if (queueItem.platform === 'facebook') {
        eventUpdate.sent_to_facebook = true;
      } else if (queueItem.platform === 'google') {
        eventUpdate.sent_to_google = true;
      }
      
      if (Object.keys(eventUpdate).length > 0) {
        await supabaseClient
          .from('tracking_events')
          .update(eventUpdate)
          .eq('id', queueItem.event_id);
      }
    }

  } catch (error) {
    console.error(`Error processing ${queueItem.platform} API call:`, error);
    
    // Mark as failed
    await supabaseClient
      .from('tracking_api_queue')
      .update({
        status: queueItem.attempts >= queueItem.max_attempts ? 'failed' : 'pending',
        error_message: error.message,
        processed_at: new Date().toISOString()
      })
      .eq('id', queueItem.id);
  }
}



