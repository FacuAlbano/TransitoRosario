const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'falbano.106',
  database: 'trro',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
  dateStrings: true
});

// Verificar la conexión
pool.getConnection()
  .then(connection => {
    console.log('Base de datos conectada exitosamente');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  });

module.exports = pool; 