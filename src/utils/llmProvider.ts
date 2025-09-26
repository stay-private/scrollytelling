import { openaiConfig } from 'tailwind-llm-provider';

const baseUrls = [
  { name: "OpenAI", url: "https://api.openai.com/v1" },
  { name: "Google Gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai" },
  { name: "AI Pipe", url: "https://aipipe.org/openrouter/v1" },
  { name: "Custom Provider", url: "" }
];

export async function getLLMConfig() {
  try {
    return await openaiConfig({
      show: false,
      // Don't use baseUrls for getLLMConfig to allow flexibility
      defaultBaseUrls: [
        "https://api.openai.com/v1",
        "https://generativelanguage.googleapis.com/v1beta/openai", 
        "https://aipipe.org/openrouter/v1"
      ],
      title: "AI Provider Configuration",
      help: "Choose your preferred AI provider and enter your API key. Your credentials are stored locally and never shared."
    });
  } catch (error) {
    return null;
  }
}

export async function showLLMConfigModal() {
  return await openaiConfig({
    show: true,
    // Use input field with datalist instead of dropdown for flexibility
    defaultBaseUrls: [
      "https://api.openai.com/v1",
      "https://generativelanguage.googleapis.com/v1beta/openai", 
      "https://aipipe.org/openrouter/v1",
      "https://api.together.xyz/v1",
      "https://api.groq.com/openai/v1"
    ],
    title: "Choose Your AI Provider",
    help: "Configure your AI provider to generate scrollytelling stories. Your credentials are stored securely in your browser."
  });
}

export async function generateResponse(config: any, prompt: string, options: any = {}) {
  if (!config || !config.apiKey || !config.baseUrl) {
    throw new Error('Invalid LLM configuration');
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.apiKey}`,
  };

  // Choose model based on provider
  let model = "gpt-5-codex"; // Default fallback
  
  if (config.baseUrl) {
    const url = config.baseUrl.toLowerCase();
    if (url.includes('generativelanguage.googleapis.com')) {
      // Google Gemini
      model = "gemini-2.5-flash";
    } else if (url.includes('openai.com')) {
      // OpenAI
      model = "gpt-5-codex";
    } else if (url.includes('aipipe.org')) {
      // AI Pipe - use a popular model
      model = "gpt-5-codex";
    } else {
      // Custom provider - use configured model or fallback
      model = config.models && config.models.length > 0 ? config.models[0] : "gpt-5-codex";
    }
  }

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
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

export function isConfigured(config: any) {
  return config && config.apiKey && config.baseUrl;
}