import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/en/login",
    error: "/en/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Return the user with ID and role explicitly
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        // Set user properties from token to session
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string || "user",
        };
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // If we have a user (during sign in), add their ID and role to the token
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }

      // Keep account info for provider handling
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect:", { url, baseUrl });

      // If it's a relative URL, keep it relative (don't prepend baseUrl)
      if (url.startsWith('/')) {
        return url;
      }

      // If it's an absolute URL but matches the current base, use it
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default to base URL
      return baseUrl;
    },
  },
};