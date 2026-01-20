/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from '@std/http'
import { createClient } from '@supabase/supabase-js'

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
// Supabase URL ve Service Role Key:
// 1. Otomatik olarak Supabase tarafından inject ediliyor (Deno.env.get ile)
// 2. Opsiyonel olarak secrets'tan da alınabilir (eğer eklenmişse)
// getEnvVar önce secrets'ı kontrol eder, yoksa otomatik inject edilen değeri kullanır
const SUPABASE_URL = getEnvVar('SUPABASE_URL', '');
const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '');

serve(async (req) => {
  try {
    // CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const { userId, email, code } = await req.json()

    if (!userId || !email || !code) {
      return new Response(
        JSON.stringify({ error: 'userId, email, and code are required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Code format kontrolü (6 haneli sayı)
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: 'Code must be 6 digits' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

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

    // Kodu kontrol et
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('email_verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('email', email)
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (codeError || !codeData) {
      // Yanlış kod - attempt sayısını artır (eğer kod bulunursa)
      const { data: wrongCodeData } = await supabaseAdmin
        .from('email_verification_codes')
        .select('id, attempts')
        .eq('user_id', userId)
        .eq('email', email)
        .eq('code', code)
        .eq('is_used', false)
        .single()

      if (wrongCodeData) {
        await supabaseAdmin
          .from('email_verification_codes')
          .update({ attempts: wrongCodeData.attempts + 1 })
          .eq('id', wrongCodeData.id)
      }

      // Hata mesajı
      let errorMessage = 'Invalid or expired code'
      if (codeData && codeData.expires_at <= new Date().toISOString()) {
        errorMessage = 'Code has expired. Please request a new code.'
      } else if (codeData && codeData.is_used) {
        errorMessage = 'This code has already been used. Please request a new code.'
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          remainingAttempts: wrongCodeData ? Math.max(0, 3 - (wrongCodeData.attempts + 1)) : undefined
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // 3'ten fazla deneme kontrolü
    if (codeData.attempts >= 3) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many failed attempts. Please request a new code.'
        }),
        { 
          status: 429, // Too Many Requests
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Kod doğru - kullanıldı olarak işaretle
    const { error: updateError } = await supabaseAdmin
      .from('email_verification_codes')
      .update({ is_used: true })
      .eq('id', codeData.id)

    if (updateError) {
      console.error('Update code error:', updateError)
      throw updateError
    }

    // Profili verified olarak işaretle
    const { error: verifyError } = await supabaseAdmin
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', userId)

    if (verifyError) {
      console.error('Verify profile error:', verifyError)
      throw verifyError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email verified successfully'
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
    console.error('Verify OTP error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        details: error instanceof Error ? error.stack : String(error)
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

