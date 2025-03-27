import "next-auth"

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }

    // If you're using JWT strategy, you might also want to extend the JWT type
    interface JWT {
        id: string
    }
}

