import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string, reportId: string } }
) {
    try {
        const { workspaceId, reportId } = params;
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Retrieve securely ensuring exact workspace scoping isolating cross-tenant leaks.
        const report = await prisma.report.findFirst({
            where: { id: reportId, workspaceId: context.workspaceId },
            include: { generatedBy: { select: { name: true, email: true } } }
        });

        if (!report) return NextResponse.json({ error: "Report not found or access denied" }, { status: 404 });

        return NextResponse.json(report, { status: 200 });

    } catch (error) {
        console.error("Get Report Detail Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
