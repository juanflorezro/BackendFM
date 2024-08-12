const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String },
});

module.exports = mongoose.model('Cliente', clienteSchema);
