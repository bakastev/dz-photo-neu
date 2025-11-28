import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createApiSupabaseClient } from '@/lib/auth-server';

/**
 * Test endpoint to verify invite functionality without sending email
 * This helps debug the invite process
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qljgbskxopjkivkcuypu.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🧪 [Test Invite API] Starting test...');

    // Check authentication
    const { client: supabase, getResponse } = createApiSupabaseClient(request);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    let response = getResponse();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Please log in first' },
        { status: 401, headers: response.headers }
      );
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, role, email')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', details: 'Admin access required' },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email', details: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error', details: 'SUPABASE_SERVICE_ROLE_KEY is not set' },
        { status: 500 }
      );
    }

    // Create admin client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user exists
    const { data: existingUser } = await adminClient.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email === email);

    // Test the invite function (but don't actually send)
    const testResult = {
      authenticated: true,
      isAdmin: true,
      email,
      userExists,
      serviceKeyPresent: !!supabaseServiceKey,
      supabaseUrl,
      canInvite: true,
      message: userExists 
        ? 'User already exists in Supabase Auth' 
        : 'User does not exist, invite would be sent',
    };

    console.log('🧪 [Test Invite API] Test result:', testResult);

    return NextResponse.json({
      success: true,
      test: testResult,
      note: 'This is a test endpoint. No email was sent. Check the logs above for details.',
    }, {
      status: 200,
      headers: response.headers,
    });
  } catch (error: any) {
    console.error('❌ [Test Invite API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}

