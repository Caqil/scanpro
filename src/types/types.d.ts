// types.d.ts
import "next-auth";

// Extend the built-in session types to include user id
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

// Extend the built-in user types to include id
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}