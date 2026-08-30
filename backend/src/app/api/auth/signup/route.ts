import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and a default workspace
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                }
            });

            // Create default workspace for the user
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-workspace";
            const workspace = await tx.workspace.create({
                data: {
                    name: `${name}'s Workspace`,
                    slug,
                    members: {
                        create: {
                            userId: user.id,
                            role: Role.OWNER
                        }
                    }
                }
            });

            return { user, workspace };
        });

        return NextResponse.json({
            success: true,
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
            },
            workspace: {
                id: result.workspace.id,
                name: result.workspace.name,
                slug: result.workspace.slug,
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Signup API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
