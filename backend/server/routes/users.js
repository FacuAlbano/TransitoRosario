const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Obtener perfil del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, usuario, rol_id, rol FROM usuarios WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router; 