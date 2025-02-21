const express = require('express');
const cors = require('cors');
const app = express();

// Rutas
const authRoutes = require('./routes/auth');
const routesRouter = require('./routes/routes');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error del servidor',
    details: err.message 
  });
});

module.exports = app; 