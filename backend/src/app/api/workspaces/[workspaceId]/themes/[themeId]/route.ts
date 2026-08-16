import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string, themeId: string } }
) {
    try {
        const { workspaceId, themeId } = params;
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const theme = await prisma.feedbackCategory.findFirst({
            where: {
                id: themeId,
                workspaceId: context.workspaceId
            },
            include: {
                _count: {
                    select: { feedbacks: true }
                }
            }
        });

        if (!theme) {
            return NextResponse.json({ error: "Theme not found in this workspace" }, { status: 404 });
        }

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        let pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
        if (isNaN(pageSize) || pageSize < 1) pageSize = 20;
        const take = Math.min(pageSize, 100);
        const skip = Math.max(page - 1, 0) * take;

        const where = {
            workspaceId: context.workspaceId,
            categoryId: theme.id
        };

        const [feedbacks, total] = await Promise.all([
            prisma.feedback.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take
            }),
            prisma.feedback.count({ where })
        ]);

        const totalPages = Math.ceil(total / take);

        return NextResponse.json({
            theme: {
                id: theme.id,
                name: theme.name,
                count: theme._count.feedbacks
            },
            feedbacks: {
                items: feedbacks,
                pagination: {
                    page,
                    pageSize: take,
                    total,
                    totalPages
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error("GET Theme Drilldown Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
