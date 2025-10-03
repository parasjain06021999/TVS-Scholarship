export declare class AIService {
    private readonly apiKey;
    private readonly model;
    private buildSystemPrompt;
    generate({ userMessage, context }: {
        userMessage: string;
        context: string;
    }): Promise<string>;
}
