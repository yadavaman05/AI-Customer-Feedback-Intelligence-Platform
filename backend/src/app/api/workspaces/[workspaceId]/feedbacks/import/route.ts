import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import Papa from "papaparse";
import { FeedbackSource } from "@prisma/client";
import { classifyFeedback } from "@/lib/ai/claude";
import { storeFeedbackClassification } from "@/lib/ai/store-classification";
import { generateEmbedding, storeFeedbackEmbedding } from "@/lib/ai/embeddings";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;

        // 1. RBAC and Auth Check - verify workspace access
        const context = await requireWorkspaceAccess(workspaceId);
        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Or 403, using 401 based on day 5 route
        }

        // 2. Parse FormData
        let formData: FormData;
        try {
            formData = await request.formData();
        } catch (e) {
            return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
        }

        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 3. File Validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
        }

        const fileContent = await file.text();
        if (!fileContent.trim()) {
            return NextResponse.json({ error: "File is empty" }, { status: 400 });
        }

        // 4. Parse CSV
        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        });

        if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
            return NextResponse.json({ error: "Malformed CSV structure" }, { status: 400 });
        }

        const rows = parseResult.data as Record<string, string>[];

        if (rows.length === 0) {
            return NextResponse.json({ error: "No data rows found in CSV" }, { status: 400 });
        }

        // 5. Check if required headers exist
        const headers = parseResult.meta.fields || [];
        if (!headers.includes("content")) {
            return NextResponse.json({ error: "Required column 'content' is missing" }, { status: 400 });
        }

        // 6. Row Validation
        const validRows: { content: string; title: string | null; source: FeedbackSource; workspaceId: string }[] = [];
        const failures: { row: number; reason: string }[] = [];

        const validSources = Object.values(FeedbackSource);

        rows.forEach((row, index) => {
            const rowNumber = index + 2; // +1 for 0-index, +1 for header row

            const content = row.content?.trim();
            const sourceRaw = row.source?.trim()?.toUpperCase();
            const title = row.title?.trim();

            if (!content) {
                failures.push({ row: rowNumber, reason: "Feedback content is required" });
                return;
            }

            let source: FeedbackSource = FeedbackSource.CSV;
            if (sourceRaw) {
                if (validSources.includes(sourceRaw as unknown as FeedbackSource)) {
                    source = sourceRaw as FeedbackSource;
                } else {
                    failures.push({ row: rowNumber, reason: `Invalid source: ${sourceRaw}` });
                    return;
                }
            }

            validRows.push({
                content,
                title: title || null,
                source,
                workspaceId: context.workspaceId,
            });
        });

        // 7. Bulk Insertion securely using context.workspaceId
        let imported = 0;
        let classified = 0;
        let classificationFailures = 0;

        if (validRows.length > 0) {
            for (const row of validRows) {
                try {
                    const created = await prisma.feedback.create({
                        data: row
                    });
                    imported++;

                    // Classify
                    const classification = await classifyFeedback(created.content);
                    if (classification) {
                        const stored = await storeFeedbackClassification(created.id, context.workspaceId, classification);
                        if (stored) classified++;
                        else classificationFailures++;
                    } else {
                        classificationFailures++;
                    }

                    // Embed
                    try {
                        const embedding = await generateEmbedding(created.content);
                        await storeFeedbackEmbedding(created.id, embedding);
                    } catch (e) {
                        // safe skip
                    }
                } catch (error) {
                    failures.push({ row: 0, reason: "Database error during row creation" });
                }
            }
        }

        // 8. Return Validation Summary
        return NextResponse.json({
            success: true,
            summary: {
                totalRows: rows.length,
                imported,
                classified,
                classificationFailures,
                failed: failures.length,
            },
            failures
        }, { status: 200 });

    } catch (error) {
        console.error("POST Feedback Import Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
