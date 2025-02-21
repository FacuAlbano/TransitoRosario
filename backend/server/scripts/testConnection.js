const db = require('../config/db');

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  } catch (error) {
    console.error('Error de conexión:', error.message);
  }
  process.exit();
}

testConnection(); 