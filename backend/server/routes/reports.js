const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Obtener tipos de reportes
router.get('/types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipos_reporte');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router; 