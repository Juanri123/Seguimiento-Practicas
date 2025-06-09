const Visita = require('../Models/Visita')
const Notificacion = require('../Models/Notificacion')
const Usuario = require('../Models/Usuario')

exports.crearVisita = async (req, res) => {
	try {
		const { direccion, tipo, fecha, hora, aprendiz_id } = req.body

		if (!direccion || !tipo || !fecha || !hora || !aprendiz_id) {
			return res
				.status(400)
				.json({ message: 'Todos los campos son obligatorios.' })
		}

		const nuevaVisita = await Visita.create({
			direccion,
			tipo,
			fecha,
			hora,
			estado: 'pendiente',
			aprendiz_id
		})

		const aprendiz = await Usuario.findByPk(aprendiz_id)
		if (!aprendiz) {
			return res.status(404).json({ message: 'Aprendiz no encontrado' })
		}

		const nombreAprendiz = aprendiz.nombres
		const apellidoAprendiz = aprendiz.apellidos

		const instructores = await Usuario.findAll({ where: { rol: 'instructor' } })

		for (const instructor of instructores) {
			await Notificacion.create({
				mensaje: `Nuevo agendamiento de visita por el aprendiz: ${nombreAprendiz} ${apellidoAprendiz}`,
				id_usuario: instructor.id,
				tipo: 'visita'
			})
		}

		res.status(201).json({ nuevaVisita })
	} catch (error) {
		res.status(500).json({
			error: {
				message: error.message || 'Error al crear la visita',
				stack: error.stack
			}
		})
	}
}

exports.verVisitaPorId = async (req, res) => {
	try {
		const { id } = req.params
		const visita = await Visita.findByPk(id)

		if (!visita) {
			return res.status(404).json({ error: 'La visita no existe' })
		}

		res.status(200).json({ visita })
	} catch (error) {
		res.status(500).json({
			error: {
				message: error.message || 'Error al obtener la visita',
				stack: error.stack
			}
		})
	}
}

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
      include: [
        {
          model: Usuario,
          as: 'aprendiz',
          attributes: ['id', 'nombres', 'apellidos'],
        },
      ],
    });

    // Log para verificar que la relación aprendiz esté cargada
    console.log(rows.map(v => ({
      id: v.id,
      fecha: v.fecha,
      aprendiz: v.aprendiz ? { nombres: v.aprendiz.nombres, apellidos: v.aprendiz.apellidos } : null
    })));

    res.status(200).json({
      visitas: rows,
    });
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res
      .status(500)
      .json({ error: 'Error interno del servidor', details: error.message });
  }
};


exports.actualizarVisita = async (req, res) => {
	try {
		const { id } = req.params
		const { direccion, tipo, fecha, hora } = req.body

		// Validación de campos
		if (!direccion || !tipo || !fecha || !hora) {
			return res.status(400).json({ error: 'Faltan campos obligatorios' })
		}

		const visita = await Visita.findByPk(id)
		if (!visita) {
			return res.status(404).json({ error: 'La visita no existe' })
		}

		await visita.update({ direccion, tipo, fecha, hora })
		res.status(200).json({ message: 'Visita actualizada' })
	} catch (error) {
		res.status(500).json({
			error: {
				message: error.message || 'Error al actualizar la visita',
				stack: error.stack
			}
		})
	}
}

exports.eliminarVisita = async (req, res) => {
	try {
		const { id } = req.params
		const visita = await Visita.findByPk(id)

		if (!visita) {
			return res.status(404).json({ error: 'La visita no existe' })
		}

		await visita.destroy()
		res.status(204).json({ message: 'Visita eliminada' })
	} catch (error) {
		res.status(500).json({
			error: {
				message: error.message || 'Error al eliminar la visita',
				stack: error.stack
			}
		})
	}
}

exports.aceptarVisita = async (req, res) => {
	try {
		const visita = await Visita.findByPk(req.params.id)
		if (!visita)
			return res.status(404).json({ message: 'Visita no encontrada' })

		visita.estado = 'aceptada'
		await visita.save()
		res.status(200).json({ message: 'Visita aceptada' })
	} catch (err) {
		res.status(500).json({
			error: {
				message: 'Error al aceptar la visita',
				stack: err.stack
			}
		})
	}
}

exports.rechazarVisita = async (req, res) => {
	const { id } = req.params
	const { motivo } = req.body

	try {
		// Obtener la visita
		const visita = await Visita.findByPk(id)
		if (!visita)
			return res.status(404).json({ message: 'Visita no encontrada' })

		// Actualizar estado de la visita a 'rechazada' y guardar el motivo
		visita.estado = 'rechazada'
		visita.motivo = motivo
		await visita.save()

		// Formatear la fecha
		const fechaFormateada = visita.fecha.toISOString().split('T')[0] // 'YYYY-MM-DD'

		// Crear la notificación para el aprendiz
		const mensaje = `Tu visita del ${fechaFormateada} fue rechazada. Motivo: ${motivo}`
		const id_usuario = visita.aprendiz_id // Obtener el ID del aprendiz asociado a la visita

		const nuevaNotificacion = await Notificacion.create({
			mensaje,
			id_usuario,
			estado: 'pendiente' // Estado inicial
		})

		res
			.status(200)
			.json({
				message: 'Visita rechazada con motivo y notificación creada',
				data: nuevaNotificacion
			})
	} catch (error) {
		console.error('Error al rechazar visita:', error)
		res.status(500).json({
			error: {
				message: 'Error al rechazar la visita',
				stack: error.stack
			}
		})
	}
}