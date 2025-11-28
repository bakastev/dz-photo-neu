import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  // Log IMMEDIATELY - before anything else
  console.log('🚀🚀🚀 [Invite API] ====== ROUTE CALLED ======');
  console.log('🚀🚀🚀 [Invite API] Request method:', request.method);
  console.log('🚀🚀🚀 [Invite API] Request URL:', request.url);
  console.log('🚀🚀🚀 [Invite API] Timestamp:', new Date().toISOString());
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔐 [Invite API] Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    });
    
    // Check authentication
    const { client: supabase, getResponse } = createApiSupabaseClient(request);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    let response = getResponse();

    if (authError || !user) {
      console.error('❌ [Invite API] Auth error:', authError);
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          details: authError?.message || 'Authentication failed. Please log in again.'
        },
        { 
          status: 401,
          headers: response.headers,
        }
      );
    }

    console.log('✅ [Invite API] User authenticated:', { userId: user.id, email: user.email });

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role, email')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser || adminUser.role !== 'admin') {
      console.error('❌ [Invite API] Admin check failed:', { adminError, adminUser });
      return NextResponse.json(
        { 
          error: 'Forbidden',
          details: 'Only admins can invite users.'
        },
        { status: 403, headers: response.headers }
      );
    }

    console.log('✅ [Invite API] Admin check passed');

    // Parse request body
    const { email, role = 'editor' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address', details: 'Please provide a valid email address' },
        { status: 400, headers: response.headers }
      );
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local'
        },
        { status: 500 }
      );
    }

    // Determine redirect URL
    const origin = request.nextUrl.origin;
    const redirectTo = `${origin}/admin-login`;

    console.log('📞 [Invite API] Calling Edge Function:', {
      email,
      role,
      redirectTo,
      url: `${supabaseUrl}/functions/v1/invite-admin`,
    });

    // Call Edge Function
    console.log('📞 [Invite API] About to call Edge Function...');
    const edgeFunctionResponse = await fetch(`${supabaseUrl}/functions/v1/invite-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ email, role, redirectTo }),
    });

    console.log('📥 [Invite API] Edge Function response:', {
      status: edgeFunctionResponse.status,
      statusText: edgeFunctionResponse.statusText,
      ok: edgeFunctionResponse.ok,
      contentType: edgeFunctionResponse.headers.get('content-type'),
    });

    let edgeFunctionData: any = {};
    try {
      const responseText = await edgeFunctionResponse.text();
      console.log('📥 [Invite API] Edge Function response text length:', responseText.length);
      console.log('📥 [Invite API] Edge Function response text preview:', responseText.substring(0, 500));
      
      if (!responseText || responseText.trim() === '') {
        console.error('❌ [Invite API] Empty response from Edge Function');
        return NextResponse.json(
          { 
            error: 'Empty response from Edge Function',
            details: 'The Edge Function returned an empty response'
          },
          { status: 500, headers: response.headers }
        );
      }
      
      try {
        edgeFunctionData = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error('❌ [Invite API] JSON parse error:', jsonError);
        console.error('❌ [Invite API] Response text that failed to parse:', responseText);
        return NextResponse.json(
          { 
            error: 'Failed to parse Edge Function response',
            details: `Invalid JSON: ${jsonError.message}. Response: ${responseText.substring(0, 200)}`
          },
          { status: 500, headers: response.headers }
        );
      }
    } catch (parseError: any) {
      console.error('❌ [Invite API] Failed to read Edge Function response:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to read Edge Function response',
          details: parseError.message || 'Unknown parse error'
        },
        { status: 500, headers: response.headers }
      );
    }

    if (!edgeFunctionResponse.ok) {
      console.error('❌ [Invite API] Edge Function error:', edgeFunctionData);
      return NextResponse.json(
        { 
          error: edgeFunctionData?.error || 'Failed to send invitation',
          details: edgeFunctionData?.details || 'Unknown error'
        },
        { status: edgeFunctionResponse.status, headers: response.headers }
      );
    }

    console.log('✅ [Invite API] Success:', edgeFunctionData);
    response = getResponse();

    return NextResponse.json({
      success: true,
      message: edgeFunctionData.message || 'Invitation sent successfully',
      user: edgeFunctionData.user,
      note: edgeFunctionData.note || 'Die Einladung wurde versendet. Bitte prüfen Sie auch Ihren Spam-Ordner.',
    }, {
      status: 200,
      headers: response.headers,
    });
  } catch (error: any) {
    console.error('❌❌❌ [Invite API] FATAL ERROR:', error);
    console.error('❌❌❌ [Invite API] Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: error.stack || 'No stack trace available'
      },
      { status: 500 }
    );
  }
}
