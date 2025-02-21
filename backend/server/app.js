const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
const routesRouter = require('./routes/routes');
const reportsRoutes = require('./routes/reports');
const usersRoutes = require('./routes/users');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRouter);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    error: 'Error del servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app; 