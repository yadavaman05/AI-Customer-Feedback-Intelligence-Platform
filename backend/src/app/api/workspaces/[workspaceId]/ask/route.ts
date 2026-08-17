import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import { searchSimilarFeedback, generateEmbedding } from "@/lib/ai/embeddings";
import { generateGroundedAnswer } from "@/lib/ai/claude";

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { question, topK = 5 } = body;

        if (!question || typeof question !== 'string' || question.length > 500) {
            return NextResponse.json({ error: "Invalid question. Must be a string under 500 chars." }, { status: 400 });
        }

        const k = Math.min(Math.max(1, topK), 20); // Cap retrieval to 20 to prevent enormous prompts

        // 1. Generate semantic query embedding
        let questionEmbedding: number[];
        try {
            questionEmbedding = await generateEmbedding(question);
        } catch (e) {
            console.error(e);
            return NextResponse.json({ error: "Embedding provider failed or incorrectly configured." }, { status: 503 });
        }

        // 2. Perform Workspace-Scoped Semantic Search
        let retrievedContext: any[] = [];
        try {
            retrievedContext = await searchSimilarFeedback(context.workspaceId, questionEmbedding, k);
        } catch (e) {
            console.error("Vector search failed. Ensure pgvector is active on the PostgreSQL connection:", e);
            return NextResponse.json({ error: "Semantic retrieval failed. Vector database extension mapping unavailable." }, { status: 501 });
        }

        if (!retrievedContext || retrievedContext.length === 0) {
            return NextResponse.json({
                answer: "I could not find any relevant feedback for your question.",
                citations: []
            }, { status: 200 });
        }

        // 3. Ground Ask output by Claude using scoped Context rules
        const response = await generateGroundedAnswer(question, retrievedContext);

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Ask Loop API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
