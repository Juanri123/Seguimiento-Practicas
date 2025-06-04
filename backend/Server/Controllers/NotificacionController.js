const Notificacion = require('../Models/Notificacion');

// Crear notificación
exports.crearNotificacion = async (req, res) => {
  const { mensaje, id_usuario, estado = 'pendiente' } = req.body;

  if (!mensaje || !id_usuario) {
    return res.status(400).json({ message: 'Los campos mensaje e id_usuario son obligatorios.' });
  }

  try {
    const nuevaNotificacion = await Notificacion.create({
      mensaje,
      id_usuario,
      estado,
    });

    res.status(201).json({
      message: 'Notificación creada con éxito',
      data: nuevaNotificacion
    });
  } catch (error) {
    console.error("Error al crear la notificación:", error);
    res.status(500).json({ message: 'Error al crear la notificación', error: error.message || error });
  }
};

// Obtener notificaciones por usuario
exports.obtenerNotificaciones = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const notificaciones = await Notificacion.findAll({
      where: { id_usuario },
      order: [['id', 'DESC']]
    });

    res.status(200).json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ message: 'Error al obtener las notificaciones', error: error.message || error });
  }
};

// Marcar como leída
exports.actualizarEstadoNotificacion = async (req, res) => {
  const { id } = req.params;

  try {
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    notificacion.estado = 'leida';
    await notificacion.save();

    res.status(200).json({
      message: 'Estado actualizado a leída',
      data: notificacion
    });
  } catch (error) {
    console.error("Error al actualizar notificación:", error);
    res.status(500).json({ message: 'Error al actualizar el estado', error: error.message || error });
  }
};

// Eliminar notificación
exports.eliminarNotificacion = async (req, res) => {
  const { id } = req.params;

  try {
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notificacion.destroy();
    res.status(200).json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
};
