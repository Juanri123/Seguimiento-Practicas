const Visita = require('../Models/Visita');
const Notificacion = require('../Models/Notificacion');
const Usuario = require('../Models/Usuario');

exports.crearVisita = async (req, res) => {
  try {
    console.log("Datos recibidos en POST:", req.body);
    const { direccion, tipo, fecha, hora, aprendiz_id } = req.body;

    if (!direccion || !tipo || !fecha || !hora || !aprendiz_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el aprendiz existe
    const aprendiz = await Usuario.findByPk(aprendiz_id);
    if (!aprendiz) {
      return res.status(404).json({ message: 'Aprendiz no encontrado' });
    }

    const nuevaVisita = await Visita.create({
      direccion,
      tipo,
      fecha,
      hora,
      estado: 'pendiente',
      aprendiz_id
    });

    console.log("Visita creada:", nuevaVisita?.dataValues);

    // Notificar a todos los instructores
    const instructores = await Usuario.findAll({ where: { rol: 'instructor' } });
    for (const instructor of instructores) {
      await Notificacion.create({
        mensaje: `Nuevo agendamiento de visita por el aprendiz: ${aprendiz.nombres} ${aprendiz.apellidos}`,
        id_usuario: instructor.id,
        tipo: 'visita',
        estado: 'pendiente'
      });
    }

    res.status(201).json({ nuevaVisita });
  } catch (error) {
    console.error("Error al crear visita:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.verVisitaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const visita = await Visita.findByPk(id);

    if (!visita) {
      return res.status(404).json({ error: 'La visita no existe' });
    }

    res.status(200).json({ visita });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message || 'Error al obtener la visita',
        stack: error.stack
      }
    });
  }
};

exports.verVisitas = async (req, res) => {
  try {
    const { usuarioId } = req.query;
    const where = {};

    if (usuarioId) {
      where.aprendiz_id = usuarioId;
    }

    const { count, rows } = await Visita.findAndCountAll({
      where,
      order: [['fecha', 'DESC']],
      include: [{
        model: Usuario,
        as: 'aprendiz',
        attributes: ['id', 'nombres', 'apellidos']
      }],
    });

    res.status(200).json({ visitas: rows });
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

exports.actualizarVisita = async (req, res) => {
  try {
    console.log("Datos recibidos en PUT:", req.body);
    const { id } = req.params;
    const { direccion, tipo, fecha, hora } = req.body;

    if (!direccion || !tipo || !fecha || !hora) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({ message: 'La visita no existe' });
    }

    await visita.update({ direccion, tipo, fecha, hora });
    res.status(200).json({ message: 'Visita actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar visita:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const visita = await Visita.findByPk(id);

    if (!visita) {
      return res.status(404).json({ error: 'La visita no existe' });
    }

    await visita.destroy();
    res.status(204).json({ message: 'Visita eliminada' });
  } catch (error) {
    console.error('Error al eliminar visita:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.aceptarVisita = async (req, res) => {
  try {
    const visita = await Visita.findByPk(req.params.id);
    if (!visita) {
      return res.status(404).json({ message: 'Visita no encontrada' });
    }

    visita.estado = 'aceptada';
    await visita.save();
    res.status(200).json({ message: 'Visita aceptada' });
  } catch (err) {
    res.status(500).json({
      error: {
        message: 'Error al aceptar la visita',
        stack: err.stack
      }
    });
  }
};

exports.rechazarVisita = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  try {
    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({ message: 'Visita no encontrada' });
    }

    visita.estado = 'rechazada';
    visita.motivo = motivo;
    await visita.save();

    const fechaFormateada = new Date(visita.fecha).toISOString().split('T')[0];


    const mensaje = `Tu visita del ${fechaFormateada} fue rechazada. Motivo: ${motivo}`;
    const id_usuario = visita.aprendiz_id;

    const nuevaNotificacion = await Notificacion.create({
      mensaje,
      id_usuario,
      estado: 'pendiente',
      tipo: 'visita'
    });

    res.status(200).json({
      message: 'Visita rechazada con motivo y notificación creada',
      data: nuevaNotificacion
    });
  } catch (error) {
    console.error('Error al rechazar visita:', error);
    res.status(500).json({
      error: {
        message: 'Error al rechazar la visita',
        stack: error.stack
      }
    });
  }
};
