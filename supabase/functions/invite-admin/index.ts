import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://qljgbskxopjkivkcuypu.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in Supabase secrets')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set')
}

Deno.serve(async (req) => {
  console.log('🚀 [Invite Admin Function] Request received:', {
    method: req.method,
    url: req.url,
  })

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { email, role = 'editor', redirectTo } = await req.json()

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured in Supabase secrets' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('📧 [Invite Admin Function] Creating user:', { email, role, redirectTo })

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Generate a secure random password
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      let password = ''
      for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    const generatedPassword = generatePassword()
    console.log('🔑 [Invite Admin Function] Generated password for user')

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some(u => u.email === email)

    let userId: string

    if (userExists) {
      // User exists, get their ID
      const existingUser = existingUsers.users.find(u => u.email === email)
      userId = existingUser!.id

      // Check if already in admin_users
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single()

      if (existingAdmin) {
        return new Response(
          JSON.stringify({ error: 'User is already an admin' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Update password for existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: generatedPassword,
      })

      if (updateError) {
        console.error('❌ [Invite Admin Function] Update password error:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to set password', details: updateError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Add existing user to admin_users
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: userId,
          email: email,
          role: role,
          name: email.split('@')[0] || 'New User',
        })

      if (insertError) {
        console.error('❌ [Invite Admin Function] Insert error:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to add user to admin_users', details: insertError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
    } else {
      // Create new user with password
      const { data: createUserData, error: createUserError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: generatedPassword,
        user_metadata: {
          role: role,
        },
      })

      if (createUserError) {
        console.error('❌ [Invite Admin Function] Create user error:', createUserError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user', details: createUserError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (!createUserData?.user) {
        return new Response(
          JSON.stringify({ error: 'Failed to create user', details: 'No user data returned' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }

      userId = createUserData.user.id

      // Create admin_users entry
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: userId,
          email: email,
          role: role,
          name: email.split('@')[0] || 'New User',
        })

      if (insertError) {
        console.error('❌ [Invite Admin Function] Insert error:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to add user to admin_users', details: insertError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    console.log('✅ [Invite Admin Function] User created/updated with password:', { userId, email })

    // Direct link to login page (no tokens needed)
    const loginUrl = redirectTo || 'https://dz-photo-neu.vercel.app/admin-login'

    // Send email via Resend with password
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Einladung zum Admin-Bereich</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e0e0e0;">
    <h1 style="color: #333; margin-top: 0;">Einladung zum DZ Photo Admin-Bereich</h1>
    <p>Du wurdest eingeladen, dem Admin-Bereich von DZ Photo beizutreten.</p>
    <p>Hier sind deine Zugangsdaten:</p>
    <div style="background-color: #f4f4f4; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 10px 0;"><strong>E-Mail:</strong> ${email}</p>
      <p style="margin: 10px 0;"><strong>Passwort:</strong> <code style="background-color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 16px; letter-spacing: 1px;">${generatedPassword}</code></p>
    </div>
    <p style="margin: 30px 0;">
      <a href="${loginUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Zur Login-Seite</a>
    </p>
    <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      Bitte ändere dein Passwort nach dem ersten Login. Falls du diese Einladung nicht angefordert hast, kannst du diese E-Mail ignorieren.
    </p>
  </div>
</body>
</html>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DZ Photo Admin <login@mail.growing-brands.de>',
        to: [email],
        subject: 'Einladung zum DZ Photo Admin-Bereich',
        html: emailHtml,
      }),
    })

    if (!resendResponse.ok) {
      let errorData: any = {};
      try {
        const errorText = await resendResponse.text();
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Unknown Resend error' };
        }
      } catch (e) {
        errorData = { message: 'Failed to read Resend error response' };
      }
      console.error('❌ [Invite Admin Function] Resend error:', {
        status: resendResponse.status,
        statusText: resendResponse.statusText,
        error: errorData,
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: errorData.message || 'Unknown Resend error',
          resend_status: resendResponse.status,
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json; charset=utf-8',
          } 
        }
      )
    }

    let resendData: any = {};
    try {
      resendData = await resendResponse.json();
    } catch (jsonError) {
      console.warn('⚠️ [Invite Admin Function] Could not parse Resend response as JSON, but email was sent');
      // Email was sent (status 200), so continue with success
    }
    
    console.log('✅ [Invite Admin Function] Email sent successfully:', {
      email: email,
      resend_id: resendData.id,
      resend_status: resendResponse.status,
    })

    // Always return valid JSON with proper headers
    const successResponse = {
      success: true,
      message: 'Invitation sent successfully',
      user: { id: userId, email },
      note: 'Die Einladung wurde versendet. Bitte prüfen Sie auch Ihren Spam-Ordner.',
    };

    return new Response(
      JSON.stringify(successResponse),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': JSON.stringify(successResponse).length.toString(),
        } 
      }
    )
  } catch (error: any) {
    console.error('❌ [Invite Admin Function] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
