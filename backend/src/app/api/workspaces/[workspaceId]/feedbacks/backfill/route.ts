import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { classifyFeedback } from "@/lib/ai/claude";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";

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

        // Fetch feedback missing classification
        const unclassified = await prisma.feedback.findMany({
            where: {
                workspaceId: context.workspaceId,
                aiInsight: null
            },
            take: 20 // Process in controlled batches
        });

        let processed = 0;
        let classified = 0;
        let failed = 0;

        for (const fb of unclassified) {
            processed++;
            try {
                const classification = await classifyFeedback(fb.content);
                if (classification) {
                    const stored = await storeFeedbackClassification(fb.id, context.workspaceId, classification);
                    if (stored) classified++;
                    else failed++;
                } else {
                    failed++;
                }
            } catch (err) {
                console.error("Backfill row error:", err);
                failed++;
            }
        }

        return NextResponse.json({
            processed,
            classified,
            skipped: 0,
            failed
        }, { status: 200 });

    } catch (error) {
        console.error("Backfill API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
