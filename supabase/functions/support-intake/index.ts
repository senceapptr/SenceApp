/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from '@std/http';
import { createClient } from '@supabase/supabase-js';

type IntakeAction = 'submit_feedback' | 'submit_support';

function getEnvVar(key: string, defaultValue = ''): string {
  const denoEnv = (Deno as unknown as { env?: { get?: (name: string) => string | undefined } }).env;
  const value = denoEnv?.get?.(key);
  return typeof value === 'string' ? value : defaultValue;
}

const SUPABASE_URL = getEnvVar('SUPABASE_URL', '');
const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Server configuration error: missing Supabase credentials' }, 500);
  }

  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: 'Invalid session' }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action as IntakeAction | undefined;

    if (!action) {
      return jsonResponse({ error: 'Action is required' }, 400);
    }

    if (action === 'submit_support') {
      const category = String(body?.category || '').trim();
      const subject = String(body?.subject || '').trim();
      const message = String(body?.message || '').trim();

      if (!category || !subject || message.length < 20) {
        return jsonResponse({ error: 'Eksik veya geçersiz destek talebi alanları.' }, 400);
      }

      const { data, error } = await supabaseAdmin
        .from('support_tickets')
        .insert({
          category,
          message,
          subject,
          user_id: user.id,
        })
        .select('id, status, created_at')
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      return jsonResponse({ data });
    }

    if (action === 'submit_feedback') {
      const type = String(body?.type || '').trim();
      const subject = String(body?.subject || '').trim();
      const message = String(body?.message || '').trim();

      if (!type || !subject || message.length < 10) {
        return jsonResponse({ error: 'Eksik veya geçersiz geri bildirim alanları.' }, 400);
      }

      const { data, error } = await supabaseAdmin
        .from('feedback_submissions')
        .insert({
          message,
          subject,
          type,
          user_id: user.id,
        })
        .select('id, status, created_at')
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      return jsonResponse({ data });
    }

    return jsonResponse({ error: 'Unsupported action' }, 400);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
