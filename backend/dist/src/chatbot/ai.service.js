"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
let AIService = class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.model = (() => {
            const envModel = process.env.GEMINI_MODEL || '';
            if (!envModel)
                return 'gemini-1.5-flash';
            if (envModel === 'gemini-1.5-pro')
                return 'gemini-1.5-pro-latest';
            if (envModel === 'gemini-1.5-flash')
                return 'gemini-1.5-flash';
            if (envModel.endsWith('-latest'))
                return envModel;
            return envModel;
        })();
    }
    buildSystemPrompt(context) {
        return `You are TVS Scholarship Assistant. Be concise, helpful, and factual.
Use bullet points when listing. If you don't know, say so and suggest next steps.
Context:\n${context}`;
    }
    async generate({ userMessage, context }) {
        const prompt = this.buildSystemPrompt(context);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const payload = {
            contents: [
                { role: 'user', parts: [{ text: prompt }] },
                { role: 'user', parts: [{ text: userMessage }] }
            ]
        };
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
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)()
], AIService);
//# sourceMappingURL=ai.service.js.map