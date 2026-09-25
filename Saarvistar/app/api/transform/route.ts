import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Shape of the body this route accepts
interface TransformRequestBody {
  source_text: string;
  user_prompt?: string;
  output_types: string[];
}

// Shape of the JSON n8n sends back (only requested keys will be present)
export interface N8nTransformResponse {
  exec_summary?: string;
  linkedin_post?: string;
  public_advisory?: string;
  twitter_thread?: string;
  [key: string]: string | undefined;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Read env vars ──────────────────────────────────────────────────────
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET; // optional

  if (!webhookUrl) {
    console.error('[/api/transform] N8N_WEBHOOK_URL is not configured');
    return NextResponse.json(
      { error: 'Server configuration error: N8N_WEBHOOK_URL is not set.' },
      { status: 503 }
    );
  }

  // ── 2. Parse & validate request body ─────────────────────────────────────
  let body: TransformRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const { source_text, user_prompt, output_types } = body;

  if (!source_text || typeof source_text !== 'string' || source_text.trim() === '') {
    return NextResponse.json(
      { error: 'Missing required field: source_text must be a non-empty string.' },
      { status: 400 }
    );
  }

  if (
    !output_types ||
    !Array.isArray(output_types) ||
    output_types.length === 0
  ) {
    return NextResponse.json(
      { error: 'Missing required field: output_types must be a non-empty array.' },
      { status: 400 }
    );
  }

  // ── 3. Forward to n8n with a 60-second timeout ────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60_000);

  try {
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (webhookSecret) {
      forwardHeaders['X-Webhook-Secret'] = webhookSecret;
    }

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify({ source_text, user_prompt, output_types }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ── 4. Handle non-2xx from n8n ──────────────────────────────────────────
    if (!n8nRes.ok) {
      let errorBody: unknown;
      try {
        errorBody = await n8nRes.json();
      } catch {
        errorBody = await n8nRes.text();
      }
      console.error(`[/api/transform] n8n returned ${n8nRes.status}:`, errorBody);
      return NextResponse.json(
        {
          error: `Upstream workflow error (${n8nRes.status}).`,
          detail: errorBody,
        },
        { status: n8nRes.status >= 500 ? 502 : n8nRes.status }
      );
    }

    // ── 5. Pass n8n response straight through ─────────────────────────────
    const data: N8nTransformResponse = await n8nRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[/api/transform] Request to n8n timed out after 60s');
      return NextResponse.json(
        { error: 'The upstream workflow timed out. Please try again.' },
        { status: 504 }
      );
    }

    console.error('[/api/transform] Network or unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to reach the upstream workflow. Please check your connection.' },
      { status: 502 }
    );
  }
}
