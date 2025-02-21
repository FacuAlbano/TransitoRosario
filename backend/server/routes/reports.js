const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Crear un nuevo reporte
router.post('/', auth, async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const { tipo_id, descripcion, latitud, longitud, fecha_expiracion } = req.body;
    const creador_id = req.user.id;

    // Validar datos
    if (!tipo_id || !descripcion || !latitud || !longitud || !fecha_expiracion) {
      console.log('Datos faltantes:', { tipo_id, descripcion, latitud, longitud, fecha_expiracion });
      return res.status(400).json({ 
        error: 'Faltan datos requeridos',
        received: { tipo_id, descripcion, latitud, longitud, fecha_expiracion }
      });
    }

    // Insertar el reporte
    const query = `
      INSERT INTO reports 
      (tipo_id, descripcion, latitud, longitud, creador_id, fecha_expiracion, estado) 
      VALUES (?, ?, ?, ?, ?, ?, 'activo')
    `;
    const values = [
      tipo_id, 
      descripcion, 
      latitud, 
      longitud, 
      creador_id, 
      fecha_expiracion // Ya viene formateada correctamente desde el frontend
    ];
    
    console.log('Ejecutando query:', query, 'con valores:', values);
    
    const [result] = await pool.query(query, values);

    // Obtener el reporte creado
    const [newReport] = await pool.query(
      `SELECT r.*, rt.nombre as tipo_nombre, u.nombre as creador_nombre 
       FROM reports r 
       JOIN report_types rt ON r.tipo_id = rt.id 
       JOIN usuarios u ON r.creador_id = u.id 
       WHERE r.id = ?`,
      [result.insertId]
    );

    if (!newReport || newReport.length === 0) {
      throw new Error('No se pudo crear el reporte');
    }

    res.status(201).json(newReport[0]);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      error: 'Error al crear el reporte',
      message: error.message,
      sqlMessage: error.sqlMessage
    });
  }
});

// Obtener todos los reportes activos
router.get('/', async (req, res) => {
  try {
    const [reports] = await pool.query(
      `SELECT r.*, rt.nombre as tipo_nombre, u.nombre as creador_nombre 
       FROM reports r 
       JOIN report_types rt ON r.tipo_id = rt.id 
       JOIN usuarios u ON r.creador_id = u.id 
       WHERE r.estado = 'activo' AND r.fecha_expiracion > NOW()
       ORDER BY r.fecha_creacion DESC`
    );
    res.json(reports);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener los reportes' });
  }
});

// Obtener tipos de reportes
router.get('/types', async (req, res) => {
  try {
    const [types] = await pool.query('SELECT * FROM report_types');
    res.json(types);
  } catch (error) {
    console.error('Error al obtener tipos de reporte:', error);
    res.status(500).json({ error: 'Error al obtener tipos de reporte' });
  }
});

// Confirmar un reporte (para usuarios normales)
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;

    // Verificar si ya confirmó este reporte
    const [existing] = await pool.query(
      'SELECT * FROM report_confirmations WHERE reporte_id = ? AND usuario_id = ?',
      [reportId, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya has confirmado este reporte' });
    }

    // Agregar confirmación
    await pool.query(
      'INSERT INTO report_confirmations (reporte_id, usuario_id) VALUES (?, ?)',
      [reportId, userId]
    );

    res.json({ message: 'Reporte confirmado exitosamente' });
  } catch (error) {
    console.error('Error al confirmar reporte:', error);
    res.status(500).json({ error: 'Error al confirmar el reporte' });
  }
});

// Verificar un reporte (solo para admins)
router.post('/:id/verify', auth, async (req, res) => {
  try {
    const reportId = req.params.id;
    
    // Verificar si es admin
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para verificar reportes' });
    }

    // Actualizar estado del reporte
    await pool.query(
      'UPDATE reports SET estado = "verificado" WHERE id = ?',
      [reportId]
    );

    res.json({ message: 'Reporte verificado exitosamente' });
  } catch (error) {
    console.error('Error al verificar reporte:', error);
    res.status(500).json({ error: 'Error al verificar el reporte' });
  }
});

module.exports = router; 