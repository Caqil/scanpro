import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // Configure JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Configure providers
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
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            subscription: true
          }
        });

        // Check if user exists and password is correct
        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user object without sensitive information
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          image: user.image
        };
      }
    })
  ],

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";


      }

      // If user data changes, update token
      if (user && account) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: true }
        });

        if (updatedUser) {
          token.name = updatedUser.name;
          token.email = updatedUser.email;
          token.picture = updatedUser.image;
          token.role = updatedUser.role;
          token.subscription = updatedUser.subscription;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;


      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle callback URL correctly
      // Make sure URL is a relative path or from allowed domain
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  },

  // Pages
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login?error=true",
  },

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
};