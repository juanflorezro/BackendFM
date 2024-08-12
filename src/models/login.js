const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String },
  contraseña: { type: String },
  estado: { type: Boolean},
  tipo: { type: String }
});

module.exports = mongoose.model('Login', usuarioSchema)