import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { FeedbackStatus } from "@prisma/client";

export async function PATCH(
    request: Request,
    { params }: { params: { workspaceId: string; feedbackId: string } }
) {
    try {
        const { workspaceId, feedbackId } = params;

        // 1. RBAC and Auth - Workspace scoping & Authorization check
        // Assuming OWNER, ADMIN, MEMBER can update status; VIEWER might not be able to,
        // but requireWorkspaceAccess defaults to checking if they belong to workspace.
        // The prompt says "Inspect the current RBAC design before deciding the allowed roles. Do NOT weaken existing authorization."
        // We will pass the default allowedRoles (OWNER, ADMIN, MEMBER, VIEWER).
        // Since we are adding status changing, if we wanted only OWNER/ADMIN/MEMBER, we explicitly declare it.
        const context = await requireWorkspaceAccess(workspaceId, ["OWNER", "ADMIN", "MEMBER"]);

        if (!context) {
            return NextResponse.json({ error: "Unauthorized or insufficient permissions" }, { status: 403 });
        }

        const updates = await request.json();

        if (!updates.status) {
            return NextResponse.json({ error: "Missing required 'status' field in payload" }, { status: 400 });
        }

        const newStatusStr = updates.status.toUpperCase();
        const validStatuses = Object.values(FeedbackStatus) as string[];

        if (!validStatuses.includes(newStatusStr)) {
            return NextResponse.json({ error: `Invalid status. Allowed values: ${validStatuses.join(", ")}` }, { status: 400 });
        }

        // 2. Safely Update Database with workspaceId condition (Isolation Check)
        // We use prisma.updateMany because update() uniquely finds by ID, and if we add workspaceId
        // it expects a unique composite key, which we don't have. updateMany is standard for scoped updates.
        const result = await prisma.feedback.updateMany({
            where: {
                id: feedbackId,
                workspaceId: context.workspaceId,
            },
            data: {
                status: newStatusStr as FeedbackStatus,
            },
        });

        if (result.count === 0) {
            return NextResponse.json({ error: "Feedback not found or access denied" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            summary: "Status updated successfully",
        }, { status: 200 });

    } catch (error) {
        console.error("PATCH Feedback Status Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
