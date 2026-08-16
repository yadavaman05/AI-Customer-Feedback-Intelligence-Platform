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

        // 1. Feedback Volume (Total Count)
        const totalVolume = await prisma.feedback.count({
            where: { workspaceId: context.workspaceId }
        });

        // Generate placeholder trend data since building a complex time-series group-by
        // without an explicit SQL raw query or pg-specific function is tricky in Prisma.
        // Dashboard can use this for Recharts line/area charts.
        const today = new Date();
        const volumeTrend = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i));
            return {
                date: d.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 10) // Placeholder per requirements
            };
        });

        // 2. Sentiment Distribution
        const sentimentGrouping = await prisma.feedback.groupBy({
            by: ['sentiment'],
            where: { workspaceId: context.workspaceId },
            _count: { _all: true }
        });

        const sentiment = sentimentGrouping.map(g => ({
            name: g.sentiment,
            value: g._count._all
        }));

        // 3. Top Themes
        const themeGrouping = await prisma.feedback.groupBy({
            by: ['categoryId'],
            where: {
                workspaceId: context.workspaceId,
                categoryId: { not: null }
            },
            _count: { _all: true },
            orderBy: { _count: { categoryId: 'desc' } },
            take: 5,
        });

        const categoryIds = themeGrouping.map(g => g.categoryId as string);
        const categories = await prisma.feedbackCategory.findMany({
            where: { id: { in: categoryIds } }
        });

        const categoryMap = new Map(categories.map(c => [c.id, c.name]));

        const topThemes = themeGrouping.map(g => ({
            name: categoryMap.get(g.categoryId as string) || "Unknown",
            value: g._count._all
        }));

        return NextResponse.json({
            volume: {
                total: totalVolume,
                trend: volumeTrend // Placeholder, per requirement "placeholder data allowed"
            },
            sentiment,
            topThemes
        }, { status: 200 });

    } catch (error) {
        console.error("GET Dashboard Analytics Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
