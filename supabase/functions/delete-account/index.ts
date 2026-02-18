/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from '@std/http';
import { createClient } from '@supabase/supabase-js';

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

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: missing Supabase credentials' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }

  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user: requester },
      error: requesterError,
    } = await supabaseAdmin.auth.getUser(token);

    if (requesterError || !requester) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const requestBody = await req.json().catch(() => ({}));
    const requestedUserId = typeof requestBody?.userId === 'string' ? requestBody.userId : requester.id;

    if (requestedUserId !== requester.id) {
      const { data: requesterProfile, error: requesterProfileError } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', requester.id)
        .single();

      if (requesterProfileError || !requesterProfile?.is_admin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        });
      }
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(requestedUserId);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true, userId: requestedUserId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
