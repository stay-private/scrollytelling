import { openaiConfig } from 'tailwind-llm-provider';

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

const COMMON_BASE_URLS = [
  { url: "https://openrouter.ai/api/v1", name: "OpenRouter" },
  { url: "https://api.aipipe.ai/v1", name: "AI Pipe" },
  { url: "https://api.llmfoundry.ai/v1", name: "LLM Foundry" }
];

const AVAILABLE_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google" },
  { id: "openai/gpt-5-codex", name: "GPT-5 Codex", provider: "OpenAI" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI" },
  { id: "qwen/qwen-2.5-coder-32b-instruct", name: "Qwen 2.5 Coder", provider: "Alibaba" },
  { id: "x-ai/grok-beta", name: "Grok Beta", provider: "xAI" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" }
];

export async function getLLMConfig() {
  try {
    const config = await openaiConfig({
      show: false,
      defaultBaseUrls: [DEFAULT_BASE_URL],
      title: "OpenRouter Configuration",
      help: "Configure your OpenRouter API key to access multiple AI models."
    });
    
    // Add default model if not set
    if (config && !config.model) {
      config.model = AVAILABLE_MODELS[0].id;
    }
    
    // Add default base URL if not set
    if (config && !config.baseUrl) {
      config.baseUrl = DEFAULT_BASE_URL;
    }
    
    return config;
  } catch (error) {
    return null;
  }
}

export async function showLLMConfigModal() {
  const config = await openaiConfig({
    show: true,
    defaultBaseUrls: [DEFAULT_BASE_URL],
    title: "Configure OpenRouter",
    help: "Enter your OpenRouter API key to access multiple AI models including GPT, Claude, Gemini, and more."
  });
  
  // Add default model if not set
  if (config && !config.model) {
    config.model = AVAILABLE_MODELS[0].id;
  }
  
  // Add default base URL if not set
  if (config && !config.baseUrl) {
    config.baseUrl = DEFAULT_BASE_URL;
  }
  
  return config;
}

export async function* generateResponseStream(config: any, prompt: string, options: any = {}) {
  if (!config || !config.apiKey) {
    throw new Error('OpenRouter API key is required');
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.apiKey}`,
    "HTTP-Referer": window.location.origin,
    "X-Title": "CSV Scrollytelling Generator"
  };

  const model = config.model || AVAILABLE_MODELS[0].id;

  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature ?? 0.7,
      stream: true
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get response stream');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON lines
            continue;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function generateResponse(config: any, prompt: string, options: any = {}) {
  let fullText = '';
  
  for await (const chunk of generateResponseStream(config, prompt, options)) {
    fullText += chunk;
  }
  
  return { text: fullText };
}

export function isConfigured(config: any) {
  return config && config.apiKey;
}

export function getAvailableModels() {
  return AVAILABLE_MODELS;
}

export function getCommonBaseUrls() {
  return COMMON_BASE_URLS;
}

export function getProviderConfig() {
  // This function is used by ConfigModal to get current config
  return null; // Will be handled by the modal component
}