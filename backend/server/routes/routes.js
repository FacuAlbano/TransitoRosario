const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Obtener rutas favoritas del usuario
router.get('/favorite', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM rutas_favoritas WHERE usuario_id = ? ORDER BY fecha_creacion DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener rutas favoritas:', error);
    res.status(500).json({ error: 'Error al obtener las rutas favoritas' });
  }
});

// Agregar ruta favorita
router.post('/favorite', auth, async (req, res) => {
  try {
    console.log('Headers recibidos:', req.headers);
    console.log('Body recibido:', req.body);
    console.log('Usuario autenticado:', req.user);

    const { origin, destination, duration, distance, routeData } = req.body;
    const userId = req.user.id;

    // Validar datos
    if (!origin || !destination || !duration || !distance || !routeData) {
      console.log('Faltan datos:', { origin, destination, duration, distance, routeData });
      return res.status(400).json({ 
        error: 'Faltan datos requeridos',
        received: { origin, destination, duration, distance, hasRouteData: !!routeData }
      });
    }

    // Convertir routeData a string si es necesario
    const routeDataString = typeof routeData === 'string' 
      ? routeData 
      : JSON.stringify(routeData);

    // Verificar si ya existe una ruta similar
    const [existingRoutes] = await pool.query(
      'SELECT * FROM rutas_favoritas WHERE usuario_id = ? AND origen = ? AND destino = ?',
      [userId, origin, destination]
    );

    let result;
    if (existingRoutes.length > 0) {
      // Actualizar ruta existente
      [result] = await pool.query(
        'UPDATE rutas_favoritas SET duracion = ?, distancia = ?, ruta_data = ? WHERE id = ?',
        [duration, distance, routeDataString, existingRoutes[0].id]
      );

      console.log('Ruta actualizada:', result);
      return res.json({
        id: existingRoutes[0].id,
        usuario_id: userId,
        origen: origin,
        destino: destination,
        duracion: duration,
        distancia: distance,
        mensaje: 'Ruta actualizada correctamente'
      });
    }

    // Crear nueva ruta
    [result] = await pool.query(
      'INSERT INTO rutas_favoritas (usuario_id, origen, destino, duracion, distancia, ruta_data) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, origin, destination, duration, distance, routeDataString]
    );

    console.log('Nueva ruta creada:', result);
    res.json({
      id: result.insertId,
      usuario_id: userId,
      origen: origin,
      destino: destination,
      duracion: duration,
      distancia: distance,
      mensaje: 'Ruta guardada correctamente'
    });

  } catch (error) {
    console.error('Error detallado al guardar ruta favorita:', error);
    res.status(500).json({ 
      error: 'Error al guardar la ruta favorita',
      details: error.message,
      stack: error.stack
    });
  }
});

// Eliminar ruta favorita
router.delete('/favorite/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM rutas_favoritas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json({ message: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar ruta favorita:', error);
    res.status(500).json({ error: 'Error al eliminar la ruta favorita' });
  }
});

module.exports = router; 