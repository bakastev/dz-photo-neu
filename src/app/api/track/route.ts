import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_name,
      event_data,
      timestamp,
      url,
      referrer,
      user_agent
    } = body;

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown';

    // Generate session ID from IP + User Agent
    const session_id = Buffer.from(`${ip}-${user_agent}`).toString('base64').substring(0, 32);

    // Store tracking event directly in database for now
    const { data, error } = await supabase
      .from('tracking_events')
      .insert({
        event_name,
        event_data: {
          ...event_data,
          url,
          referrer,
          timestamp
        },
        session_id,
        ip_address: ip,
        user_agent,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Tracking error:', error);
      // Don't fail silently - tracking is not critical for user experience
      return NextResponse.json({ success: true, message: 'Tracking skipped' });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
