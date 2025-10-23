-- CreateTable
CREATE TABLE `Reparacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `dispositivo` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `chip` BOOLEAN NOT NULL DEFAULT false,
    `memoria` BOOLEAN NOT NULL DEFAULT false,
    `presentaGolpes` BOOLEAN NOT NULL DEFAULT false,
    `protectorFunda` BOOLEAN NOT NULL DEFAULT false,
    `senia` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `total` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `estado` ENUM('RECIBIDO', 'DIAGNOSTICO', 'EN_REPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'RECIBIDO',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `precioCompra` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `precioVenta` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Producto_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCliente` INTEGER NOT NULL,
    `subtotal` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `total` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `estado` ENUM('PENDIENTE', 'PAGADA', 'ANULADA') NOT NULL DEFAULT 'PENDIENTE',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VentaDetalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idVenta` INTEGER NOT NULL,
    `idProducto` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(65, 30) NOT NULL,
    `totalLinea` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Auditoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accion` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    `tabla` VARCHAR(191) NOT NULL,
    `registroId` VARCHAR(191) NOT NULL,
    `idUsuario` INTEGER NULL,
    `log` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentaDetalle` ADD CONSTRAINT `VentaDetalle_idVenta_fkey` FOREIGN KEY (`idVenta`) REFERENCES `Venta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentaDetalle` ADD CONSTRAINT `VentaDetalle_idProducto_fkey` FOREIGN KEY (`idProducto`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
