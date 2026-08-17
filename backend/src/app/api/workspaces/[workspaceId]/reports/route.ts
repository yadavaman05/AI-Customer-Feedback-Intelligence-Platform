import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { computeWorkspaceStats } from "@/lib/reports";
import { generateVoCNarrative } from "@/lib/ai/claude";

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { title, startDate, endDate } = body;

        let start, end;
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
                return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
            }
        }

        // 1. Pre-compute Statistics securely
        const stats = await computeWorkspaceStats(context.workspaceId, start, end);

        // 2. Generate VoC Narrative
        let narrative = "Failed to generate AI narrative.";
        try {
            narrative = await generateVoCNarrative(stats);
        } catch (e) {
            console.error("AI Narrative Generation skipped:", e);
        }

        const config = {
            stats,
            narrative,
            period: { startDate, endDate }
        };

        // 3. Save Report
        const report = await prisma.report.create({
            data: {
                title: title || `Voice of Customer Report - ${new Date().toISOString().split('T')[0]}`,
                workspaceId: context.workspaceId,
                config,
                generatedById: context.userId,
            }
        });

        return NextResponse.json(report, { status: 201 });

    } catch (error) {
        console.error("Create Report Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const pageSize = Math.min(parseInt(url.searchParams.get("pageSize") || "20", 10), 100);
        const skip = Math.max(page - 1, 0) * pageSize;

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where: { workspaceId: context.workspaceId },
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize
            }),
            prisma.report.count({ where: { workspaceId: context.workspaceId } })
        ]);

        return NextResponse.json({
            items: reports,
            pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
        }, { status: 200 });

    } catch (error) {
        console.error("List Reports Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
