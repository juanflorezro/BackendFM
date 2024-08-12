const mongoose = require('mongoose');

const juzgadoSchema = new mongoose.Schema({
  nombre: { type: String },
});

module.exports = mongoose.model('Juzgado', juzgadoSchema);
