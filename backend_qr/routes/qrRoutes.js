const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const User = require("../models/User");
const Token = require("../models/Token");

const router = express.Router();

// 🔹 Escaneo de QR
// 🔹 Escaneo de QR
router.post("/scan", async (req, res) => {
  const { id: qrId, dispositivoId, nombre, apellido } = req.body;

  if (!dispositivoId) {
    return res.status(400).json({ message: "Dispositivo no identificado" });
  }

  // Buscar usuario por dispositivoId
  let usuario = await User.findOne({ dispositivoId });

  if (!usuario) {
    usuario = await User.create({ dispositivoId, nombre, apellido, qr_escaneados: [], puntos: 0 });
    return res.json({ 
      message: `¡Bienvenido! ${nombre ? nombre : "Jugador"} 🎉\nDurante el "Innovation Day" estarán dispersos códigos QR. La universidad realizará un sorteo entre quienes más puntos acumulen.`,
      puntos: usuario.puntos,
      solicitarNombre: !nombre || !apellido
    });
  }

  // Si el usuario ya existe pero no tiene nombre, guardarlo
  if ((!usuario.nombre || !usuario.apellido) && nombre && apellido) {
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    await usuario.save();
  }

  // Verificar si este QR ya ha sido escaneado por este usuario
  if (usuario.qr_escaneados.includes(qrId)) {
    return res.json({ message: "¡Este QR ya lo has escaneado!", puntos: usuario.puntos });
  }

  // Agregar el QR a la lista de escaneados y sumar puntos
  usuario.qr_escaneados.push(qrId);
  usuario.puntos += 1;
  await usuario.save();

  res.json({ 
    message: `¡Has escaneado el QR: ${qrId}!`,
    puntos: usuario.puntos,
    solicitarNombre: !usuario.nombre || !usuario.apellido
  });
});

router.get("/leaderboard", async (req, res) => {
  try {
    // Obtener todos los usuarios ordenados por puntos de mayor a menor
    const usuariosOrdenados = await User.find({ nombre: { $ne: null } })
      .sort({ puntos: -1 });

    if (usuariosOrdenados.length === 0) {
      return res.json([]);
    }

    // Obtener el puntaje más alto registrado
    const maxPuntos = usuariosOrdenados[0].puntos;

    // Filtrar todos los usuarios que tengan puntajes hasta la cantidad máxima
    const leaderboard = usuariosOrdenados.filter(user => user.puntos >= maxPuntos);

    res.json(leaderboard);
  } catch (error) {
    console.error("Error obteniendo el leaderboard:", error);
    res.status(500).json({ error: "Error obteniendo el leaderboard" });
  }
});


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


module.exports = router;
