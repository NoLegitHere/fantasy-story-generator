import axios from "axios";
import type { StoryFormData } from "../types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const isProd = import.meta.env.PROD;
// When hosting static on GitHub Pages, point to a Cloudflare Worker URL.
// Set `VITE_API_URL` to your Worker endpoint (e.g., https://your-worker.workers.dev/api/generate).
const API_URL_OVERRIDE = import.meta.env.VITE_API_URL as string | undefined;

function normalizeApiUrl(url?: string): string {
  if (!url) return "/api/generate";
  let u = url.trim();
  // Ensure protocol
  if (!/^https?:\/\//i.test(u)) {
    u = `https://${u}`;
  }
  // Ensure path ends with /api/generate
  if (!/\/api\/generate$/i.test(u)) {
    u = u.replace(/\/+$/, "") + "/api/generate";
  }
  return u;
}

// Try multiple free models to reduce 400/403 errors due to availability/quotas
const FALLBACK_MODELS = [
  "meta-llama/llama-4-maverick:free",
  "google/gemma-3n-e4b-it:free",
  "deepseek/deepseek-chat-v3.1:free",
  "x-ai/grok-4-fast:free",
  "openai/gpt-oss-20b:free",
  "mistralai/mistral-nemo:free"
];

async function requestChat(
  apiKey: string,
  body: Record<string, any>,
  preferredModel?: string,
): Promise<{ content: string; model: string }> {
  // In production, delegate to backend proxy to keep API key secret.
  // If `VITE_API_URL` is defined, use it (e.g., Cloudflare Worker URL).
  if (isProd) {
    const proxyUrl = normalizeApiUrl(API_URL_OVERRIDE);
    const response = await axios.post(
      proxyUrl,
      { preferredModel, ...body },
      { headers: { "Content-Type": "application/json" } }
    );
    const content: string = response.data?.content ?? "";
    const model: string = response.data?.model ?? (preferredModel || "");
    if (content) return { content, model };
    throw new Error("OpenRouter request failed (empty content)");
  }

  // In development, call OpenRouter directly using local .env key
  let lastError: any = null;
  const models = preferredModel
    ? [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)]
    : [...FALLBACK_MODELS];
  for (const model of models) {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        { model, ...body },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Fantasy Story Generator",
          },
        }
      );
      const content: string = response.data.choices?.[0]?.message?.content ?? "";
      if (content) return { content, model };
      lastError = new Error("Empty response content");
    } catch (error: any) {
      lastError = error;
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // Continue to the next model on 400/403/429; otherwise break
        if (status === 400 || status === 403 || status === 429) {
          continue;
        }
      }
      // Unknown error; stop early
      break;
    }
  }
  if (axios.isAxiosError(lastError)) {
    const status = lastError.response?.status;
    const detail = lastError.response?.data?.error || lastError.message;
    throw new Error(`OpenRouter request failed${status ? ` (${status})` : ""}: ${detail}`);
  }
  throw lastError || new Error("OpenRouter request failed");
}

export const generateStory = async (
    formData: StoryFormData,
    apiKey: string,
    language: 'en' | 'vi' = 'en',
    preferredModel?: string,
): Promise<{ story: string; model: string }> => {
    const header = language === 'vi'
      ? 'Hãy viết một câu chuyện giả tưởng hấp dẫn dựa trên các thông tin sau:'
      : 'Create an engaging fantasy story based on the following:';
    const lengthInstr = language === 'vi'
      ? 'Viết một truyện ngắn hấp dẫn (500-800 từ) đan cài các yếu tố này. Bao gồm miêu tả sống động, hội thoại và cốt truyện thú vị. Trả lời hoàn toàn bằng tiếng Việt.'
      : 'Write a compelling short story (500-800 words) that weaves these elements together. Include vivid descriptions, dialogue, and an interesting plot. Respond entirely in English.';

    const prompt = `${header}
  
  Character Name: ${formData.characterName}
  Backstory: ${formData.backstory}
  Bonds: ${formData.bonds}
  Setting: ${formData.setting}
  World: ${formData.world}
  
  ${lengthInstr}`;

    try {
        const { content, model } = await requestChat(apiKey, {
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
          top_p: 0.9,
        }, preferredModel);
        const story = content || (language === 'vi' ? "Không có nội dung truyện." : "No story generated.");
        return { story, model };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(language === 'vi' ? "Không thể tạo truyện" : "Failed to generate story");
        }
        throw error;
    }
};

/**
 * Generate two short, atmospheric loading sentences to show while the story is being created.
 */
