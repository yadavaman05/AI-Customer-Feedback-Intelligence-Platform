import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Attempt a simple query to verify the database connection
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Database connection failed:', errorMessage);

        return NextResponse.json({
            status: 'unhealthy',
            database: 'disconnected',
            error: errorMessage
        }, { status: 503 });
    }
}
