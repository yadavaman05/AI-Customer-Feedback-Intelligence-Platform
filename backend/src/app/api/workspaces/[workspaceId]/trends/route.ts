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

        const url = new URL(request.url);

        // 1. Date Range Handling
        let endDate = url.searchParams.get("endDate") ? new Date(url.searchParams.get("endDate")!) : new Date();
        if (isNaN(endDate.getTime())) endDate = new Date();

        let startDate = url.searchParams.get("startDate") ? new Date(url.searchParams.get("startDate")!) : new Date();
        if (!url.searchParams.get("startDate") || isNaN(startDate.getTime())) {
            // Default to trailing 7 days
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);
        }

        if (endDate < startDate) {
            return NextResponse.json({ error: "Invalid date range: endDate before startDate" }, { status: 400 });
        }

        // 2. Previous Period Calculation
        const durationMs = endDate.getTime() - startDate.getTime();
        const prevEndDate = new Date(startDate);
        const prevStartDate = new Date(startDate.getTime() - durationMs);

        // Fetch categories to safely map names
        const allCategories = await prisma.feedbackCategory.findMany({
            where: { workspaceId: context.workspaceId }
        });
        const categoryMap = new Map(allCategories.map(c => [c.id, c.name]));

        // Fetch current period data - select only what we need to safely bucket in JS
        const currentData = await prisma.feedback.findMany({
            where: {
                workspaceId: context.workspaceId,
                categoryId: { not: null },
                createdAt: { gte: startDate, lt: endDate }
            },
            select: { categoryId: true, createdAt: true }
        });

        // Fetch previous period grouped counts directly via prisma (we only need the raw totals for spike detection)
        const previousData = await prisma.feedback.groupBy({
            by: ['categoryId'],
            where: {
                workspaceId: context.workspaceId,
                categoryId: { not: null },
                createdAt: { gte: prevStartDate, lt: prevEndDate }
            },
            _count: { _all: true }
        });

        const prevCountMap = new Map(previousData.map(d => [d.categoryId as string, d._count._all]));

        const themeBuckets: Record<string, Record<string, number>> = {};
        const currentCountMap: Record<string, number> = {};

        // 3. Time Bucketing (Daily)
        for (const fb of currentData) {
            const cid = fb.categoryId as string;
            const dateKey = fb.createdAt.toISOString().split('T')[0];

            if (!themeBuckets[cid]) themeBuckets[cid] = {};
            themeBuckets[cid][dateKey] = (themeBuckets[cid][dateKey] || 0) + 1;
            currentCountMap[cid] = (currentCountMap[cid] || 0) + 1;
        }

        interface TrendTheme {
            themeId: string;
            theme: string;
            currentVolume: number;
            previousVolume: number;
            change: number;
            changePercent: number;
            isSpike: boolean;
            data: { date: string; count: number }[];
        }

        const responseThemes: TrendTheme[] = [];
        categoryMap.forEach((name, cid) => {
            const currentVolume = currentCountMap[cid] || 0;
            const previousVolume = prevCountMap.get(cid) || 0;

            if (currentVolume === 0 && previousVolume === 0) return;

            const change = currentVolume - previousVolume;
            // Prevent infinity or NaN: if previous is 0 and current is active, assume 100% relative base (or max deterministic handle).
            let changePercent = 0;
            if (previousVolume > 0) {
                changePercent = Math.round((change / previousVolume) * 100);
            } else if (currentVolume > 0) {
                changePercent = 100;
            }

            // Spike detection rule: previous > 0 AND >= 50% growth
            const isSpike = (previousVolume > 0 && changePercent >= 50);

            const buckets = themeBuckets[cid] || {};
            const dataSeries = Object.keys(buckets)
                .map((date) => ({ date, count: buckets[date] }))
                .sort((a, b) => a.date.localeCompare(b.date));

            responseThemes.push({
                themeId: cid,
                theme: name,
                currentVolume,
                previousVolume,
                change,
                changePercent,
                isSpike,
                data: dataSeries
            });
        });

        return NextResponse.json({
            period: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            },
            previousPeriod: {
                startDate: prevStartDate.toISOString(),
                endDate: prevEndDate.toISOString()
            },
            themes: responseThemes
        }, { status: 200 });

    } catch (error) {
        console.error("GET Trends Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
