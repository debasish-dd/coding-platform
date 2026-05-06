/*
  Warnings:

  - Changed the type of `difficulty` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "editorial" TEXT,
ADD COLUMN     "hints" TEXT,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ALTER COLUMN "constraints" SET DATA TYPE TEXT;
