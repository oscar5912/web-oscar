/*
  Warnings:

  - You are about to drop the column `NombreArea` on the `Colaborador` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Colaborador` DROP COLUMN `NombreArea`;

-- AddForeignKey
ALTER TABLE `Colaborador` ADD CONSTRAINT `Colaborador_IdArea_fkey` FOREIGN KEY (`IdArea`) REFERENCES `AreaDepartamento`(`IdArea`) ON DELETE RESTRICT ON UPDATE CASCADE;
