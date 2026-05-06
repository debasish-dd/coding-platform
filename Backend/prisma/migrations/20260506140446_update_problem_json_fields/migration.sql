/*
  Warnings:

  - You are about to drop the column `editorial` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `hints` on the `Problem` table. All the data in the column will be lost.
  - Changed the type of `difficulty` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `constraints` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "editorial",
DROP COLUMN "hints",
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" TEXT NOT NULL,
DROP COLUMN "constraints",
ADD COLUMN     "constraints" JSONB NOT NULL;
