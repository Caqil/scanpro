// app/api/_internal/validate-key/route.ts
import { NextResponse } from "next/server";
import { ApiKeyService } from "@/src/services/api-key-service";

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey) {
            return NextResponse.json({ valid: false, reason: "missing-key" }, { status: 400 });
        }

        // Validate the API key using the service
        const key = await ApiKeyService.validateApiKey(apiKey);

        if (!key) {
            return NextResponse.json({ valid: false, reason: "invalid-key" }, { status: 200 });
        }

        // Return the key details if valid
        return NextResponse.json({
            valid: true,
            userId: key.userId,
            keyId: key.id,
            permissions: key.permissions
        }, { status: 200 });
    } catch (error) {
        console.error("Error validating API key:", error);
        return NextResponse.json({
            valid: false,
            reason: "server-error",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}