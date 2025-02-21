const mysql = require('mysql2/promise');
const db = require('../config/db');

class User {
  static async create(userData) {
    const {
      nombre, apellido, email, usuario, password,
      fechaNacimiento, direccion, ciudad, provincia,
      pais, codigoPostal
    } = userData;

    try {
      const [result] = await db.execute(
        'INSERT INTO usuarios (nombre, apellido, email, usuario, password, fecha_nacimiento, direccion, ciudad, provincia, pais, codigo_postal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, usuario, password, fechaNacimiento, direccion, ciudad, provincia, pais, codigoPostal]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmailOrUsername(emailOrUsername) {
    try {
      const [users] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ? OR usuario = ?',
        [emailOrUsername, emailOrUsername]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 