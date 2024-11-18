/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tenant_ownerId_name_key` ON `Tenant`(`ownerId`, `name`);
