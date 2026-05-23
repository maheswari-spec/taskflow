/*
  Warnings:

  - A unique constraint covering the columns `[ticketKey]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `ticketKey` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'TASK';

-- CreateIndex
CREATE UNIQUE INDEX `Task_ticketKey_key` ON `Task`(`ticketKey`);
