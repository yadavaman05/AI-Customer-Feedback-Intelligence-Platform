import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { generateEmbedding, storeFeedbackEmbedding } from "@/lib/ai/embeddings";

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

        // Fetch feedback missing embeddings in this workspace securely
        const unembedded = await prisma.feedback.findMany({
            where: {
                workspaceId: context.workspaceId,
                embedding: { is: null }
            },
            take: 20 // Enforce strict controlled batching preventing API usage storming
        });

        let processed = 0;
        let embedded = 0;
        let failed = 0;

        for (const fb of unembedded) {
            processed++;
            try {
                const vector = await generateEmbedding(fb.content);
                await storeFeedbackEmbedding(fb.id, vector);
                embedded++;
            } catch (err) {
                console.error(`Backfill embedding error for ${fb.id}:`, err);
                failed++;
            }
        }

        return NextResponse.json({
            success: true,
            processed,
            embedded,
            failed
        }, { status: 200 });

    } catch (error) {
        console.error("Backfill Embeddings API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
