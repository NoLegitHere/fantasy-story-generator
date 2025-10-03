export interface Env { OPENROUTER_API_KEY: string }

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const FALLBACK_MODELS = [
  "x-ai/grok-4-fast:free",
];

function corsHeaders(origin?: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } as Record<string, string>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || undefined;
    try {
      const url = new URL(request.url);

      // Preflight
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      }

      if (url.pathname !== "/api/generate") {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const apiKey = env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      let body: any;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const { messages, temperature, top_p, max_tokens, preferredModel } = body || {};
      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: "Invalid 'messages' payload" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const models: string[] = preferredModel
        ? [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)]
        : [...FALLBACK_MODELS];

      let lastError: any = null;
      for (const model of models) {
        try {
          const hdrs = new Headers();
          hdrs.set("Authorization", `Bearer ${apiKey}`);
          hdrs.set("Content-Type", "application/json");
          const referer = request.headers.get("origin") || request.headers.get("referer");
          if (referer) hdrs.set("HTTP-Referer", referer);
          hdrs.set("X-Title", "Fantasy Story Generator");

          const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: hdrs,
            body: JSON.stringify({ model, messages, temperature, top_p, max_tokens }),
          });

          interface OpenRouterResponse {
            error?: string;
            choices?: Array<{ message?: { content?: string } }>;
          }
          const ct = response.headers.get("content-type") || "";
          let data: OpenRouterResponse = {};
          if (ct.includes("application/json")) {
            data = (await response.json()) as OpenRouterResponse;
          } else {
            const txt = await response.text();
            data = { error: txt };
          }
          if (!response.ok) {
            if (response.status === 400 || response.status === 403 || response.status === 429) {
              lastError = { status: response.status, detail: data?.error || "OpenRouter error" };
              continue;
            }
            return new Response(JSON.stringify({ error: data?.error || "OpenRouter request failed" }), {
              status: response.status,
              headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
            });
          }

          const content: string = data?.choices?.[0]?.message?.content ?? "";
          if (content) {
            return new Response(JSON.stringify({ content, model }), {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
            });
          }
          lastError = { status: 500, detail: "Empty response content" };
        } catch (err: any) {
          lastError = err;
          break;
        }
      }

      const status = lastError?.status || 500;
      const detail = lastError?.detail || (typeof lastError?.message === "string" ? lastError.message : "OpenRouter request failed");
      return new Response(JSON.stringify({ error: detail }), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    } catch (err: any) {
      const detail = typeof err?.message === "string" ? err.message : String(err);
      return new Response(JSON.stringify({ error: "Worker exception", detail }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }
  }
}