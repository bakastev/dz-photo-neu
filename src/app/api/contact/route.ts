import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const getSupabase = () => {
  if (!supabaseKey) {
    throw new Error('Supabase key not configured');
  }
  return createClient(supabaseUrl, supabaseKey);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      wedding_date,
      location,
      message,
      service_type,
      timestamp
    } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, Email und Nachricht sind erforderlich' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          wedding_date: wedding_date || null,
          location: location || null,
          message,
          service_type: service_type || 'hochzeitsfotografie',
          status: 'new',
          submitted_at: timestamp || new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Anfrage' },
        { status: 500 }
      );
    }

    // Track the contact submission
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/track-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          event_name: 'contact_form_submission',
          event_data: {
            service_type,
            has_wedding_date: !!wedding_date,
            has_location: !!location,
            submission_id: data.id
          },
          user_data: {
            email: email,
            name: name
          },
          page_data: {
            page_url: request.headers.get('referer') || '/',
            page_title: 'Contact Form'
          }
        })
      });
    } catch (trackingError) {
      console.error('Tracking error:', trackingError);
      // Don't fail the main request if tracking fails
    }

    return NextResponse.json({
      success: true,
      message: 'Anfrage erfolgreich gesendet',
      submission_id: data.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Senden der Anfrage' },
      { status: 500 }
    );
  }
}
