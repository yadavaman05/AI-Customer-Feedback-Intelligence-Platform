import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { FeedbackSource, Sentiment } from "@prisma/client";
import { classifyFeedback } from "@/lib/ai/claude";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";
import { generateEmbedding, storeFeedbackEmbedding } from "@/lib/ai/embeddings";

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;

        // 1. RBAC and Auth Check - verify workspace access
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Generate synthetic feedbacks to mimic integration channels
        const syntheticData = [
            {
                content: "Checkout failed when I tried to pay.",
                source: FeedbackSource.API,
                sentiment: Sentiment.NEGATIVE,
            },
            {
                content: "Your support team resolved my issue quickly.",
                source: FeedbackSource.EMAIL,
                sentiment: Sentiment.POSITIVE,
            },
            {
                content: "The mobile application keeps logging me out.",
                source: FeedbackSource.WIDGET,
                sentiment: Sentiment.NEGATIVE,
            },
            {
                content: "I was charged twice for the same order.",
                source: FeedbackSource.CSV,
                sentiment: Sentiment.NEGATIVE,
            },
            {
                content: "The delivery took much longer than expected.",
                source: FeedbackSource.MANUAL,
                sentiment: Sentiment.NEGATIVE,
            },
            {
                content: "Loved the new dashboard update!",
                source: FeedbackSource.API,
                sentiment: Sentiment.POSITIVE,
            },
            {
                content: "Pricing page is a bit confusing.",
                source: FeedbackSource.WIDGET,
                sentiment: Sentiment.MIXED,
            }
        ];

        // Ensure all created records use strictly the context workspaceId
        const recordsToInsert = syntheticData.map(data => ({
            ...data,
            workspaceId: context.workspaceId,
        }));

        let generatedCount = 0;
        let classifiedCount = 0;

        for (const data of recordsToInsert) {
            try {
                const created = await prisma.feedback.create({ data });
                generatedCount++;

                const classification = await classifyFeedback(created.content);
                if (classification) {
                    const stored = await storeFeedbackClassification(created.id, context.workspaceId, classification);
                    if (stored) classifiedCount++;
                }

                try {
                    const embedding = await generateEmbedding(created.content);
                    await storeFeedbackEmbedding(created.id, embedding);
                } catch (e) {
                    // safe skip
                }
            } catch (err) {
                console.error("Simulation error", err);
            }
        }

        return NextResponse.json({
            success: true,
            summary: {
                totalGenerated: generatedCount,
                totalClassified: classifiedCount,
                message: "Successfully generated simulated channel feedback."
            }
        }, { status: 201 });

    } catch (error) {
        console.error("POST Feedback Simulation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
