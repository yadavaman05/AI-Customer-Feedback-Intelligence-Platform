import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { Sentiment } from '@prisma/client';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const ClassificationSchema = z.object({
    sentiment: z.nativeEnum(Sentiment),
    theme: z.string().min(1).max(100),
    summary: z.string().min(1).max(1000)
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

export async function classifyFeedback(content: string): Promise<ClassificationResult | null> {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const systemPrompt = `You are a customer feedback classifier. 
Please classify the user's feedback.
Return ONLY valid JSON without markdown wrapping.
Structure:
{
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "MIXED" | "UNANALYZED",
  "theme": "A short category name like PAYMENT, DELIVERY, PRODUCT, BUG",
  "summary": "1 sentence max summary"
}`;

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 300,
            temperature: 0,
            system: systemPrompt,
            messages: [{ role: "user", content }],
        });

        const textBlock = response.content[0];
        if (textBlock.type !== 'text') {
            return null;
        }

        let parsedJson;
        try {
            const raw = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '');
            parsedJson = JSON.parse(raw);
        } catch (e) {
            console.error("AI returned malformed JSON");
            return null;
        }

        const validated = ClassificationSchema.safeParse(parsedJson);
        if (!validated.success) {
            console.error("Zod Validation Failed", validated.error);
            return null;
        }

        return validated.data;
    } catch (error) {
        console.error("Claude API Error:", error);
        return null;
    }
}
