const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');

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
    const ahora = new Date();
    const reports = await Report.find({
      estado: 'activo',
      fecha_expiracion: { $gt: ahora }
    }).populate('creador', 'nombre rol_id');
    
    console.log('Reportes activos encontrados:', reports.length);
    res.json(reports);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo reporte
router.post('/', auth, async (req, res) => {
  try {
    const tiposReporte = {
      1: 'Accidente',
      2: 'Obra',
      3: 'Corte',
      4: 'Manifestación',
      5: 'Inundación',
      6: 'Semáforo'
    };

    const fechaExpiracion = new Date();
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 30);

    const nuevoReporte = new Report({
      tipo_id: req.body.tipo_id,
      tipo_nombre: tiposReporte[req.body.tipo_id],
      descripcion: req.body.descripcion,
      latitud: req.body.latitud,
      longitud: req.body.longitud,
      fecha_creacion: new Date(),
      fecha_expiracion: fechaExpiracion,
      creador: req.user.id
    });

    const reporteGuardado = await nuevoReporte.save();
    await reporteGuardado.populate('creador', 'nombre rol_id');
    
    res.status(201).json(reporteGuardado);
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(400).json({ message: error.message });
  }
});

// Confirmar un reporte (renueva el tiempo)
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const reporte = await Report.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const nuevaExpiracion = new Date();
    nuevaExpiracion.setMinutes(nuevaExpiracion.getMinutes() + 30);

    reporte.fecha_expiracion = nuevaExpiracion;
    reporte.confirmaciones += 1;
    await reporte.save();

    res.json(reporte);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verificar un reporte (solo para guardia urbana y programador)
router.post('/:id/verify', auth, async (req, res) => {
  try {
    if (req.user.rol_id !== 3 && req.user.rol_id !== 4) { // Guardia urbana y programador
      return res.status(403).json({ message: 'No tienes permiso para verificar reportes' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    report.verified = true;
    report.verifiedBy = req.user.id;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 