import "next-auth"
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

// Extend the built-in session types
declare module "next-auth" {
  /**
   * Extend the User interface with your custom fields
   */
  interface User extends DefaultUser {
    role?: string
  }

  /**
   * Extend the Session interface
   */
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession["user"]
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role?: string
  }
}