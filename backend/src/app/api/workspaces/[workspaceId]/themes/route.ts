import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const categories = await prisma.feedbackCategory.findMany({
            where: { workspaceId: context.workspaceId },
            include: {
                _count: {
                    select: { feedbacks: true }
                }
            },
            orderBy: {
                feedbacks: {
                    _count: 'desc'
                }
            }
        });

        const themes = categories.map(c => ({
            id: c.id,
            name: c.name,
            count: c._count.feedbacks
        }));

        return NextResponse.json(themes, { status: 200 });

    } catch (error) {
        console.error("GET Themes Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
