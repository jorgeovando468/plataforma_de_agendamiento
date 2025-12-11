-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para consultorio_psicologico
CREATE DATABASE IF NOT EXISTS `consultorio_psicologico` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `consultorio_psicologico`;

-- Volcando estructura para tabla consultorio_psicologico.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla consultorio_psicologico.admin: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` (`id`, `usuario`, `contrasena`) VALUES
	(2, 'admin', '$2b$10$FiQm761qQ0BnaODHwg4g3Ok8/JUrSSKCf4M0.NWhKjbD3Ki3KGbxW'),
	(3, 'Alan', '$2y$10$ofEJt.Z3ECkmI9nK9IoHruZOUooNGcPnTRm2YSGF6Gq.TlY.b5Ora'),
	(6, 'Alan2', '$2y$10$ofEJt.Z3ECkmI9nK9IoHruZOUooNGcPnTRm2YSGF6Gq.TlY.b5Ora');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

-- Volcando estructura para tabla consultorio_psicologico.appointments
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `age` int(11) NOT NULL CHECK (`age` >= 18),
  `reason` text NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'pendiente',
  `date` date NOT NULL,
  `time` time NOT NULL,
  `price` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_date` (`date`),
  KEY `idx_nombre_completo` (`nombre_completo`),
  KEY `idx_telefono` (`telefono`),
  UNIQUE KEY `uniq_date_time` (`date`,`time`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
