-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
