/*
  Warnings:

  - A unique constraint covering the columns `[grupo,clave]` on the table `Configuracion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Configuracion_grupo_clave_key` ON `Configuracion`(`grupo`, `clave`);
