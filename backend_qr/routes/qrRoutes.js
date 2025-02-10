const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

// 🔹 Endpoint para generar QR con token único
router.get("/generate-qr/:qrId", async (req, res) => {
  const { qrId } = req.params;
  const token = crypto.randomBytes(16).toString("hex");

  await Token.create({ qrId, token });

  const qrUrl = `${process.env.FRONTEND_URL}/scan?id=${qrId}&token=${token}`;

  QRCode.toDataURL(qrUrl, (err, qrImage) => {
    if (err) return res.status(500).json({ message: "Error generando QR" });
    res.json({ qrUrl, qrImage });
  });
});

// 🔹 Endpoint que se accede al escanear un QR
router.get("/scan", async (req, res) => {
  const { id: qrId, token } = req.query;
  const dispositivoId = req.headers["user-agent"] || crypto.randomBytes(8).toString("hex"); // ID simple

  const tokenData = await Token.findOne({ qrId, token, usado: false });
  if (!tokenData) return res.status(400).json({ message: "Token inválido o ya usado" });

  tokenData.usado = true;
  await tokenData.save();

  let usuario = await User.findOne({ dispositivoId });
  if (!usuario) {
    usuario = await User.create({ dispositivoId, qr_escaneados: [], puntos: 0 });
  }

  if (usuario.qr_escaneados.includes(qrId)) {
    return res.json({ message: "¡Este ya lo has escaneado!", puntos: usuario.puntos });
  }

  usuario.qr_escaneados.push(qrId);
  usuario.puntos += 1;
  await usuario.save();

  res.json({ message: `¡Enhorabuena! Has escaneado el QR: ${qrId}`, puntos: usuario.puntos });
});

module.exports = router;
