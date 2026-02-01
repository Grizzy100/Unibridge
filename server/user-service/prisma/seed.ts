//user-service/prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import 'dotenv/config';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log("Starting admin seed...");
  console.log("ENV EMAIL:", process.env.ADMIN_EMAIL);
  console.log("ENV PASSWORD:", process.env.ADMIN_PASSWORD);
  console.log("ENV DATABASE_URL:", process.env.DATABASE_URL);
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(rawPassword, 12);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: { email, password: hashed, role: Role.ADMIN },
    });
    console.log("Admin user created:", email);
  } else {
    console.log("Admin already exists");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });