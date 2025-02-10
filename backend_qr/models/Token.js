const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  qrId: String,      // ID del QR
  token: String,     // Token de seguridad
  usado: { type: Boolean, default: false },
});

module.exports = mongoose.model("Token", TokenSchema);
