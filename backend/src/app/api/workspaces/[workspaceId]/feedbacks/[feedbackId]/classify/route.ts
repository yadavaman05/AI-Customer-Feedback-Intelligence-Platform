import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { classifyFeedback } from "@/lib/ai/claude";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string, feedbackId: string } }
) {
    try {
        const { workspaceId, feedbackId } = params;
        const context = await requireWorkspaceAccess(workspaceId);

        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const fb = await prisma.feedback.findFirst({
            where: {
                id: feedbackId,
                workspaceId: context.workspaceId
            }
        });

        if (!fb) {
            return NextResponse.json({ error: "Feedback not found or access denied" }, { status: 404 });
        }

        const classification = await classifyFeedback(fb.content);
        if (!classification) {
            return NextResponse.json({ error: "Classification failed (invalid AI or format)" }, { status: 422 });
        }

        const stored = await storeFeedbackClassification(fb.id, context.workspaceId, classification);
        if (!stored) {
            return NextResponse.json({ error: "Failed to persist classification" }, { status: 500 });
        }

        return NextResponse.json({ success: true, classification }, { status: 200 });

    } catch (error) {
        console.error("Manual classification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
