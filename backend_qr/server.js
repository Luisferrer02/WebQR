require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//Arreglar variables de entorno y poner las correctas sobre el despliegue y el mongo tambien. Localhost, puertos, mongoatlas, etc. Nuevo cluster. Diseño de app, pantallas de carga y confirmacion y etc, que no pase como en el de restaurantes que se pasa un rato cargando

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error conectando a MongoDB:", err));

// Importar rutas
const qrRoutes = require("./routes/qrRoutes");
app.use("/api", qrRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
