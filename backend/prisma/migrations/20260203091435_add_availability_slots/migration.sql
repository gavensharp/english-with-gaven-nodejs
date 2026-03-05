/*
  Warnings:

  - Made the column `student_id` on table `lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `lesson_student_id_fkey`;

-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `availability_slot_id` INTEGER NULL,
    MODIFY `title` VARCHAR(255) NOT NULL DEFAULT 'English Lesson',
    MODIFY `status` VARCHAR(20) NOT NULL DEFAULT 'booked',
    MODIFY `student_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `availability_slot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `availability_slot_start_time_end_time_idx`(`start_time`, `end_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `lesson_availability_slot_id_idx` ON `lesson`(`availability_slot_id`);

-- AddForeignKey
ALTER TABLE `lesson` ADD CONSTRAINT `lesson_availability_slot_id_fkey` FOREIGN KEY (`availability_slot_id`) REFERENCES `availability_slot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson` ADD CONSTRAINT `lesson_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
