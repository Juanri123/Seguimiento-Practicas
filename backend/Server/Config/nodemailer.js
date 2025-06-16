// Config/nodemailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();  // Asegúrate de cargar las variables de entorno

// Crear el transportador con la configuración de tu proveedor de correo
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


module.exports = transporter;
