import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { FeedbackSource, Sentiment, FeedbackStatus } from "@prisma/client";
import { classifyFeedback } from "@/lib/ai/claude";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";
import { generateEmbedding, storeFeedbackEmbedding } from "@/lib/ai/embeddings";

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const context = await requireWorkspaceAccess(params.workspaceId);
        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);

        // Pagination
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        let pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
        if (isNaN(pageSize) || pageSize < 1) pageSize = 20;
        const take = Math.min(pageSize, 100); // Prevent unlimited query size
        const skip = Math.max(page - 1, 0) * take;

        // Filters (Day 8 & 9)
        const search = url.searchParams.get("search");
        const channel = url.searchParams.get("channel");
        const sentiment = url.searchParams.get("sentiment");
        const theme = url.searchParams.get("theme");
        const statusStr = url.searchParams.get("status");
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");

        // Base where: absolute workspace boundary (CRITICAL: NEVER replace)
        const where: any = {
            workspaceId: context.workspaceId,
        };

        if (search) {
            where.content = { contains: search, mode: "insensitive" };
        }
        if (channel) {
            // Validate channel enum to prevent bad queries
            const validChannels = Object.values(FeedbackSource) as string[];
            if (validChannels.includes(channel.toUpperCase())) {
                where.source = channel.toUpperCase() as FeedbackSource;
            } else {
                return NextResponse.json({ error: "Invalid channel filter" }, { status: 400 });
            }
        }
        if (sentiment) {
            const validSentiments = Object.values(Sentiment) as string[];
            if (validSentiments.includes(sentiment.toUpperCase())) {
                where.sentiment = sentiment.toUpperCase() as Sentiment;
            } else {
                return NextResponse.json({ error: "Invalid sentiment filter" }, { status: 400 });
            }
        }
        if (theme) {
            // Reuse existing category relationship for theme
            where.category = {
                name: { contains: theme, mode: "insensitive" }
            };
        }
        if (statusStr) {
            const validStatuses = Object.values(FeedbackStatus) as string[];
            if (validStatuses.includes(statusStr.toUpperCase())) {
                where.status = statusStr.toUpperCase() as FeedbackStatus;
            } else {
                return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
            }
        }
        if (from || to) {
            where.createdAt = {};
            if (from) {
                const fd = new Date(from);
                if (!isNaN(fd.getTime())) where.createdAt.gte = fd;
            }
            if (to) {
                const td = new Date(to);
                if (!isNaN(td.getTime())) where.createdAt.lte = td;
            }
        }

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
            data: feedbacks,
            pagination: {
                page,
                pageSize: take,
                total,
                totalPages
            }
        }, { status: 200 });

    } catch (error) {
        console.error("GET Feedbacks Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;
        const context = await requireWorkspaceAccess(workspaceId);

        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const unvalidatedBody = await request.json();

        if (!unvalidatedBody || typeof unvalidatedBody.content !== 'string' || unvalidatedBody.content.trim() === "") {
            return NextResponse.json({ error: "Invalid Request: 'content' is strictly required and cannot be empty" }, { status: 400 });
        }

        const newFeedback = await prisma.feedback.create({
            data: {
                content: unvalidatedBody.content.trim(),
                workspaceId: context.workspaceId,
                source: unvalidatedBody.source || 'MANUAL',
                title: unvalidatedBody.title || null,
            }
        });

        // Day 12 Classification integration safely
        const classification = await classifyFeedback(newFeedback.content);
        if (classification) {
            await storeFeedbackClassification(newFeedback.id, context.workspaceId, classification);
        }

        // Day 15 Embedding securely
        try {
            const embedding = await generateEmbedding(newFeedback.content);
            await storeFeedbackEmbedding(newFeedback.id, embedding);
        } catch (e) {
            console.error("Embedding generation skipped/failed:", e);
        }

        return NextResponse.json({ feedback: newFeedback }, { status: 201 });
    } catch (error) {
        console.error("POST Feedback Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
