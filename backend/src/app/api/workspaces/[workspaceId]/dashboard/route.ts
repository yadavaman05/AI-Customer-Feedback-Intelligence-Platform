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

        // Real chronological bucketing for last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const currentData = await prisma.feedback.findMany({
            where: {
                workspaceId: context.workspaceId,
                createdAt: { gte: startDate, lt: endDate }
            },
            select: { createdAt: true }
        });

        const buckets: Record<string, number> = {};
        for (const f of currentData) {
            const dateKey = f.createdAt.toISOString().split('T')[0];
            buckets[dateKey] = (buckets[dateKey] || 0) + 1;
        }

        const volumeTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            volumeTrend.push({ date: dateStr, count: buckets[dateStr] || 0 });
        }

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
                trend: volumeTrend
            },
            sentiment,
            topThemes
        }, { status: 200 });

    } catch (error) {
        console.error("GET Dashboard Analytics Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
