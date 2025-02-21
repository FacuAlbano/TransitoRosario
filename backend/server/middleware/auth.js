const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const [sesiones] = await db.execute(
      'SELECT * FROM sesiones WHERE token = ? AND fecha_expiracion > NOW()',
      [token]
    );

    if (sesiones.length === 0) {
      throw new Error();
    }

    const decoded = jwt.verify(token, 'tu_secret_key');
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Por favor autentícate.' });
  }
};

module.exports = auth; 