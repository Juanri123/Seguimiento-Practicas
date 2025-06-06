const express = require("express");
const sequelize = require("./Config/db.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const indexRoutes = require("./Routes/index.routes.js");

// Importar y ejecutar asociaciones entre modelos
require("./Models/Asociaciones");

const app = express();

// Conexión a la base de datos
async function connectDB() {
  try {
    await sequelize.sync({ force: false });
    console.log("Base de datos sincronizada");
  } catch (error) {
    console.log("Error al sincronizar base de datos:", error.message);
  }
}
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:3001" })); // Cambia si usas otro frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Servir archivos estáticos correctamente desde /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas de API
app.use("/api", indexRoutes);

// Puerto del servidor
const port = 3000;
app.listen(port, () => {
  console.log("Servidor conectado en http://localhost:" + port);
});
