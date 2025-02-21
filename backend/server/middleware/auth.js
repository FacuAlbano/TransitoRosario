const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'tu_secret_key'); // Usa la misma clave que usaste al crear el token

    const [users] = await pool.query(
      'SELECT id, usuario FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = {
      id: users[0].id,
      usuario: users[0].usuario
    };
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ 
      error: 'Token inválido o expirado',
      details: error.message 
    });
  }
};

module.exports = auth; 