-- Tabla para rutas favoritas
CREATE TABLE IF NOT EXISTS favorite_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    origen_lat DECIMAL(10, 8) NOT NULL,
    origen_lng DECIMAL(11, 8) NOT NULL,
    destino_lat DECIMAL(10, 8) NOT NULL,
    destino_lng DECIMAL(11, 8) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla para tipos de reportes
CREATE TABLE IF NOT EXISTS report_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- Tabla para reportes
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    estado ENUM('activo', 'inactivo', 'verificado') DEFAULT 'activo',
    creador_id INT NOT NULL,
    FOREIGN KEY (tipo_id) REFERENCES report_types(id),
    FOREIGN KEY (creador_id) REFERENCES usuarios(id)
);

-- Tabla para confirmaciones de reportes
CREATE TABLE IF NOT EXISTS report_confirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporte_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporte_id) REFERENCES reports(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Insertar tipos de reportes básicos
INSERT INTO report_types (nombre, descripcion, icono) VALUES
('Accidente', 'Accidente de tránsito', 'FaCarCrash'),
('Obra', 'Obras en la vía pública', 'FaHardHat'),
('Corte', 'Corte de calle', 'FaRoad'),
('Manifestación', 'Manifestación o protesta', 'FaUsers'),
('Inundación', 'Calle inundada', 'FaWater'),
('Semáforo', 'Semáforo no funciona', 'FaTrafficLight'); 