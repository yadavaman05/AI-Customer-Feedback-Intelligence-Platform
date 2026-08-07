import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        // RBAC: Any valid role (Owner, Admin, Member, Viewer) can read feedback globally within their tenant scope
        const context = await requireWorkspaceAccess(params.workspaceId);

        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // MANDATORY ISOLATION SCOPE:
        // Regardless of query parameters or user intent, the backend statically scopes response sets by the validated tenant ID.
        const feedbacks = await prisma.feedback.findMany({
            where: {
                workspaceId: context.workspaceId, // Absolute boundary
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ feedbacks }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;

        // RBAC: Assert the user natively belongs to the target tenant scope
        const context = await requireWorkspaceAccess(workspaceId);

        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const unvalidatedBody = await request.json();

        // Explicit Validation Loop
        if (!unvalidatedBody || typeof unvalidatedBody.content !== 'string' || unvalidatedBody.content.trim() === "") {
            return NextResponse.json({ error: "Invalid Request: 'content' is strictly required and cannot be empty" }, { status: 400 });
        }

        // MANDATORY ISOLATION SCOPE:
        // Creation overrides arbitrary inputs and tightly couples database insertion to the secure session extraction identifier.
        // Strictly NO AI pipelines are triggered here as per Day 5 directives.
        const newFeedback = await prisma.feedback.create({
            data: {
                content: unvalidatedBody.content.trim(),
                workspaceId: context.workspaceId,
                source: unvalidatedBody.source || 'MANUAL',
                title: unvalidatedBody.title || null,
                // All other attributes adopt Prisma schema defaults natively (UNANALYZED sentiment, etc.)
            }
        });

        return NextResponse.json({ feedback: newFeedback }, { status: 201 });
    } catch (error) {
        console.error("POST Feedback Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
