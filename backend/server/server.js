const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // URL de tu frontend
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 