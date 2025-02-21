const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'falbano.106',
  database: process.env.DB_NAME || 'trro_db',
  port: process.env.DB_PORT || 3307,
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