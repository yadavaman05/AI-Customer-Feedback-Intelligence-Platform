import { PrismaClient, Role, FeedbackSource, Sentiment } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting execution of database seeds...')

    // Create an initial user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@projectloop.com' },
        update: {},
        create: {
            email: 'admin@projectloop.com',
            name: 'Loop Administrator',
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

    // Insert a test feedback node
    await prisma.feedback.create({
        data: {
            title: "Saved our entire workflow",
            content: 'This product is absolutely amazing, it saved our team 10 hours a week analyzing incoming logs!',
            sentiment: Sentiment.POSITIVE,
            source: FeedbackSource.MANUAL,
            workspaceId: workspace.id,
        }
    })

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
