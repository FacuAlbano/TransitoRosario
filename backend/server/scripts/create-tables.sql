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

-- Tabla de tipos de reporte
CREATE TABLE IF NOT EXISTS tipos_reporte (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT
);

-- Tabla de rutas favoritas
CREATE TABLE IF NOT EXISTS rutas_favoritas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  origen VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT
);

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion) VALUES
  ('programador', 'Acceso total al sistema'),
  ('administrador', 'Administración del sistema'),
  ('moderador', 'Moderación de contenido'),
  ('usuario_mayor', 'Usuario mayor de 16 años'),
  ('usuario_menor', 'Usuario menor de 16 años');

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  provincia VARCHAR(100),
  pais VARCHAR(100),
  codigo_postal VARCHAR(20),
  rol_id INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Insertar tipos de reporte básicos
INSERT INTO tipos_reporte (nombre, descripcion) VALUES
  ('Accidente', 'Accidente de tránsito'),
  ('Obra', 'Obra en la vía'),
  ('Corte', 'Corte de calle'),
  ('Manifestación', 'Manifestación o protesta'),
  ('Inundación', 'Calle inundada'),
  ('Semáforo', 'Problema con semáforo'); 