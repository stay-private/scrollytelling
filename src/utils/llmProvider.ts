import { openaiConfig } from "https://unpkg.com/tailwind-llm-provider@1/dist/index.min.js";

let providerConfig: any = null;

export function setProviderConfig(config: any) {
  providerConfig = config;
}

function pickModel(provider: any) {
  if (!provider) return "gpt-4o-mini";

  const url = provider.baseUrl || "";
  if (url.includes("openai.com")) return "gpt-5";
  if (url.includes("generativelanguage.googleapis.com")) return "gemini-2.5-flash";
  if (url.includes("aipipe.org")) return "gpt-5";

  return "gpt-4o-mini"; // fallback
}

export async function generateResponse(prompt: string, options: any = {}) {
  if (!providerConfig) {
    await pickProvider();
  }

  const headers: any = {
    "Content-Type": "application/json",
    ...(providerConfig.apiKey && { Authorization: `Bearer ${providerConfig.apiKey}` }),
  };

  const model = pickModel(providerConfig);

  const res = await fetch(providerConfig.baseUrl + "/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  const completion = await res.json();
  const text = completion?.choices?.[0]?.message?.content || "";

  return { text, raw: completion };
}

export function getProviderConfig() {
  return providerConfig;
}

export function isConfigured() {
  return providerConfig && providerConfig.baseUrl && providerConfig.apiKey;
}