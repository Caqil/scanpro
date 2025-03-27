// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Validation schema
const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export async function POST(req: NextRequest) {
    try {
        // Parse JSON with error handling
        let body;
        try {
            body = await req.json();
        } catch (error) {
            console.error('Error parsing JSON body:', error);
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        // Validate request body
        const validationResult = userSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = validationResult.data;

        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "A user with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Return success response (excluding the password)
        return NextResponse.json(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                message: "User registered successfully"
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);

        // Ensure we always return a proper JSON response even for unexpected errors
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to register user. Please try again later." },
            { status: 500 }
        );
    }
}