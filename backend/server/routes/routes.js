const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Obtener rutas favoritas del usuario
router.get('/favorites', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rutas_favoritas WHERE usuario_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Agregar ruta favorita
router.post('/favorites', auth, async (req, res) => {
  const { origen, destino } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO rutas_favoritas (usuario_id, origen, destino) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, origen, destino]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router; 