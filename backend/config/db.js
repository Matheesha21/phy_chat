
import { PrismaClient } from '@prisma/client';

// Single shared Prisma client instance for the whole app.
export const prisma = new PrismaClient();

export async function connectDB() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env.');
  }

  await prisma.$connect();
  console.log('Connected to MySQL via Prisma');
}

export async function disconnectDB() {
  await prisma.$disconnect();
}