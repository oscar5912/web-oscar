-- CreateTable
CREATE TABLE `Producto` (
    `IdProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `Codigo` VARCHAR(191) NOT NULL,
    `Nombre` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,
    `IdCategoria` INTEGER NOT NULL,
    `Stock` INTEGER NOT NULL,
    `Precio` DECIMAL(10, 2) NOT NULL,
    `Estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`IdProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
