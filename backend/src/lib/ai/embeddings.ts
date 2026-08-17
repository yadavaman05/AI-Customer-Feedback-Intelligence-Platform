import prisma from "@/lib/prisma";

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured.");
    }

    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            input: text.slice(0, 8000), // Hard cap for safety limits
            model: "text-embedding-3-small"
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to generate embedding: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
}

export async function storeFeedbackEmbedding(feedbackId: string, embedding: number[]) {
    // pgvector natively parses string arrays like '[0.1, 0.2]'
    const formattedVector = `[${embedding.join(',')}]`;

    // We execute raw SQL due to Prisma's Unsupported("vector(1536)") limitation avoiding native ORM inserts
    await prisma.$executeRaw`
        INSERT INTO "FeedbackEmbedding" ("id", "feedbackId", "embedding")
        VALUES (gen_random_uuid(), ${feedbackId}, ${formattedVector}::vector)
        ON CONFLICT ("feedbackId") DO UPDATE SET "embedding" = ${formattedVector}::vector;
    `;
    return true;
}

export async function searchSimilarFeedback(
    workspaceId: string,
    questionEmbedding: number[],
    topK: number = 5
): Promise<any[]> {
    const formattedVector = `[${questionEmbedding.join(',')}]`;

    // Perform Cosine Similarity (<=>) bounded securely to workspaceId
    const results = await prisma.$queryRaw`
        SELECT f.id, f.content, f.source, f."categoryId", c.name as category,
               1 - (e.embedding <=> ${formattedVector}::vector) as similarity
        FROM "Feedback" f
        JOIN "FeedbackEmbedding" e ON f.id = e."feedbackId"
        LEFT JOIN "FeedbackCategory" c ON f."categoryId" = c.id
        WHERE f."workspaceId" = ${workspaceId}
        ORDER BY e.embedding <=> ${formattedVector}::vector ASC
        LIMIT ${topK};
    `;

    return results as any[];
}
