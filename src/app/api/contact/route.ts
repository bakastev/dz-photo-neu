import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Kreativ.Management API Configuration
const KREATIV_MANAGEMENT_API_URL = 'https://api.kreativ.management/Form/SubmitExternal';
const KREATIV_MANAGEMENT_FORM_ID = process.env.KREATIV_MANAGEMENT_FORM_ID || '';

const getSupabase = () => {
  if (!supabaseKey) {
    throw new Error('Supabase key not configured');
  }
  return createClient(supabaseUrl, supabaseKey);
};

// Helper function to split name into firstname and lastname
function splitName(name: string): { firstname: string; lastname: string } {
  if (!name) return { firstname: '', lastname: '' };
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstname: parts[0], lastname: '' };
  }
  
  // Take first part as firstname, rest as lastname
  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(' ')
  };
}

// Helper function to format wedding date from YYYY-MM-DD to dd.MM.yyyy HH:mm
function formatWeddingDate(dateString: string | null | undefined): string | undefined {
  if (!dateString) return undefined;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Default time: 14:00 (2 PM)
    return `${day}.${month}.${year} 14:00`;
  } catch {
    return undefined;
  }
}

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

    // Split name into firstname and lastname for kreativ.management
    const { firstname, lastname } = splitName(name);

    // Send to kreativ.management API first
    let kreativManagementSuccess = false;
    if (KREATIV_MANAGEMENT_FORM_ID) {
      try {
        const kreativManagementPayload = {
          formId: KREATIV_MANAGEMENT_FORM_ID,
          values: {
            // Kontaktperson - Required fields
            firstname: firstname || name, // Fallback to full name if split fails
            lastname: lastname || '',
            email: email, // Required by API
            
            // Optional contact fields
            ...(phone && { telephone: phone }),
            
            // Wedding specific fields
            ...(wedding_date && { weddingdate: formatWeddingDate(wedding_date) }),
            ...(location && { location: location }),
            
            // Message
            message: message,
            
            // Additional metadata
            knownby: 'Startseite /',
            notes: `Anfrage von Startseite\nService: ${service_type || 'hochzeitsfotografie'}\nZeitstempel: ${timestamp || new Date().toISOString()}\n${location ? `Location: ${location}\n` : ''}${wedding_date ? `Hochzeitsdatum: ${wedding_date}\n` : ''}`,
          }
        };

        console.log('Sending to kreativ.management API from homepage:', {
          url: KREATIV_MANAGEMENT_API_URL,
          formId: KREATIV_MANAGEMENT_FORM_ID,
          hasEmail: !!email,
          hasName: !!(firstname || name),
        });

        const kreativResponse = await fetch(KREATIV_MANAGEMENT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(kreativManagementPayload),
        });

        if (kreativResponse.ok) {
          kreativManagementSuccess = true;
          console.log('Kreativ.Management API success from homepage');
        } else {
          const errorText = await kreativResponse.text();
          console.error('Kreativ.Management API error from homepage:', {
            status: kreativResponse.status,
            error: errorText,
          });
        }
      } catch (kreativError) {
        console.error('Kreativ.Management API error from homepage:', kreativError);
        // Continue with Supabase fallback
      }
    } else {
      console.warn('KREATIV_MANAGEMENT_FORM_ID not configured, skipping kreativ.management API');
    }

    // Also store in Supabase as backup/archive
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
      // If kreativ.management succeeded, still return success
      if (kreativManagementSuccess) {
        return NextResponse.json({
          success: true,
          message: 'Anfrage erfolgreich gesendet',
          note: 'Gespeichert in kreativ.management (Supabase Backup fehlgeschlagen)'
        });
      }
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
            submission_id: data.id,
            kreativ_management_success: kreativManagementSuccess
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
      submission_id: data.id,
      kreativ_management_success: kreativManagementSuccess
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Senden der Anfrage' },
      { status: 500 }
    );
  }
}
