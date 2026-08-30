import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function computeWorkspaceStats(workspaceId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.FeedbackWhereInput = { workspaceId };
    if (startDate && endDate) {
        where.createdAt = { gte: startDate, lt: endDate };
    }

    const feedbacks = await prisma.feedback.findMany({
        where,
        select: {
            id: true,
            source: true,
            sentiment: true,
            status: true,
            categoryId: true
        }
    });

    const totalCount = feedbacks.length;
    const bySource = feedbacks.reduce((acc: Record<string, number>, f) => {
        acc[f.source] = (acc[f.source] || 0) + 1;
        return acc;
    }, {});

    const bySentiment = feedbacks.reduce((acc: Record<string, number>, f) => {
        acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
        return acc;
    }, {});

    const byStatus = feedbacks.reduce((acc: Record<string, number>, f) => {
        acc[f.status] = (acc[f.status] || 0) + 1;
        return acc;
    }, {});

    // Map Categories
    const categories = await prisma.feedbackCategory.findMany({
        where: { workspaceId }
    });
    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    const byCategory = feedbacks.reduce((acc: Record<string, number>, f) => {
        if (f.categoryId) {
            const name = categoryMap.get(f.categoryId);
            if (name) {
                acc[name] = (acc[name] || 0) + 1;
            }
        }
        return acc;
    }, {});

    const topThemes = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme, count]) => ({ theme, count }));

    return {
        totalFeedback: totalCount,
        channels: bySource,
        sentiments: bySentiment,
        statuses: byStatus,
        topThemes
    };
}
