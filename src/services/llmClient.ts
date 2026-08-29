/**
 * Google Gemini & OpenRouter LLM Client
 * Follows /ponytail: native fetch, zero dependencies, graceful offline fallback.
 */

export interface LlmConfig {
  geminiApiKey?: string;
  openrouterApiKey?: string;
  model?: string;
}

export class LlmClient {
  private geminiApiKey: string | undefined;
  private openrouterApiKey: string | undefined;
  private model: string;

  constructor(config?: LlmConfig) {
    this.geminiApiKey = config?.geminiApiKey || process.env.GEMINI_API_KEY;
    this.openrouterApiKey = config?.openrouterApiKey || process.env.OPENROUTER_API_KEY;
    this.model = config?.model || 'gemini-2.5-flash';
  }

  isConfigured(): boolean {
    return Boolean(
      (this.geminiApiKey && this.geminiApiKey.trim().length > 0) ||
      (this.openrouterApiKey && this.openrouterApiKey.trim().length > 0)
    );
  }

  getProvider(): 'gemini' | 'openrouter' | 'none' {
    if (this.geminiApiKey && this.geminiApiKey.trim().length > 0) return 'gemini';
    if (this.openrouterApiKey && this.openrouterApiKey.trim().length > 0) return 'openrouter';
    return 'none';
  }

  async generateChat(prompt: string, systemPrompt?: string): Promise<string | null> {
    if (!this.isConfigured()) {
      return null;
    }

    // Provider: Google Gemini
    if (this.geminiApiKey) {
      try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\nTask:\n${prompt}` : prompt;
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiApiKey}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
          }),
        });

        if (!response.ok) {
          console.warn(`[LlmClient:Gemini] API returned status: ${response.status}`);
          return null;
        }

        const data = (await response.json()) as any;
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return reply || null;
      } catch (err) {
        console.warn('[LlmClient:Gemini] Failed to query Gemini API:', err);
        return null;
      }
    }

    // Provider: OpenRouter Fallback
    if (this.openrouterApiKey) {
      try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openrouterApiKey}`,
          },
          body: JSON.stringify({
            model: 'z-ai/glm-5.2:free',
            messages,
            temperature: 0.1,
          }),
        });

        if (!response.ok) return null;
        const data = (await response.json()) as any;
        return data?.choices?.[0]?.message?.content || null;
      } catch {
        return null;
      }
    }

    return null;
  }
}

export const defaultLlmClient = new LlmClient();
