const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

// 🔹 Generar QR con token único
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

// 🔹 Escaneo de QR y validación
router.post("/scan", async (req, res) => {
  const { id: qrId, token, dispositivoId } = req.body;

  // Verificar Referer para evitar accesos manuales
  const referer = req.headers.referer || req.headers.origin;
  if (!referer || !referer.includes("miapp.com")) {
    return res.status(400).json({ message: "Acceso inválido, QR no escaneado correctamente" });
  }

  // Validar User-Agent para asegurarnos de que es un móvil
  const userAgent = req.headers["user-agent"];
  if (!userAgent || (!userAgent.includes("Android") && !userAgent.includes("iPhone"))) {
    return res.status(400).json({ message: "Acceso desde un entorno no permitido" });
  }

  // Validar token
  const tokenData = await Token.findOne({ qrId, token, usado: false });
  if (!tokenData) return res.status(400).json({ message: "Token inválido o ya usado" });

  // Buscar usuario
  let usuario = await User.findOne({ dispositivoId });
  if (!usuario) {
    usuario = await User.create({ dispositivoId, qr_escaneados: [], puntos: 0 });
  }

  // Verificar si ya escaneó este QR
  if (usuario.qr_escaneados.includes(qrId)) {
    return res.json({ message: "¡Este ya lo has escaneado!", puntos: usuario.puntos });
  }

  usuario.qr_escaneados.push(qrId);
  usuario.puntos += 1;
  await usuario.save();

  tokenData.usado = true;
  await tokenData.save();

  res.json({ message: `¡Enhorabuena! Has escaneado el QR: ${qrId}`, puntos: usuario.puntos });
});

module.exports = router;
