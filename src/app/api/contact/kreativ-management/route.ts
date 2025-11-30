import { NextRequest, NextResponse } from 'next/server';

// Kreativ.Management API Configuration
const KREATIV_MANAGEMENT_API_URL = 'https://api.kreativ.management/Form/SubmitExternal';
// This should be set in your environment variables
// Get it from: Kreativ.Management → Kontaktformular → API Extern → API Key
const KREATIV_MANAGEMENT_FORM_ID = process.env.KREATIV_MANAGEMENT_FORM_ID || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      firstname,
      lastname,
      email,
      telephone,
      weddingdate,
      location,
      message,
      timestamp
    } = body;

    // Validate required fields according to kreativ.management API
    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      );
    }

    if (!firstname || !lastname) {
      return NextResponse.json(
        { error: 'Vor- und Nachname sind erforderlich' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Nachricht ist erforderlich' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!KREATIV_MANAGEMENT_FORM_ID) {
      console.error('KREATIV_MANAGEMENT_FORM_ID is not configured');
      return NextResponse.json(
        { error: 'API-Konfiguration fehlt. Bitte kontaktieren Sie den Administrator.' },
        { status: 500 }
      );
    }

    // Map form data to kreativ.management API format
    // According to: https://intercom.help/kreativmanagement/de/articles/4635035-kontaktformular-api-extern-infos
    const kreativManagementPayload = {
      formId: KREATIV_MANAGEMENT_FORM_ID,
      values: {
        // Kontaktperson - Required fields
        firstname: firstname,
        lastname: lastname,
        email: email, // Required by API
        
        // Optional contact fields
        ...(telephone && { telephone: telephone }),
        
        // Wedding specific fields
        ...(weddingdate && { weddingdate: weddingdate }),
        ...(location && { location: location }),
        
        // Message
        ...(message && { message: message }),
        
        // Additional metadata
        knownby: 'Landing Page /lp/hochzeit',
        notes: `Anfrage von Landing Page\nZeitstempel: ${timestamp || new Date().toISOString()}\n${location ? `Location: ${location}\n` : ''}${weddingdate ? `Hochzeitsdatum: ${weddingdate}\n` : ''}`,
      }
    };

    console.log('Sending to kreativ.management API:', {
      url: KREATIV_MANAGEMENT_API_URL,
      formId: KREATIV_MANAGEMENT_FORM_ID,
      hasEmail: !!email,
      hasName: !!(firstname && lastname),
    });

    // Send to kreativ.management API
    const response = await fetch(KREATIV_MANAGEMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kreativManagementPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kreativ.Management API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      
      return NextResponse.json(
        { 
          error: 'Fehler beim Senden an kreativ.management',
          details: errorText
        },
        { status: response.status }
      );
    }

    const result = await response.json().catch(() => ({}));

    console.log('Kreativ.Management API success:', {
      status: response.status,
      result: result,
    });

    return NextResponse.json({
      success: true,
      message: 'Anfrage erfolgreich an kreativ.management gesendet',
      kreativ_management_response: result
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { 
        error: 'Unerwarteter Fehler beim Senden der Anfrage',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

