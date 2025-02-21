const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Agregar al inicio del archivo
const cleanupExpiredReports = () => {
  const query = `
    UPDATE reports 
    SET estado = 'expirado' 
    WHERE estado = 'activo' 
    AND (
      NOW() > fecha_expiracion 
      OR fecha_creacion <= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
    )
  `;

  db.query(query, (error) => {
    if (error) {
      console.error('Error al limpiar reportes expirados:', error);
    } else {
      console.log('Limpieza de reportes ejecutada:', new Date().toISOString());
    }
  });
};

// Ejecutar la limpieza cada 15 segundos
setInterval(cleanupExpiredReports, 15000);

// Ejecutar limpieza inmediatamente al iniciar
cleanupExpiredReports();

// GET /api/reports/active
router.get('/active', auth, async (req, res) => {
  try {
    const query = `
      SELECT r.*, t.nombre as tipo_nombre, u.nombre as creador_nombre 
      FROM reports r 
      JOIN report_types t ON r.tipo_id = t.id 
      JOIN usuarios u ON r.creador_id = u.id 
      WHERE r.estado = 'activo' 
      AND NOW() <= r.fecha_expiracion
      AND r.fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
      ORDER BY r.fecha_creacion DESC
    `;

    db.query(query, [], (error, results) => {
      if (error) {
        console.error('Error en consulta:', error);
        return res.status(500).json({ message: 'Error al obtener reportes' });
      }

      // Filtro adicional por si acaso
      const now = new Date();
      const filtered = results.filter(report => {
        const expirationDate = new Date(report.fecha_expiracion);
        const creationDate = new Date(report.fecha_creacion);
        const thirtyMinutesAgo = new Date(now - 30 * 60000);
        
        return expirationDate > now && creationDate > thirtyMinutesAgo;
      });

      res.json(filtered);
    });
  } catch (error) {
    console.error('Error en GET /reports/active:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reports
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

    db.query(query, values, (error, result) => {
      if (error) {
        console.error('Error al insertar:', error);
        return res.status(400).json({ 
          message: 'Error al crear el reporte',
          error: error.message
        });
      }

      // Obtener el reporte creado
      const selectQuery = `
        SELECT r.*, t.nombre as tipo_nombre, u.nombre as creador_nombre 
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

module.exports = router; 