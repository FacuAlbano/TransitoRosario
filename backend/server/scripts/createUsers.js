const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function createInitialUsers() {
  try {
    console.log('Iniciando creación de usuarios...');

    // Crear contraseñas encriptadas
    const defaultPassword = await bcrypt.hash('Password123!', 10);
    const tuPassword = await bcrypt.hash('Falbano.106', 10);

    // Tu usuario (programador)
    await db.execute(
      `INSERT INTO usuarios (
        nombre, apellido, email, usuario, password,
        fecha_nacimiento, direccion, ciudad, provincia,
        pais, codigo_postal, rol_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password = VALUES(password)`,
      [
        'Facundo', 'Albano', '39500455@terciariourquiza.edu.ar',
        'Falbano', tuPassword, '1996-08-14', 'San luis 3123',
        'Rosario', 'Santa Fe', 'Argentina', '2000', 1
      ]
    );

    // Arrays de usuarios por tipo
    const guardiaUrbana = Array.from({ length: 10 }, (_, i) => [
      `Guardia${i + 1}`, `Apellido${i + 1}`,
      `guardia${i + 1}@guardia.gob.ar`, `GUrbana${i + 1}`,
      defaultPassword, '1985-01-01', `Dirección GU ${i + 1}`,
      'Rosario', 'Santa Fe', 'Argentina', '2000', 2
    ]);

    const periodistas = Array.from({ length: 10 }, (_, i) => [
      `Periodista${i + 1}`, `Apellido${i + 1}`,
      `periodista${i + 1}@prensa.com`, `Prensa${i + 1}`,
      defaultPassword, '1990-01-01', `Dirección P ${i + 1}`,
      'Rosario', 'Santa Fe', 'Argentina', '2000', 3
    ]);

    const usuariosMayores = Array.from({ length: 10 }, (_, i) => [
      `Mayor${i + 1}`, `Apellido${i + 1}`,
      `mayor${i + 1}@email.com`, `Mayor${i + 1}`,
      defaultPassword, '2000-01-01', `Dirección M ${i + 1}`,
      'Rosario', 'Santa Fe', 'Argentina', '2000', 4
    ]);

    const usuariosMenores = Array.from({ length: 10 }, (_, i) => [
      `Menor${i + 1}`, `Apellido${i + 1}`,
      `menor${i + 1}@email.com`, `Menor${i + 1}`,
      defaultPassword, '2010-01-01', `Dirección m ${i + 1}`,
      'Rosario', 'Santa Fe', 'Argentina', '2000', 5
    ]);

    // Insertar usuarios por lotes
    for (const users of [guardiaUrbana, periodistas, usuariosMayores, usuariosMenores]) {
      for (const user of users) {
        await db.execute(
          `INSERT IGNORE INTO usuarios (
            nombre, apellido, email, usuario, password,
            fecha_nacimiento, direccion, ciudad, provincia,
            pais, codigo_postal, rol_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          user
        );
      }
    }

    console.log('Usuarios creados exitosamente');
    console.log('\nCredenciales de acceso:');
    console.log('1. Usuario Programador:');
    console.log('   Usuario: Falbano');
    console.log('   Contraseña: Falbano.106');
    console.log('\n2. Otros usuarios:');
    console.log('   Guardia Urbana: GUrbana1 - Password123!');
    console.log('   Periodista: Prensa1 - Password123!');
    console.log('   Usuario Mayor: Mayor1 - Password123!');
    console.log('   Usuario Menor: Menor1 - Password123!');

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
  } finally {
    process.exit();
  }
}

createInitialUsers(); 