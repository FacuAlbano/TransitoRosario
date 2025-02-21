const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  tipo_id: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  latitud: {
    type: Number,
    required: true
  },
  longitud: {
    type: Number,
    required: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_expiracion: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'expirado', 'verificado'],
    default: 'activo'
  },
  confirmaciones: {
    type: Number,
    default: 0
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Report', reportSchema); 