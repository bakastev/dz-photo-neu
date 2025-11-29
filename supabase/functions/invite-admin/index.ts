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

    // Send email via Resend with password - Design System Style (READABLE!)
    const emailHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Einladung zum Admin-Bereich - DZ Photo</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F5F5F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 2px solid #D0B888;">
          <!-- Header with Gold Accent -->
          <tr>
            <td style="background: linear-gradient(135deg, #D0B888 0%, #B8960F 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">
                Einladung zum Admin-Bereich
              </h1>
              <p style="margin: 12px 0 0; font-size: 16px; color: #FFFFFF; font-weight: 400; opacity: 0.95;">
                DZ Photo - Hochzeitsfotografie
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px; background-color: #FFFFFF;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hallo,
              </p>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #333333;">
                du wurdest eingeladen, dem Admin-Bereich von <strong style="color: #D0B888;">DZ Photo</strong> beizutreten. 
                Hier kannst du Inhalte verwalten, neue Hochzeiten hinzufügen und deine Website selbstständig pflegen.
              </p>
              
              <!-- Credentials Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F8F8F8; border: 2px solid #D0B888; border-radius: 12px; margin: 32px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 20px; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: #D0B888; text-align: center;">
                      Deine Zugangsdaten
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #E0E0E0;">
                          <p style="margin: 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">E-Mail</p>
                          <p style="margin: 6px 0 0; font-size: 16px; color: #333333; font-weight: 500;">${email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0;">
                          <p style="margin: 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Passwort</p>
                          <p style="margin: 6px 0 0; font-size: 20px; font-family: 'Courier New', monospace; color: #D0B888; font-weight: 700; letter-spacing: 2px; background-color: #FFFFFF; padding: 10px 16px; border-radius: 6px; border: 1px solid #D0B888; display: inline-block;">${generatedPassword}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 32px 0 24px;">
                    <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #D0B888 0%, #B8960F 100%); color: #FFFFFF; text-decoration: none; padding: 16px 36px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(208, 184, 136, 0.4);">
                      Zur Login-Seite →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Text -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFF9E6; border-left: 4px solid #D0B888; border-radius: 6px; padding: 16px; margin-top: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;">
                      <strong style="color: #D0B888;">⚠️ Wichtig:</strong> Bitte ändere dein Passwort nach dem ersten Login für mehr Sicherheit.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F8F8F8; border-top: 1px solid #E0E0E0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666; line-height: 1.5;">
                Falls du diese Einladung nicht angefordert hast, kannst du diese E-Mail ignorieren.<br>
                <span style="color: #D0B888; font-weight: 600;">DZ Photo</span> · Hochzeitsfotografie in Oberösterreich
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
