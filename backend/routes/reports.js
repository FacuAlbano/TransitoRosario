const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database/db');

// Agregar la función calculateAge al principio del archivo
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Obtener todos los reportes activos
router.get('/active', auth, async (req, res) => {
  try {
    const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const query = `
      SELECT r.*, t.nombre as tipo_nombre, u.nombre as creador_nombre 
      FROM reports r 
      JOIN report_types t ON r.tipo_id = t.id 
      JOIN usuarios u ON r.creador_id = u.id 
      WHERE r.estado = 'activo' 
      AND r.fecha_expiracion > ?
    `;

    db.query(query, [ahora], (error, results) => {
      if (error) {
        console.error('Error en consulta:', error);
        return res.status(500).json({ message: 'Error al obtener reportes' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error en GET /reports/active:', error);
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo reporte
router.post('/', auth, async (req, res) => {
  try {
    const { tipo_id, descripcion, latitud, longitud } = req.body;

    // Validar datos requeridos
    if (!tipo_id || !descripcion || !latitud || !longitud) {
      return res.status(400).json({ 
        message: 'Faltan datos requeridos',
        received: req.body 
      });
    }

    // Calcular fecha de expiración (30 minutos desde ahora)
    const fechaCreacion = new Date();
    const fechaExpiracion = new Date(fechaCreacion.getTime() + 30 * 60000);

    // Formatear fechas para MySQL
    const fechaCreacionStr = fechaCreacion.toISOString().slice(0, 19).replace('T', ' ');
    const fechaExpiracionStr = fechaExpiracion.toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      INSERT INTO reports (
        tipo_id,
        descripcion,
        latitud,
        longitud,
        fecha_creacion,
        fecha_expiracion,
        estado,
        creador_id,
        confirmaciones
      ) VALUES (?, ?, ?, ?, ?, ?, 'activo', ?, 0)
    `;

    const values = [
      parseInt(tipo_id),
      descripcion,
      parseFloat(latitud),
      parseFloat(longitud),
      fechaCreacionStr,
      fechaExpiracionStr,
      req.user.id
    ];

    console.log('Insertando reporte con valores:', {
      tipo_id: parseInt(tipo_id),
      descripcion,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      fecha_creacion: fechaCreacionStr,
      fecha_expiracion: fechaExpiracionStr,
      creador_id: req.user.id
    });

    db.query(query, values, (error, result) => {
      if (error) {
        console.error('Error al insertar:', error);
        return res.status(400).json({ 
          message: 'Error al crear el reporte',
          error: error.message,
          sql: error.sql
        });
      }

      // Obtener el reporte creado con información del tipo
      const selectQuery = `
        SELECT 
          r.*,
          t.nombre as tipo_nombre,
          u.nombre as creador_nombre,
          u.rol_id as creador_rol_id
        FROM reports r 
        JOIN report_types t ON r.tipo_id = t.id 
        JOIN usuarios u ON r.creador_id = u.id 
        WHERE r.id = ?
      `;

      db.query(selectQuery, [result.insertId], (err, reportes) => {
        if (err || !reportes.length) {
          console.error('Error al obtener reporte creado:', err);
          return res.status(500).json({ message: 'Error al obtener el reporte creado' });
        }
        
        console.log('Reporte creado exitosamente:', reportes[0]);
        res.status(201).json(reportes[0]);
      });
    });
  } catch (error) {
    console.error('Error en POST /reports:', error);
    res.status(400).json({
      message: 'Error al crear el reporte',
      error: error.message
    });
  }
});

// Confirmar un reporte
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;

    // Insertar confirmación
    const confirmQuery = `
      INSERT INTO report_confirmations (reporte_id, usuario_id)
      VALUES (?, ?)
    `;

    db.query(confirmQuery, [reportId, userId], (error) => {
      if (error) {
        console.error('Error al confirmar reporte:', error);
        return res.status(400).json({ message: 'Error al confirmar el reporte' });
      }

      // Actualizar fecha de expiración y contador de confirmaciones
      const updateQuery = `
        UPDATE reports 
        SET fecha_expiracion = DATE_ADD(NOW(), INTERVAL 30 MINUTE),
            confirmaciones = (
              SELECT COUNT(*) 
              FROM report_confirmations 
              WHERE reporte_id = ?
            )
        WHERE id = ?
      `;

      db.query(updateQuery, [reportId, reportId], (err) => {
        if (err) {
          console.error('Error al actualizar reporte:', err);
          return res.status(400).json({ message: 'Error al actualizar el reporte' });
        }

        // Obtener reporte actualizado
        const selectQuery = `
          SELECT r.*, t.nombre as tipo_nombre, u.nombre as creador_nombre 
          FROM reports r 
          JOIN report_types t ON r.tipo_id = t.id 
          JOIN usuarios u ON r.creador_id = u.id 
          WHERE r.id = ?
        `;

        db.query(selectQuery, [reportId], (err, reportes) => {
          if (err || !reportes.length) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
          }
          res.json(reportes[0]);
        });
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verificar un reporte
router.post('/:id/verify', auth, async (req, res) => {
  try {
    if (req.user.rol_id !== 3 && req.user.rol_id !== 4) {
      return res.status(403).json({ message: 'No tienes permiso para verificar reportes' });
    }

    const reportId = req.params.id;
    const query = `
      UPDATE reports 
      SET estado = 'verificado' 
      WHERE id = ?
    `;

    db.query(query, [reportId], (error) => {
      if (error) {
        console.error('Error al verificar reporte:', error);
        return res.status(400).json({ message: 'Error al verificar el reporte' });
      }

      // Obtener reporte actualizado
      const selectQuery = `
        SELECT r.*, t.nombre as tipo_nombre, u.nombre as creador_nombre 
        FROM reports r 
        JOIN report_types t ON r.tipo_id = t.id 
        JOIN usuarios u ON r.creador_id = u.id 
        WHERE r.id = ?
      `;

      db.query(selectQuery, [reportId], (err, reportes) => {
        if (err || !reportes.length) {
          return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.json(reportes[0]);
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 