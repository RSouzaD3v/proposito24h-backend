-- AlterTable
ALTER TABLE "ProofPurchase" ADD COLUMN     "methodPayment" TEXT DEFAULT 'Dinheiro';

-- CreateTable
CREATE TABLE "ReadPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingSchedule" (
    "id" TEXT NOT NULL,
    "titleDay" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "readPlanId" TEXT NOT NULL,

    CONSTRAINT "ReadingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightsRead" (
    "id" TEXT NOT NULL,
    "isReaded" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "readingSheduleId" TEXT NOT NULL,

    CONSTRAINT "InsightsRead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReadPlan" ADD CONSTRAINT "ReadPlan_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingSchedule" ADD CONSTRAINT "ReadingSchedule_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingSchedule" ADD CONSTRAINT "ReadingSchedule_readPlanId_fkey" FOREIGN KEY ("readPlanId") REFERENCES "ReadPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightsRead" ADD CONSTRAINT "InsightsRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightsRead" ADD CONSTRAINT "InsightsRead_readingSheduleId_fkey" FOREIGN KEY ("readingSheduleId") REFERENCES "ReadingSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
