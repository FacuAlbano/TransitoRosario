const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'falbano.106', // tu contraseña de MySQL
  database: 'trro_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z', // Importante para manejar fechas correctamente
  dateStrings: true, // Para recibir fechas como strings
  port: 3307,  // Añadimos el puerto explícitamente
  debug: false // Cambiamos a false para reducir el ruido
});

// Verificar la conexión
pool.getConnection()
  .then(connection => {
    console.log('Base de datos conectada exitosamente');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);  // Terminar el proceso si no se puede conectar
  });

module.exports = pool; 