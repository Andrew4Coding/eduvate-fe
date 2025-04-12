/*
  Warnings:

  - A unique constraint covering the columns `[courseItemId]` on the table `Material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseItemId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseItemId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Material_courseItemId_key" ON "Material"("courseItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_courseItemId_key" ON "Quiz"("courseItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_courseItemId_key" ON "Task"("courseItemId");
