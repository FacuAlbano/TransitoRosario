const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No hay token de autenticación' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, 'tu_secret_key');
      console.log('Token decodificado:', decoded); // Para debugging

      const [users] = await db.execute(
        'SELECT id, usuario FROM usuarios WHERE id = ?',
        [decoded.id]
      );

      console.log('Usuario encontrado:', users[0]); // Para debugging

      if (!users || users.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      req.user = {
        id: users[0].id,
        usuario: users[0].usuario
      };
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token inválido' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = auth; 