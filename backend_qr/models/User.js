const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  dispositivoId: String,  // ID único del usuario
  qr_escaneados: [String], // Lista de QR escaneados
  puntos: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
