const express = require('express');
const router = express.Router();
const NotificacionController = require('../Controllers/NotificacionController');

// Crear
router.post('/', NotificacionController.crearNotificacion);

// Obtener por usuario
router.get('/usuario/:id_usuario', NotificacionController.obtenerNotificaciones);

// Marcar como leída
router.put('/:id', NotificacionController.actualizarEstadoNotificacion);

// Eliminar
router.delete('/:id', NotificacionController.eliminarNotificacion);

router.delete('/usuario/:id_usuario', NotificacionController.eliminarTodasNotificacionesUsuario);

module.exports = router;
