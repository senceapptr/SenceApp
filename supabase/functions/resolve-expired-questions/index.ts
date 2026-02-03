import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const RSS_FEED_URLS = JSON.parse(Deno.env.get('RSS_FEED_URLS') || '[]');

interface QuestionRow {
  id: string;
  title: string;
  description: string;
  status: string;
  end_date: string;
  suggested_result: string | null;
}

async function tryRssResolution(title: string, description: string) {
  // RSS logic here (stubbed for now)
  return null;
}

async function tryAiResolution(title: string, description: string) {
  if (!OPENAI_API_KEY) return null;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Sen bir tahmin piyasası çözümleyici asistanısın. Sana bir soru ve açıklama verilecek. 
                     Bu olayın gerçekleşip gerçekleşmediğini (Evet/Hayır) ve nedenini analiz et.
                     Yanıtın JSON formatında olmalı: {"result": "yes" | "no", "sourceDetail": "...", "confidence": 0-1}`
          },
          {
            role: 'user',
            content: `Soru: ${title}\nAçıklama: ${description}`
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return { ...result, source: 'ai' };
  } catch (e) {
    console.warn('OpenAI error', e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'all'; // cleanup | scan | all

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase credentials' }), { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const nowIso = new Date().toISOString();
    const results: any = { mode };

    // --- MOD 1: CLEANUP (5 dakikada bir çalışacak işlemler: Statü Değişikliği) ---
    if (mode === 'cleanup' || mode === 'all') {
      // 0) Pre-approved -> Resolved
      const { data: resData } = await supabase
        .from('questions')
        .update({ status: 'resolved', resolved_at: nowIso, updated_at: nowIso })
        .eq('status', 'active')
        .not('result', 'is', null)
        .lte('end_date', nowIso)
        .select('id');

      // 1) Active (Expired) -> Closed
      const { data: closeData } = await supabase
        .from('questions')
        .update({ status: 'closed', updated_at: nowIso })
        .eq('status', 'active')
        .is('result', null)
        .lte('end_date', nowIso)
        .select('id');

      // 2) Closed (With Result) -> Resolved
      const { data: finData } = await supabase
        .from('questions')
        .update({ status: 'resolved', resolved_at: nowIso, updated_at: nowIso })
        .eq('status', 'closed')
        .not('result', 'is', null)
        .lte('end_date', nowIso) // Sadece süresi bitenleri resolve et
        .select('id');

      results.cleanup = {
        resolvedCount: resData?.length ?? 0,
        closedCount: closeData?.length ?? 0,
        finalizedCount: finData?.length ?? 0
      };
    }

    // --- MOD 2: SCAN (30 dakikada bir çalışacak işlemler: AI/RSS Tarama) ---
    if (mode === 'scan' || mode === 'all') {
      const processed: string[] = [];
      const windowEndIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const { data: toScan } = await supabase
        .from('questions')
        .select('id, title, description, status')
        .is('suggested_result', null)
        .or(`and(status.eq.active,end_date.lte.${windowEndIso}),status.eq.closed`)
        .limit(10); // Batch limit

      for (const q of toScan ?? []) {
        const resolution = (RSS_FEED_URLS.length > 0 ? await tryRssResolution(q.title, q.description) : null)
          || (OPENAI_API_KEY ? await tryAiResolution(q.title, q.description) : null);

        if (resolution) {
          const richDetail = JSON.stringify({
            text: resolution.sourceDetail.slice(0, 500),
            confidence: resolution.confidence ?? 0,
            timestamp: nowIso
          });

          await supabase
            .from('questions')
            .update({
              suggested_result: resolution.result,
              suggested_result_source: (resolution as any).source || (RSS_FEED_URLS.length > 0 ? 'rss' : 'ai'),
              suggested_result_source_detail: richDetail,
              updated_at: nowIso,
            })
            .eq('id', q.id);
          processed.push(q.id);
        }
      }
      results.scan = {
        scannedCount: toScan?.length ?? 0,
        processedCount: processed.length,
        processedIds: processed
      };
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
