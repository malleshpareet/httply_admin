/**
 * Seed script — creates the admin user in the shared Neon DB.
 * Run once: npx ts-node --skip-project scripts/seed-admin.ts
 */
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

async function main() {
  console.log("🔧 Seeding admin user...");
  console.log(`   Email: ${ADMIN_EMAIL}`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });

  const auth = betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
    emailAndPassword: { enabled: true, disableSignUp: false },
  });

  try {
    const existing = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existing) {
      console.log("✅ Admin user already exists — skipping creation.");
    } else {
      const result = await auth.api.signUpEmail({
        body: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: "Httply Admin",
        },
      });

      if (result?.user) {
        console.log(`✅ Admin user created: ${result.user.email}`);
      } else {
        console.error("❌ Failed to create admin user.", result);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  } finally {
    await db.$disconnect();
    await pool.end();
  }
}

main();
