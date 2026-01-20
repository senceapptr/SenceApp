/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from '@std/http'
import { createClient } from '@supabase/supabase-js'
// SendGrid SDK Deno ile uyumlu değil, direkt REST API kullanıyoruz

// Type-safe environment variable helper
function getEnvVar(key: string, defaultValue: string = ''): string {
  const denoEnv = (Deno as unknown as { env?: { get?: (key: string) => string | undefined } }).env;
  const value = denoEnv?.get?.(key);
  return typeof value === 'string' ? value : defaultValue;
}

// Environment variables - Supabase Secrets'ten alınır
// NOT: Edge Functions Supabase sunucularında çalıştığı için .env.local'e erişemez
// Tüm environment variables Supabase Secrets veya otomatik inject edilen değerlerden gelir
//
// Secrets eklemek için:
// supabase secrets set SENDGRID_API_KEY=your_key
// supabase secrets set SENDGRID_FROM_EMAIL=your_email
// supabase secrets set SUPABASE_URL=https://xxx.supabase.co (opsiyonel - zaten otomatik mevcut)
// supabase secrets set SUPABASE_SERVICE_ROLE_KEY=xxx (opsiyonel - zaten otomatik mevcut)

const SENDGRID_API_KEY = getEnvVar('SENDGRID_API_KEY', '');
const SENDGRID_FROM_EMAIL = getEnvVar('SENDGRID_FROM_EMAIL', 'sence-hi@senceapp.tr');

// Supabase URL ve Service Role Key:
// 1. Otomatik olarak Supabase tarafından inject ediliyor (Deno.env.get ile)
// 2. Opsiyonel olarak secrets'tan da alınabilir (eğer eklenmişse)
// getEnvVar önce secrets'ı kontrol eder, yoksa otomatik inject edilen değeri kullanır
const SUPABASE_URL = getEnvVar('SUPABASE_URL', '');
const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '');

serve(async (req) => {
  try {
    // Environment variables kontrolü
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials:', {
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_SERVICE_ROLE_KEY
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing Supabase credentials',
          details: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set'
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    // Request body
    const { userId, email } = await req.json()

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: 'userId and email required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // Supabase client (service role - RLS bypass)
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Kullanıcının varlığını kontrol et
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single()

    if (profileError || !profile || typeof profile !== 'object') {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // Email kontrolü
    if (profile.email !== email) {
      return new Response(
        JSON.stringify({ error: 'Email does not match user profile' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // 6 haneli kod oluştur
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 10 dakika geçerlilik
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Eski aktif kodları iptal et (aynı user için)
    await supabaseAdmin
      .from('email_verification_codes')
      .update({ is_used: true })
      .eq('user_id', userId)
      .eq('email', email)
      .eq('is_used', false)

    // Yeni kodu database'e kaydet
    const { error: dbError } = await supabaseAdmin
      .from('email_verification_codes')
      .insert({
        user_id: userId,
        email: email,
        code: code,
        expires_at: expiresAt.toISOString(),
        is_used: false,
        attempts: 0
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    // SendGrid ile email gönder (REST API kullanarak - Deno uyumlu)
    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY not set - check Supabase Secrets')
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          details: 'SENDGRID_API_KEY secret not found. Please set it in Supabase Dashboard → Edge Functions → Secrets'
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      )
    }

    // Web link (domain'deki verify sayfası için)
    const verifyUrl = `https://sence.app/verify?code=${code}&email=${encodeURIComponent(email)}`

    // SendGrid REST API ile email gönder
    const emailPayload = {
      personalizations: [
        {
          to: [{ email: email }],
          subject: 'Sence - Email Doğrulama Kodu'
        }
      ],
      from: { email: SENDGRID_FROM_EMAIL },
      content: [
        {
          type: 'text/plain',
          value: `Sence Email Doğrulama Kodu\n\nMerhaba,\n\nEmail adresinizi doğrulamak için 6 haneli kodunuz:\n\n${code}\n\nBu kodu uygulamanızda girebilir veya aşağıdaki linke tıklayabilirsiniz:\n\n${verifyUrl}\n\nBu kod 10 dakika geçerlidir.\n\nEğer bu kodu siz istemediyseniz, bu email'i görmezden gelebilirsiniz.`
        },
        {
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Doğrulama - Sence</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                          <h1 style="color: #432870; margin: 0 0 20px 0; font-size: 28px;">Email Doğrulama</h1>
                          <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                            Merhaba,<br><br>
                            Email adresinizi doğrulamak için 6 haneli kodunuz:
                          </p>
                          <div style="background: linear-gradient(135deg, #432870 0%, #5a3a8f 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                            <h2 style="color: #ffffff; font-size: 42px; letter-spacing: 12px; margin: 0; font-weight: bold;">${code}</h2>
                          </div>
                          <p style="color: #6B7280; font-size: 14px; margin: 20px 0;">
                            Bu kodu uygulamanızda girebilir veya aşağıdaki linke tıklayabilirsiniz:
                          </p>
                          <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #432870 0%, #5a3a8f 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                            Email'i Doğrula
                          </a>
                          <p style="color: #9CA3AF; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                            ⏰ Bu kod 10 dakika geçerlidir.<br>
                            Eğer bu kodu siz istemediyseniz, bu email'i görmezden gelebilirsiniz.
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
        }
      ]
    }

    // SendGrid REST API'ye istek gönder
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    })

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text()
      console.error('SendGrid API error:', sendGridResponse.status, errorText)
      throw new Error(`SendGrid API error: ${sendGridResponse.status} - ${errorText}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code sent successfully',
        expiresIn: 600 // 10 dakika (saniye cinsinden)
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Send OTP error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorStack || 'No additional details available',
        type: error instanceof Error ? error.constructor.name : typeof error
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

