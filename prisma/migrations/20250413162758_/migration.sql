-- DropForeignKey
ALTER TABLE "CourseSection" DROP CONSTRAINT "CourseSection_courseId_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "closeDate" TIMESTAMP(3),
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "openDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
