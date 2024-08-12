const mongoose = require('mongoose');

const siniestroSchema = new mongoose.Schema({
  numero: { type: String },
});

module.exports = mongoose.model('Siniestro', siniestroSchema);
