import { PrismaClient, Role, FeedbackSource, Sentiment } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting execution of database seeds...')

    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create an initial user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@projectloop.com' },
        update: {},
        create: {
            email: 'admin@projectloop.com',
            name: 'Loop Administrator',
            password: hashedPassword,
        },
    })

    // Create an initial workspace
    const workspace = await prisma.workspace.upsert({
        where: { slug: 'acme-corp' },
        update: {},
        create: {
            name: 'Acme Corporation Test',
            slug: 'acme-corp',
            members: {
                create: {
                    userId: admin.id,
                    role: Role.OWNER
                }
            }
        }
    })

    // Insert robust, realistic demonstration categories
    const cat1 = await prisma.feedbackCategory.upsert({
        where: { workspaceId_name: { workspaceId: workspace.id, name: 'UI/UX DESIGN' } },
        update: {},
        create: { name: 'UI/UX DESIGN', workspaceId: workspace.id }
    })
    const cat2 = await prisma.feedbackCategory.upsert({
        where: { workspaceId_name: { workspaceId: workspace.id, name: 'PERFORMANCE' } },
        update: {},
        create: { name: 'PERFORMANCE', workspaceId: workspace.id }
    })
    const cat3 = await prisma.feedbackCategory.upsert({
        where: { workspaceId_name: { workspaceId: workspace.id, name: 'CUSTOMER SUPPORT' } },
        update: {},
        create: { name: 'CUSTOMER SUPPORT', workspaceId: workspace.id }
    })

    const demoFeedbacks = [
        { title: "Saved our entire workflow", content: 'This product is absolutely amazing, it saved our team 10 hours a week analyzing incoming logs!', sentiment: Sentiment.POSITIVE, source: FeedbackSource.MANUAL, categoryId: cat1.id },
        { title: "Dashboard takes 10 seconds to load", content: 'The new dashboard is incredibly slow. Every time I open the analytics tab, it hangs the browser.', sentiment: Sentiment.NEGATIVE, source: FeedbackSource.API, categoryId: cat2.id },
        { title: "Confusing navigation", content: 'I can never find the settings page. Why is it hidden under the profile dropdown?', sentiment: Sentiment.NEGATIVE, source: FeedbackSource.WIDGET, categoryId: cat1.id },
        { title: "Support helped immediately", content: 'Had an issue with billing, but Alex from support fixed it in 5 minutes! Great job.', sentiment: Sentiment.POSITIVE, source: FeedbackSource.EMAIL, categoryId: cat3.id }
    ]

    for (const fb of demoFeedbacks) {
        let existing = await prisma.feedback.findFirst({
            where: { workspaceId: workspace.id, title: fb.title }
        })

        if (!existing) {
            existing = await prisma.feedback.create({
                data: {
                    ...fb,
                    workspaceId: workspace.id,
                }
            })
            // Mock realistic AI Insights deterministically
            await prisma.aIInsight.create({
                data: {
                    feedbackId: existing.id,
                    summary: `AI generated summary for ${fb.title}`,
                    intent: 'General Feedback',
                    confidence: 0.95
                }
            })
        }
    }

    console.log('Seed configuration populated successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
