-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS trro;
USE trro;

-- Tabla roles
CREATE TABLE roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(45),
    descripcion TEXT
);

-- Tabla usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    email VARCHAR(100),
    usuario VARCHAR(45),
    password VARCHAR(255),
    fecha_nacimiento DATE,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    rol_id INT,
    fecha_registro TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla report_types
CREATE TABLE report_types (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    icono VARCHAR(50)
);

-- Tabla reports
CREATE TABLE reports (
    id INT PRIMARY KEY,
    tipo_id INT,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    descripcion TEXT,
    fecha_creacion TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    estado ENUM('activo', 'expirado', 'verificado'),
    creador_id INT,
    confirmaciones INT,
    FOREIGN KEY (tipo_id) REFERENCES report_types(id),
    FOREIGN KEY (creador_id) REFERENCES usuarios(id)
);

-- Tabla report_confirmations
CREATE TABLE report_confirmations (
    id INT PRIMARY KEY,
    reporte_id INT,
    usuario_id INT,
    fecha TIMESTAMP,
    FOREIGN KEY (reporte_id) REFERENCES reports(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla sesiones
CREATE TABLE sesiones (
    id INT PRIMARY KEY,
    usuario_id INT,
    token VARCHAR(255),
    fecha_creacion TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla rutas_favoritas
CREATE TABLE rutas_favoritas (
    id INT PRIMARY KEY,
    origen VARCHAR(255),
    destino VARCHAR(255),
    fecha_creacion TIMESTAMP,
    direccion VARCHAR(50),
    distancia VARCHAR(50),
    ruta_data JSON
);
-- Primero eliminar las tablas que dependen de usuarios
DROP TABLE IF EXISTS report_confirmations;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS sesiones;
DROP TABLE IF EXISTS rutas_favoritas;
-- Ahora sí podemos eliminar usuarios
DROP TABLE IF EXISTS usuarios;

-- Recrear las tablas en orden
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    rol_id INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Recrear las otras tablas
CREATE TABLE sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    estado ENUM('activo', 'expirado', 'verificado') DEFAULT 'activo',
    creador_id INT,
    confirmaciones INT DEFAULT 0,
    FOREIGN KEY (tipo_id) REFERENCES report_types(id),
    FOREIGN KEY (creador_id) REFERENCES usuarios(id)
);

CREATE TABLE report_confirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporte_id INT,
    usuario_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporte_id) REFERENCES reports(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE rutas_favoritas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(255),
    destino VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion VARCHAR(50),
    distancia VARCHAR(50),
    ruta_data JSON
);

SELECT * FROM roles;
DELETE FROM roles
WHERE id = 0;
TRUNCATE TABLE roles;

-- Actualizar los roles existentes y agregar los que faltan
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'programador', 'Acceso total al sistema'),
(2, 'guardia_urbana', 'Personal de Guardia Urbana'),
(3, 'periodista', 'Acceso a funciones de prensa'),
(4, 'usuario_mayor', 'Usuario mayor de 16 años'),
(5, 'usuario_menor', 'Usuario menor de 16 años')
ON DUPLICATE KEY UPDATE
nombre = VALUES(nombre),
descripcion = VALUES(descripcion);