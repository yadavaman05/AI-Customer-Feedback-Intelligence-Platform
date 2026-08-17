import prisma from "@/lib/prisma";
import { ClassificationResult } from "./claude";

export async function storeFeedbackClassification(
    feedbackId: string,
    workspaceId: string,
    classification: ClassificationResult
) {
    try {
        const themeName = classification.theme.toUpperCase().trim();

        let category = await prisma.feedbackCategory.findUnique({
            where: {
                workspaceId_name: {
                    workspaceId,
                    name: themeName
                }
            }
        });

        if (!category) {
            category = await prisma.feedbackCategory.create({
                data: {
                    name: themeName,
                    workspaceId: workspaceId
                }
            });
        }

        await prisma.$transaction([
            prisma.feedback.update({
                where: { id: feedbackId },
                data: {
                    sentiment: classification.sentiment,
                    categoryId: category.id
                }
            }),
            prisma.aIInsight.upsert({
                where: { feedbackId },
                update: {
                    summary: classification.summary,
                    generatedAt: new Date()
                },
                create: {
                    feedbackId,
                    summary: classification.summary,
                }
            })
        ]);

        return true;
    } catch (error) {
        console.error(`Failed to store classification for feedback ${feedbackId}:`, error);
        return false;
    }
}