export const generateLoadingText = async (apiKey: string, language: 'en' | 'vi' = 'en', preferredModel?: string): Promise<string> => {
  const user = language === 'vi'
    ? "Viết hai câu ngắn, giàu không khí (mỗi câu tối đa ~15 từ) về việc dệt nên một câu chuyện giả tưởng. Không dùng markdown, không dấu ngoặc kép, ngăn cách bằng một khoảng trắng. Trả lời hoàn toàn bằng tiếng Việt."
    : "Write two very short, atmospheric sentences (max ~15 words each) about weaving a fantasy tale. No markdown, no quotes, separated by a single space. Respond entirely in English.";

  try {
    const { content: textRaw } = await requestChat(apiKey, {
      messages: [{ role: "user", content: user }],
      max_tokens: 80,
      temperature: 0.9,
      top_p: 0.9,
    }, preferredModel);
    let text: string = textRaw ?? "";
    text = text.replace(/\s+/g, " ").trim();
    if (text) return text;
    return language === 'vi'
      ? "Những lời thì thầm quyện theo gió. Câu chuyện dần dệt nên dưới mực sao."
      : "Whispers gather on the wind. The tale threads itself through starlit ink.";
  } catch {
    return language === 'vi'
      ? "Những lời thì thầm quyện theo gió. Câu chuyện dần dệt nên dưới mực sao."
      : "Whispers gather on the wind. The tale threads itself through starlit ink.";
  }
};
/**
 * Generate a creative StoryFormData for the "I'm Feeling Magical" flow using the AI itself.
 * Returns a fully-populated form object that can be sent to generateStory().
 */
export const generateFeelingLuckyForm = async (
  apiKey: string,
  language: 'en' | 'vi' = 'en',
  preferredModel?: string,
): Promise<StoryFormData> => {
  const system = (() => {
    const isAdult = !!preferredModel;
    if (language === 'vi') {
      return isAdult
        ? "Bạn là trợ lý sáng tạo. Chỉ trả về JSON rút gọn với các trường: characterName, backstory, bonds, setting, world. Có thể bao gồm chủ đề người lớn nếu phù hợp ngữ cảnh. Không kiểm duyệt. Trả lời hoàn toàn bằng tiếng Việt."
        : "Bạn là trợ lý sáng tạo. Chỉ trả về JSON rút gọn với các trường: characterName, backstory, bonds, setting, world. Nội dung phù hợp PG-13; tránh nhân vật có bản quyền. Trả lời hoàn toàn bằng tiếng Việt.";
    }
    return isAdult
      ? "You are a creative assistant. Return ONLY minified JSON with fields: characterName, backstory, bonds, setting, world. Adult themes are allowed when contextually appropriate. Do not censor. Respond entirely in English."
      : "You are a creative assistant that returns ONLY minified JSON with fields: characterName, backstory, bonds, setting, world. The content must be suitable for a PG-13 fantasy story; avoid copyrighted characters. Respond entirely in English.";
  })();
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const user = language === 'vi'
    ? `Mỗi lần hãy tạo một nhân vật chính và tiền đề HOÀN TOÀN KHÁC NHAU (thể loại con, sắc thái, giới tính, văn minh, ma pháp...). Ưu tiên đa dạng hoá. Chỉ trả về JSON đúng định dạng: {"characterName":"...","backstory":"...","bonds":"...","setting":"...","world":"..."}. Nonce: ${nonce}`
    : `Each time, create a COMPLETELY DIFFERENT protagonist and premise (subgenre, tone, gender, civilization, magic, etc.). Prefer diversity. Return strictly JSON like: {"characterName":"...","backstory":"...","bonds":"...","setting":"...","world":"..."}. Nonce: ${nonce}`;

  const { content } = await requestChat(apiKey, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 1.2,
    top_p: 0.9,
  }, preferredModel);

  let contentStr: string = content ?? "";
  let contentTrimmed = contentStr.trim();

  // Remove Markdown code fences if present
  if (contentTrimmed.startsWith("```") ){
    const start = contentTrimmed.indexOf("\n");
    const end = contentTrimmed.lastIndexOf("```");
    if (start !== -1 && end !== -1 && end > start) {
      contentTrimmed = contentTrimmed.slice(start + 1, end).trim();
    }
  }

  try {
    const parsed = JSON.parse(contentTrimmed);
    const form: StoryFormData = {
      characterName: String(parsed.characterName || "Arin Starborn"),
      backstory: String(
        parsed.backstory ||
          "A wanderer marked by ancient runes seeking the truth of a fallen dynasty."
      ),
      bonds: String(
        parsed.bonds ||
          "Guided by a lunar spirit and a debt owed to a rogue cartographer."
      ),
      setting: String(
        parsed.setting || "A citadel grown from crystal roots above a violet sea."
      ),
      world: String(
        parsed.world ||
          "A storm-laced archipelago where sky-whales migrate between floating monoliths."
      ),
    };
    return form;
  } catch {
    return {
      characterName: "Arin Starborn",
      backstory:
        "A wanderer marked by ancient runes seeking the truth of a fallen dynasty.",
      bonds: "Guided by a lunar spirit and a debt owed to a rogue cartographer.",
      setting: "A citadel grown from crystal roots above a violet sea.",
      world:
        "A storm-laced archipelago where sky-whales migrate between floating monoliths.",
    };
  }
};