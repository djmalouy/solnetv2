/*
  Warnings:

  - You are about to drop the column `clave` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `_RolToUsuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashClave` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_RolToUsuario` DROP FOREIGN KEY `_RolToUsuario_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RolToUsuario` DROP FOREIGN KEY `_RolToUsuario_B_fkey`;

-- AlterTable
ALTER TABLE `Cliente` ADD COLUMN `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Rol` ADD COLUMN `descripcion` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `clave`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `hashClave` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_RolToUsuario`;

-- CreateTable
CREATE TABLE `UsuariosRoles` (
    `id_usuario` INTEGER NOT NULL,
    `id_rol` INTEGER NOT NULL,

    PRIMARY KEY (`id_usuario`, `id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permiso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clave` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    UNIQUE INDEX `Permiso_clave_key`(`clave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolesPermisos` (
    `idRol` INTEGER NOT NULL,
    `idPermiso` INTEGER NOT NULL,

    PRIMARY KEY (`idRol`, `idPermiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Rol_nombre_key` ON `Rol`(`nombre`);

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosRoles` ADD CONSTRAINT `UsuariosRoles_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosRoles` ADD CONSTRAINT `UsuariosRoles_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolesPermisos` ADD CONSTRAINT `RolesPermisos_idRol_fkey` FOREIGN KEY (`idRol`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolesPermisos` ADD CONSTRAINT `RolesPermisos_idPermiso_fkey` FOREIGN KEY (`idPermiso`) REFERENCES `Permiso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
