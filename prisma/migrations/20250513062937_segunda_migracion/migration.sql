-- AlterTable
ALTER TABLE `Producto` ADD COLUMN `FechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Categoria` (
    `IdCategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `Descripcion` VARCHAR(191) NOT NULL,
    `Estado` BOOLEAN NOT NULL DEFAULT true,
    `FechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`IdCategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Colaborador` (
    `IdColaborador` INTEGER NOT NULL AUTO_INCREMENT,
    `Documento` VARCHAR(191) NOT NULL,
    `NombreCompleto` VARCHAR(191) NOT NULL,
    `Correo` VARCHAR(191) NOT NULL,
    `Telefono` VARCHAR(191) NOT NULL,
    `Estado` BOOLEAN NOT NULL DEFAULT true,
    `IdArea` INTEGER NOT NULL,
    `NombreArea` VARCHAR(191) NOT NULL,
    `Cargo` VARCHAR(191) NOT NULL,
    `FechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`IdColaborador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AreaDepartamento` (
    `IdArea` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreArea` VARCHAR(191) NOT NULL,
    `Estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`IdArea`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `IdUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Documento` VARCHAR(191) NOT NULL,
    `NombreCompleto` VARCHAR(191) NOT NULL,
    `Correo` VARCHAR(191) NOT NULL,
    `Clave` VARCHAR(191) NOT NULL,
    `IdRol` INTEGER NOT NULL,
    `Estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`IdUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `IdRol` INTEGER NOT NULL AUTO_INCREMENT,
    `Descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`IdRol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Despacho` (
    `IdDespacho` INTEGER NOT NULL AUTO_INCREMENT,
    `IdUsuario` INTEGER NOT NULL,
    `NumeroBoleta` VARCHAR(191) NOT NULL,
    `DocumentoColaborador` VARCHAR(191) NOT NULL,
    `NombreColaborador` VARCHAR(191) NOT NULL,
    `DepartamentoColaborador` VARCHAR(191) NOT NULL,
    `CargoColaborador` VARCHAR(191) NOT NULL,
    `MontoTotal` DECIMAL(10, 2) NOT NULL,
    `FechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`IdDespacho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleDespacho` (
    `IdDetalleDespacho` INTEGER NOT NULL AUTO_INCREMENT,
    `IdDespacho` INTEGER NOT NULL,
    `IdProducto` INTEGER NOT NULL,
    `CodigoProducto` VARCHAR(191) NOT NULL,
    `NombreProducto` VARCHAR(191) NOT NULL,
    `Precio` DECIMAL(10, 2) NOT NULL,
    `Cantidad` INTEGER NOT NULL,
    `SubTotal` DECIMAL(10, 2) NOT NULL,
    `FechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`IdDetalleDespacho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_IdCategoria_fkey` FOREIGN KEY (`IdCategoria`) REFERENCES `Categoria`(`IdCategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_IdRol_fkey` FOREIGN KEY (`IdRol`) REFERENCES `Rol`(`IdRol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleDespacho` ADD CONSTRAINT `DetalleDespacho_IdProducto_fkey` FOREIGN KEY (`IdProducto`) REFERENCES `Producto`(`IdProducto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleDespacho` ADD CONSTRAINT `DetalleDespacho_IdDespacho_fkey` FOREIGN KEY (`IdDespacho`) REFERENCES `Despacho`(`IdDespacho`) ON DELETE RESTRICT ON UPDATE CASCADE;
