import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",

  // Admin-only email/password auth — no social providers
  emailAndPassword: {
    enabled: true,
    // Prevent new signups; only the seeded admin can sign in
    disableSignUp: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 8, // 8 hours
    },
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  ],
});
