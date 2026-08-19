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

const groundedAnswerSchema = z.object({
    answer: z.string().describe("Your comprehensive answer answering the query solely based on the provided feedback context."),
    citations: z.array(z.string()).describe("An array of actual feedback IDs that directly supported your factual claims. Only include IDs explicitly provided.")
});

export async function generateGroundedAnswer(question: string, context: any[]) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const contextStr = context.map((item, index) => {
        return `[ID: ${item.id}]\nContent: ${item.content}\nSource: ${item.source}\nCategory: ${item.category || 'None'}\nSimilarity: ${item.similarity.toFixed(2)}\n---`;
    }).join('\n');

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1500,
            system: `You are a Customer Feedback Intelligence Assistant. Retrieve the answer to the user's question securely using ONLY the context provided below.
            
RULES:
1. Use ONLY the supplied feedback context. Do not invent facts.
2. If the context is insufficient to fully answer the question, state that clearly ("I cannot fully answer this based on the existing feedback.").
3. Detail uncertainty where applicable.
4. Output strict JSON exactly matching the schema. Your citation IDs must perfectly match the provided IDs.

Context Feedback:
${contextStr}
            `,
            messages: [
                { role: "user", content: `Question: ${question}` }
            ],
            tools: [
                {
                    name: "output_answer",
                    description: "Output the grounded answer with proper dataset citations.",
                    input_schema: {
                        type: "object",
                        properties: {
                            answer: { type: "string" },
                            citations: { type: "array", items: { type: "string" } }
                        },
                        required: ["answer", "citations"]
                    }
                }
            ],
            tool_choice: { type: "tool", name: "output_answer" }
        });

        const toolCall = response.content.find(c => c.type === "tool_use");
        if (!toolCall || toolCall.type !== "tool_use") return { answer: "Failed to generate grounded answer.", citations: [] };

        const parsed = groundedAnswerSchema.parse(toolCall.input);

        // Enrich citations with actual retrieved objects matching Zod outputs
        const enrichedCitations = parsed.citations.map(id => {
            const c = context.find(item => item.id === id);
            if (c) return { feedbackId: c.id, content: c.content, source: c.source, relevanceScore: c.similarity };
            return null;
        }).filter(Boolean);

        return {
            answer: parsed.answer,
            citations: enrichedCitations
        };
    } catch (error) {
        console.error("Claude Grounded QA Error:", error);
        return { answer: "An error occurred while generating the answer using the semantic context.", citations: [] };
    }
}

const vocSchema = z.object({
    narrative: z.string().describe("A concise 3-4 paragraph Voice-of-Customer report outlining overall picture, dominant sentiment, themes, complaints, and recommendations.")
});

export async function generateVoCNarrative(stats: any) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1500,
            system: `You are an expert Customer Success Analyst. Given the provided real statistical data about customer feedback over a period, generate a concise Voice-of-Customer narrative.
            
RULES:
1. Do not invent statistics. ONLY interpret the supplied numbers.
2. Structure the narrative engagingly into readable paragraphs.
3. Call out positive signals, problems, and actionable recommendations.
            `,
            messages: [
                { role: "user", content: `Customer Feedback Stats:\n${JSON.stringify(stats, null, 2)}` }
            ],
            tools: [
                {
                    name: "output_narrative",
                    description: "Output the generated VoC narrative strictly conforming to schema.",
                    input_schema: {
                        type: "object",
                        properties: {
                            narrative: { type: "string" }
                        },
                        required: ["narrative"]
                    }
                }
            ],
            tool_choice: { type: "tool", name: "output_narrative" }
        });

        const toolCall = response.content.find(c => c.type === "tool_use");
        if (!toolCall || toolCall.type !== "tool_use") return "Failed to generate narrative.";

        const parsed = vocSchema.parse(toolCall.input);
        return parsed.narrative;
    } catch (error) {
        console.error("Claude VoC generation error:", error);
        return "An error occurred generating the narrative.";
    }
}
