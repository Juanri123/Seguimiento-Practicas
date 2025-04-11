require("dotenv").config();
const Usuario = require("../Models/Usuario.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../Config/nodemailer");

// ==============================
// Forgot Password
// ==============================
const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ message: "El correo es obligatorio." });
    }

    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:3001/reset-password/${token}`;
    console.log("Enlace de restablecimiento generado:", resetLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: usuario.correo,
      subject: "Restablecer contraseña",
      html: `
        <h2>Solicitud de restablecimiento de contraseña</h2>
        <p>Haz clic en el enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ error: "Error al enviar el correo" });
      }
      console.log("Correo enviado:", info.response);
      res.json({ message: "Correo enviado, revisa tu bandeja" });
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};

// ==============================
// Reset Password
// ==============================
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token no válido o expirado." });
  }

  if (!password) {
    return res.status(400).json({ message: "La nueva contraseña es obligatoria." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded); // Solo si estás en modo debug

    const userId = decoded.id;

    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.contraseña = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error al procesar la solicitud." });
  }
};
// ==============================
// Login
// ==============================
const login = async (req, res) => {
  try {
    const { tipoCuenta, documento, password } = req.body;

    // Validar datos obligatorios
    if (!documento || !password || !tipoCuenta) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const usuario = await Usuario.findOne({ where: { identificacion: documento.trim() } });

    if (!usuario) {
      return res.status(404).json({ message: "El usuario no está registrado" });
    }

    if (usuario.rol?.trim().toLowerCase() !== tipoCuenta.trim().toLowerCase()) {
      return res.status(403).json({ message: "El tipo de cuenta no coincide con el rol del usuario." });
    }

    const validarPassword = await bcrypt.compare(password.trim(), usuario.contraseña);
    if (!validarPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        identificacion: usuario.identificacion,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  login
};
