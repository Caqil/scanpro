import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ApiKeyService } from "@/src/services/api-key-service"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ keyId: string }> }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Await the params promise to get the actual params object
        const resolvedParams = await params
        const keyId = resolvedParams.keyId

        const deleted = await ApiKeyService.deleteApiKey(keyId, session.user.id)

        if (!deleted) {
            return NextResponse.json({ error: "API key not found or not owned by this user" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting API key:", error)
        return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ keyId: string }> }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Await the params promise to get the actual params object
        const resolvedParams = await params
        const keyId = resolvedParams.keyId

        const body = await request.json()

        if (body.isEnabled === false) {
            const disabled = await ApiKeyService.disableApiKey(keyId, session.user.id)

            if (!disabled) {
                return NextResponse.json({ error: "API key not found or not owned by this user" }, { status: 404 })
            }

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid update operation" }, { status: 400 })
    } catch (error) {
        console.error("Error updating API key:", error)
        return NextResponse.json({ error: "Failed to update API key" }, { status: 500 })
    }
}

