/*
  Warnings:

  - Added the required column `expiryDate` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;
