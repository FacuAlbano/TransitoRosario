const db = require('../config/db');

async function createRoles() {
  try {
    console.log('Iniciando creación de roles...');

    // Primero limpiar la tabla de roles
    await db.execute('TRUNCATE TABLE roles');

    const roles = [
      [1, 'programador', 'Acceso total al sistema'],
      [2, 'guardia_urbana', 'Personal de Guardia Urbana'],
      [3, 'periodista', 'Acceso a funciones de prensa'],
      [4, 'usuario_mayor', 'Usuario mayor de 16 años'],
      [5, 'usuario_menor', 'Usuario menor de 16 años']
    ];

    for (const [id, nombre, descripcion] of roles) {
      await db.execute(
        'INSERT INTO roles (id, nombre, descripcion) VALUES (?, ?, ?)',
        [id, nombre, descripcion]
      );
    }

    console.log('Roles creados exitosamente');

  } catch (error) {
    console.error('Error al crear roles:', error);
  } finally {
    process.exit();
  }
}

createRoles(); 