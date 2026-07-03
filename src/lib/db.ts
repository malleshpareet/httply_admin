import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var adminPrisma: PrismaClient | undefined;
}

let db: PrismaClient;

if (globalThis.adminPrisma) {
  db = globalThis.adminPrisma;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  db = new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === "development") {
  globalThis.adminPrisma = db;
}

export default db;
