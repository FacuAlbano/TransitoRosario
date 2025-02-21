const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'falbano.106',
  database: 'trro'
});

// Convertir callbacks a promesas
const promiseDb = db.promise();

// Manejar errores de conexión
db.on('error', (err) => {
  console.error('Error en la base de datos:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconectando a la base de datos...');
    db.connect();
  }
});

module.exports = db; 