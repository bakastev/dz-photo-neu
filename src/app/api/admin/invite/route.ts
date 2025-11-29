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
    let edgeFunctionResponse: Response;
    let fetchSucceeded = false;
    
    try {
      edgeFunctionResponse = await fetch(`${supabaseUrl}/functions/v1/invite-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ email, role, redirectTo }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(45000), // 45 seconds timeout (Edge Functions can be slow)
      });
      fetchSucceeded = true;
    } catch (fetchError: any) {
      console.error('❌ [Invite API] Fetch error:', fetchError);
      // If it's a timeout or network error, but the email might have been sent
      // Check if it's a timeout
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        // Timeout - but email might have been sent, so return success with warning
        console.warn('⚠️ [Invite API] Timeout occurred, but email may have been sent');
        return NextResponse.json(
          { 
            success: true,
            message: 'Invitation may have been sent',
            warning: 'The request took longer than expected. Please check your email inbox.',
            note: 'Bitte prüfen Sie auch Ihren Spam-Ordner. Die Einladung wurde möglicherweise bereits versendet.'
          },
          { status: 200, headers: response.headers }
        );
      }
      return NextResponse.json(
        { 
          error: 'Failed to reach Edge Function',
          details: fetchError.message || 'Network error'
        },
        { status: 500, headers: response.headers }
      );
    }
    
    if (!fetchSucceeded) {
      // This shouldn't happen, but just in case
      return NextResponse.json(
        { 
          error: 'Failed to call Edge Function',
          details: 'Unknown fetch error'
        },
        { status: 500, headers: response.headers }
      );
    }

    console.log('📥 [Invite API] Edge Function response:', {
      status: edgeFunctionResponse.status,
      statusText: edgeFunctionResponse.statusText,
      ok: edgeFunctionResponse.ok,
      contentType: edgeFunctionResponse.headers.get('content-type'),
    });

    let edgeFunctionData: any = {};
    let responseText = '';
    
    // Always try to read the response, but be very lenient with errors
    try {
      responseText = await edgeFunctionResponse.text();
      console.log('📥 [Invite API] Edge Function response:', {
        status: edgeFunctionResponse.status,
        statusText: edgeFunctionResponse.statusText,
        ok: edgeFunctionResponse.ok,
        textLength: responseText.length,
        textPreview: responseText.substring(0, 200),
      });
    } catch (readError: any) {
      console.error('❌ [Invite API] Failed to read response text:', readError);
      // If status is 200 or 201, assume success
      if (edgeFunctionResponse.ok || edgeFunctionResponse.status === 201) {
        console.log('✅ [Invite API] Assuming success despite read error (status OK)');
        return NextResponse.json({
          success: true,
          message: 'Invitation sent successfully',
          note: 'Die Einladung wurde versendet. Bitte prüfen Sie auch Ihren Spam-Ordner.',
        }, {
          status: 200,
          headers: response.headers,
        });
      }
      // For non-OK status, return error
      return NextResponse.json(
        { 
          error: 'Failed to read Edge Function response',
          details: readError.message || 'Unknown read error',
          status: edgeFunctionResponse.status,
        },
        { status: edgeFunctionResponse.status || 500, headers: response.headers }
      );
    }
    
    // Handle empty response
    if (!responseText || responseText.trim() === '') {
      console.warn('⚠️ [Invite API] Empty response from Edge Function, status:', edgeFunctionResponse.status);
      // If status is 200/201, assume success
      if (edgeFunctionResponse.ok || edgeFunctionResponse.status === 201) {
        console.log('✅ [Invite API] Assuming success despite empty response (status OK)');
        return NextResponse.json({
          success: true,
          message: 'Invitation sent successfully',
          note: 'Die Einladung wurde versendet. Bitte prüfen Sie auch Ihren Spam-Ordner.',
        }, {
          status: 200,
          headers: response.headers,
        });
      }
      // For non-OK status, return error
      return NextResponse.json(
        { 
          error: 'Empty response from Edge Function',
          details: 'The Edge Function returned an empty response',
          status: edgeFunctionResponse.status,
        },
        { status: edgeFunctionResponse.status || 500, headers: response.headers }
      );
    }
    
    // Try to parse JSON
    try {
      edgeFunctionData = JSON.parse(responseText);
    } catch (jsonError: any) {
      console.error('❌ [Invite API] JSON parse error:', jsonError);
      console.error('❌ [Invite API] Response text:', responseText);
      // If status is 200/201, assume success even if JSON parsing fails
      if (edgeFunctionResponse.ok || edgeFunctionResponse.status === 201) {
        console.log('✅ [Invite API] Assuming success despite JSON parse error (status OK)');
        return NextResponse.json({
          success: true,
          message: 'Invitation sent successfully',
          note: 'Die Einladung wurde versendet. Bitte prüfen Sie auch Ihren Spam-Ordner.',
        }, {
          status: 200,
          headers: response.headers,
        });
      }
      // For non-OK status, return error
      return NextResponse.json(
        { 
          error: 'Failed to parse Edge Function response',
          details: `Invalid JSON: ${jsonError.message}. Response preview: ${responseText.substring(0, 200)}`,
          status: edgeFunctionResponse.status,
        },
        { status: edgeFunctionResponse.status || 500, headers: response.headers }
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
