const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 