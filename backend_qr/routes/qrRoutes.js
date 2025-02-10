const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

// 🔹 GET: Estado del servidor
router.get("/", (req, res) => {
  res.json({ message: "Servidor Backend QR funcionando correctamente 🚀" });
});

// 🔹 GET: Obtener todos los usuarios (para testeo)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
});

// 🔹 GET: Obtener un usuario por dispositivoId
router.get("/user/:dispositivoId", async (req, res) => {
  try {
    const user = await User.findOne({ dispositivoId: req.params.dispositivoId });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
});

// 🔹 GET: Obtener todos los tokens generados
router.get("/tokens", async (req, res) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo tokens" });
  }
});

// 🔹 POST: Generar QR con token único
router.post("/generate-qr", async (req, res) => {
  const { qrId } = req.body;
  const token = crypto.randomBytes(16).toString("hex");

  await Token.create({ qrId, token });

  const qrUrl = `${process.env.FRONTEND_URL}/scan?id=${qrId}&token=${token}`;

  QRCode.toDataURL(qrUrl, (err, qrImage) => {
    if (err) return res.status(500).json({ message: "Error generando QR" });
    res.json({ qrUrl, qrImage });
  });
});

// 🔹 POST: Escaneo de QR
router.post("/scan", async (req, res) => {
  const { id: qrId, token, dispositivoId } = req.body;

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
