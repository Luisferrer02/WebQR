const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  dispositivoId: { type: String, required: true, unique: true },
  nombre: { type: String, required: false }, // Nuevo campo
  apellido: { type: String, required: false }, // Nuevo campo
  qr_escaneados: { type: [String], default: [] },
  puntos: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
