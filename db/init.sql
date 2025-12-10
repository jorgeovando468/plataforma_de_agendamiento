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
  KEY `idx_telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla consultorio_psicologico.appointments: ~12 rows (aproximadamente)
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` (`id`, `email`, `nombre_completo`, `telefono`, `age`, `reason`, `estado`, `date`, `time`, `price`, `created_at`) VALUES
	(10, 'jemprendetumismo@gmail.com', 'jorge ovando', '0976578699', 29, 'ashkjashd', 'confirmada', '2025-11-06', '10:30:00', '$45.000', '2025-10-30 14:24:23'),
	(11, 'alitorresvilla@hotmail.com', 'Alicia Villasanti', '0976119360', 29, 'Evaluacion Psicologica', 'confirmada', '2025-10-31', '16:30:00', '$55.000', '2025-10-30 14:27:58'),
	(12, 'nilda2970@gmail.com', 'Alan Cosa', '0976578699', 18, 'sgsdfgs', 'confirmada', '2025-10-31', '12:00:00', '$50.000', '2025-10-30 18:09:09'),
	(13, 'jorgeovando468@gmail.com', 'Alicia Villasanti', '0976578699', 29, 'jaskljdajlasd', 'confirmada', '2025-11-21', '10:30:00', '$45.000', '2025-11-10 13:39:11'),
	(14, 'jemprendetumismo@gmail.com', 'jorge ovando', '0976119360', 18, 'es otra cita', 'confirmada', '2025-11-20', '09:00:00', '$45.000', '2025-11-10 13:40:18'),
	(15, 'jemprendetumismo@gmail.com', 'jorge ovando', '0976578699', 20, 'otra cita nueva', 'confirmada', '2025-11-21', '09:00:00', '$45.000', '2025-11-10 13:41:17'),
	(16, 'jemprendetumismo@gmail.com', 'Alan Cosa', '0976578699', 20, 'prueba', 'confirmada', '2025-11-21', '10:30:00', '$45.000', '2025-11-10 13:54:14'),
	(17, 'jemprendetumismo@gmail.com', 'Alicia Villasanti', '0976119360', 19, 'assdfsafas', 'confirmada', '2025-11-13', '12:00:00', '$50.000', '2025-11-10 13:57:25'),
	(18, 'jorgeovando468@gmail.com', 'Alicia Villasanti', '0976578699', 19, 'fffjgfj', 'confirmada', '2025-11-14', '10:30:00', '$45.000', '2025-11-10 14:36:37'),
	(19, 'jemprendetumismo@gmail.com', 'Alan Cosa', '0976119360', 34, 'jhhg', 'confirmada', '2025-11-28', '18:00:00', '$55.000', '2025-11-10 14:37:50'),
	(20, 'jorgeovando468@gmail.com', 'Alan Cosa', '0976578699', 54, 'sdsdg', 'pendiente', '2025-11-13', '18:00:00', '$55.000', '2025-11-11 08:46:58'),
	(21, 'jemprendetumismo@gmail.com', 'Angel Herrera', '0976119360', 20, 'sdaffsda', 'pendiente', '2025-11-14', '09:00:00', '$45.000', '2025-11-11 15:13:21');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
