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
