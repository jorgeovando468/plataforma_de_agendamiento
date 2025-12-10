-- Tabla para horarios disponibles y precios
CREATE TABLE IF NOT EXISTS time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  time_value VARCHAR(10) NOT NULL,
  time_display VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para configuración de días bloqueados
CREATE TABLE IF NOT EXISTS blocked_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para configuración general
CREATE TABLE IF NOT EXISTS config_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar horarios por defecto
INSERT INTO time_slots (time_value, time_display, price, is_active) VALUES
('09:00', '9:00 AM', 45.000, TRUE),
('10:30', '10:30 AM', 45.000, TRUE),
('12:00', '12:00 PM', 50.000, TRUE),
('15:00', '3:00 PM', 50.000, TRUE),
('16:30', '4:30 PM', 55.000, TRUE),
('18:00', '6:00 PM', 55.000, TRUE);

-- Insertar configuraciones por defecto
INSERT INTO config_settings (setting_key, setting_value) VALUES
('min_booking_days', '0'),
('max_booking_days', '30'),
('blocked_weekdays', '0,6'),
('working_hours_start', '09:00'),
('working_hours_end', '20:00')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);