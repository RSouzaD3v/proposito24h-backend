/*
  Warnings:

  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InsightsRead" DROP CONSTRAINT "InsightsRead_readingSheduleId_fkey";

-- DropForeignKey
ALTER TABLE "InsightsRead" DROP CONSTRAINT "InsightsRead_userId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ReadPlan" DROP CONSTRAINT "ReadPlan_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingSchedule" DROP CONSTRAINT "ReadingSchedule_readPlanId_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "quizId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadPlan" ADD CONSTRAINT "ReadPlan_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingSchedule" ADD CONSTRAINT "ReadingSchedule_readPlanId_fkey" FOREIGN KEY ("readPlanId") REFERENCES "ReadPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightsRead" ADD CONSTRAINT "InsightsRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightsRead" ADD CONSTRAINT "InsightsRead_readingSheduleId_fkey" FOREIGN KEY ("readingSheduleId") REFERENCES "ReadingSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
