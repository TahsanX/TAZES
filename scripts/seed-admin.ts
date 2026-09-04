/**
 * Creates or updates the admin account from ADMIN_USERNAME / ADMIN_PASSWORD in .env.
 * The plaintext password is only a bootstrap value — only its bcrypt hash is
 * ever written to the database.
 *
 * Usage: npx tsx scripts/seed-admin.ts
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`Admin account ready: ${username}`);
  console.log("Password hash stored in the database (not in .env).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
