import { Injectable } from '@nestjs/common';

@Injectable()
export class AIService {
  private readonly apiKey: string = process.env.GEMINI_API_KEY || '';
  private readonly model: string = (() => {
    const envModel = process.env.GEMINI_MODEL || '';
    if (!envModel) return 'gemini-1.5-flash';
    // Ensure supported naming for v1beta
    if (envModel === 'gemini-1.5-pro') return 'gemini-1.5-pro-latest';
    if (envModel === 'gemini-1.5-flash') return 'gemini-1.5-flash';
    if (envModel.endsWith('-latest')) return envModel;
    return envModel;
  })();

  private buildSystemPrompt(context: string) {
    return `You are TVS Scholarship Assistant. Be concise, helpful, and factual.
Use bullet points when listing. If you don't know, say so and suggest next steps.
Context:\n${context}`;
  }

  async generate({ userMessage, context }: { userMessage: string; context: string; }): Promise<string> {
    const prompt = this.buildSystemPrompt(context);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    } as any;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(`Gemini API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    return text;
  }
}


