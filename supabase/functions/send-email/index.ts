import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SEND_EMAIL_HOOK_SECRET = Deno.env.get('SEND_EMAIL_HOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://qljgbskxopjkivkcuypu.supabase.co'
const FROM_EMAIL = 'login@mail.growing-brands.de'
const FROM_NAME = 'DZ Photo Admin'

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set')
}

if (!SEND_EMAIL_HOOK_SECRET) {
  console.error('SEND_EMAIL_HOOK_SECRET is not set')
}

Deno.serve(async (req) => {
  // Log ALL requests, even if they don't have webhook headers
  console.log('🔔 [Send Email Hook] Request received:', {
    method: req.method,
    url: req.url,
    hasHeaders: !!req.headers,
    headers: Object.fromEntries(req.headers),
  })

  if (req.method !== 'POST') {
    console.log('❌ [Send Email Hook] Method not allowed:', req.method)
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    // Normalize headers - HTTP headers are case-insensitive, but standardwebhooks might expect lowercase
    const rawHeaders = Object.fromEntries(req.headers)
    const headers: Record<string, string> = {}
    
    // Convert all header keys to lowercase for standardwebhooks
    for (const [key, value] of Object.entries(rawHeaders)) {
      headers[key.toLowerCase()] = value
    }

    console.log('📥 [Send Email Hook] Payload received:', {
      payloadLength: payload.length,
      hasWebhookId: !!headers['webhook-id'],
      hasWebhookSignature: !!headers['webhook-signature'],
      hasWebhookTimestamp: !!headers['webhook-timestamp'],
      rawHeaderKeys: Object.keys(rawHeaders),
      normalizedHeaderKeys: Object.keys(headers),
    })

    if (!SEND_EMAIL_HOOK_SECRET) {
      console.error('❌ [Send Email Hook] SEND_EMAIL_HOOK_SECRET is not configured')
      console.error('❌ [Send Email Hook] Environment variables:', {
        hasResendKey: !!RESEND_API_KEY,
        hasHookSecret: !!SEND_EMAIL_HOOK_SECRET,
        allEnvKeys: Object.keys(Deno.env.toObject()).filter(k => k.includes('EMAIL') || k.includes('RESEND') || k.includes('HOOK')),
      })
      throw new Error('SEND_EMAIL_HOOK_SECRET is not configured')
    }

    console.log('🔐 [Send Email Hook] Secret found:', {
      secretLength: SEND_EMAIL_HOOK_SECRET.length,
      secretPrefix: SEND_EMAIL_HOOK_SECRET.substring(0, 20),
      secretFormat: SEND_EMAIL_HOOK_SECRET.startsWith('v1,whsec_') ? 'correct' : 'incorrect',
    })

    // Extract the secret from the format "v1,whsec_<base64_secret>"
    const hookSecret = SEND_EMAIL_HOOK_SECRET.replace('v1,whsec_', '')
    console.log('🔑 [Send Email Hook] Extracted secret:', {
      secretLength: hookSecret.length,
      secretPrefix: hookSecret.substring(0, 10),
    })

    const wh = new Webhook(hookSecret)

    // Verify the webhook signature
    console.log('🔍 [Send Email Hook] Verifying webhook signature...')
    console.log('🔍 [Send Email Hook] All headers:', Object.keys(headers))
    console.log('🔍 [Send Email Hook] Headers for verification:', {
      webhookId: headers['webhook-id'],
      webhookSignature: headers['webhook-signature'] ? headers['webhook-signature'].substring(0, 50) + '...' : 'missing',
      webhookTimestamp: headers['webhook-timestamp'],
      payloadPreview: payload.substring(0, 200),
    })
    
    let user, email_data
    try {
      // Try to verify with the headers as-is
      const verified = wh.verify(payload, headers) as {
        user: {
          email: string
          email_confirmed_at?: string
        }
        email_data: {
          token: string
          token_hash: string
          redirect_to: string
          email_action_type: string
          site_url: string
          token_new?: string
          token_hash_new?: string
        }
      }
      user = verified.user
      email_data = verified.email_data
    } catch (verifyError: any) {
      console.error('❌ [Send Email Hook] Webhook verification failed:', {
        error: verifyError.message,
        errorName: verifyError.name,
        payloadLength: payload.length,
        headers: Object.keys(headers),
      })
      throw verifyError
    }

    console.log('📧 [Send Email Hook] Processing email:', {
      email: user.email,
      action_type: email_data.email_action_type,
      redirect_to: email_data.redirect_to,
    })

    // Generate the confirmation URL
    const confirmationUrl = `${SUPABASE_URL}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`

    // Determine subject and email content based on action type
    let subject: string
    let htmlContent: string

    switch (email_data.email_action_type) {
      case 'invite':
        subject = 'Einladung zum DZ Photo Admin-Bereich'
        htmlContent = generateInviteEmailHtml(
          confirmationUrl,
          email_data.token,
          email_data.redirect_to
        )
        break
      case 'signup':
        subject = 'Bestätige deine E-Mail-Adresse'
        htmlContent = generateSignupEmailHtml(
          confirmationUrl,
          email_data.token,
          email_data.redirect_to
        )
        break
      case 'magiclink':
        subject = 'Dein Magic Link für DZ Photo'
        htmlContent = generateMagicLinkEmailHtml(
          confirmationUrl,
          email_data.token,
          email_data.redirect_to
        )
        break
      case 'recovery':
        subject = 'Passwort zurücksetzen'
        htmlContent = generateRecoveryEmailHtml(
          confirmationUrl,
          email_data.token,
          email_data.redirect_to
        )
        break
      case 'email_change':
        subject = 'E-Mail-Adresse ändern bestätigen'
        htmlContent = generateEmailChangeHtml(
          confirmationUrl,
          email_data.token,
          email_data.token_new || '',
          email_data.redirect_to
        )
        break
      default:
        subject = 'DZ Photo Benachrichtigung'
        htmlContent = generateDefaultEmailHtml(
          confirmationUrl,
          email_data.token,
          email_data.redirect_to
        )
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [user.email],
        subject: subject,
        html: htmlContent,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      console.error('❌ [Send Email Hook] Resend error:', errorData)
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`)
    }

    const resendData = await resendResponse.json()
    console.log('✅ [Send Email Hook] Email sent successfully:', {
      email: user.email,
      resend_id: resendData.id,
    })

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('❌ [Send Email Hook] Error:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message || 'Failed to send email',
        },
      }),
      {
        status: error.code || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

// Email template generators
function generateInviteEmailHtml(
  confirmationUrl: string,
  token: string,
  redirectTo: string
): string {
  return `
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
    <p style="margin: 30px 0;">
      <a href="${confirmationUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Einladung annehmen</a>
    </p>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Alternativ kannst du diesen Code verwenden:<br>
      <code style="background-color: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">${token}</code>
    </p>
    <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      Falls du diese Einladung nicht angefordert hast, kannst du diese E-Mail ignorieren.
    </p>
  </div>
</body>
</html>
  `
}

function generateSignupEmailHtml(
  confirmationUrl: string,
  token: string,
  redirectTo: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Mail bestätigen</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e0e0e0;">
    <h1 style="color: #333; margin-top: 0;">Bestätige deine E-Mail-Adresse</h1>
    <p>Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
    <p style="margin: 30px 0;">
      <a href="${confirmationUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">E-Mail bestätigen</a>
    </p>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Alternativ kannst du diesen Code verwenden:<br>
      <code style="background-color: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">${token}</code>
    </p>
  </div>
</body>
</html>
  `
}

function generateMagicLinkEmailHtml(
  confirmationUrl: string,
  token: string,
  redirectTo: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magic Link</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e0e0e0;">
    <h1 style="color: #333; margin-top: 0;">Dein Magic Link</h1>
    <p>Klicke auf den Link unten, um dich anzumelden:</p>
    <p style="margin: 30px 0;">
      <a href="${confirmationUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Anmelden</a>
    </p>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Alternativ kannst du diesen Code verwenden:<br>
      <code style="background-color: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">${token}</code>
    </p>
  </div>
</body>
</html>
  `
}

function generateRecoveryEmailHtml(
  confirmationUrl: string,
  token: string,
  redirectTo: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e0e0e0;">
    <h1 style="color: #333; margin-top: 0;">Passwort zurücksetzen</h1>
    <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
    <p style="margin: 30px 0;">
      <a href="${confirmationUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Passwort zurücksetzen</a>
    </p>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Alternativ kannst du diesen Code verwenden:<br>
      <code style="background-color: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">${token}</code>
    </p>
    <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
    </p>
  </div>
</body>
</html>
  `
}

function generateEmailChangeHtml(
  confirmationUrl: string,
  token: string,
  tokenNew: string,
  redirectTo: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Mail-Adresse ändern</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e0e0e0;">
    <h1 style="color: #333; margin-top: 0;">E-Mail-Adresse ändern bestätigen</h1>
    <p>Bitte bestätige die Änderung deiner E-Mail-Adresse.</p>
    <p style="margin: 30px 0;">
      <a href="${confirmationUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Änderung bestätigen</a>
    </p>
    ${tokenNew ? `<p style="color: #666; font-size: 14px; margin-top: 30px;">
      Neuer Bestätigungscode:<br>
      <code style="background-color: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">${tokenNew}</code>
    </p>` : ''}
  </div>
</body>
</html>
  `
}

function generateDefaultEmailHtml(
  confirmationUrl: string,
  token: string,
  redirectTo: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DZ Photo Benachrichtigung</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e0e0e0;">
    <h1 style="color: #333; margin-top: 0;">DZ Photo Benachrichtigung</h1>
    <p>Bitte klicke auf den Link unten, um fortzufahren:</p>
    <p style="margin: 30px 0;">
      <a href="${confirmationUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Fortfahren</a>
    </p>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Alternativ kannst du diesen Code verwenden:<br>
      <code style="background-color: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 16px; letter-spacing: 2px;">${token}</code>
    </p>
  </div>
</body>
</html>
  `
}

