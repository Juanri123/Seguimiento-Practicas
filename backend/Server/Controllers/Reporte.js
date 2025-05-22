const Reporte = require('../Models/Reporte');
const Notificacion = require('../Models/Notificacion');
const Usuario = require('../Models/Usuario');

exports.crearReporte = async (req, res) => {
  try {
    const { id_usuario, nombre, motivo } = req.body
    const currentDate = new Date().toISOString().split('T')[0]

    // Validar que el instructor exista
    const instructor = await Usuario.findByPk(id_usuario)
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado' })
    }

    // Crear el reporte
    const nuevoReporte = await Reporte.create({
      id_usuario,
      fecha: currentDate,
      nombre,
      motivo,
      estado: 'pendiente'
    })

    // Buscar todos los aprendices
    const aprendices = await Usuario.findAll({ where: { rol: 'aprendiz' } })

    // Crear notificación para cada aprendiz
    for (const aprendiz of aprendices) {
      await Notificacion.create({
        mensaje: `El instructor ${instructor.nombres} ${instructor.apellidos} ha subido un nuevo reporte.`,
        id_usuario: aprendiz.id,
        tipo: 'reporte',
        estado: 'pendiente'
      })
    }

    res.status(201).json({ nuevoReporte })
  } catch (error) {
    console.error('Error al crear el reporte o las notificaciones:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.verReportePorId = async (req, res) => {
	try {
		const { id } = req.params
		const reporte = await Reporte.findByPk(id)
		if (!reporte) {
			return res.status(404).json({ message: 'El reporte no existe' })
		}
		res.status(200).json({ reporte })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

exports.verReportes = async (req, res) => {
	try {
		const pagina = parseInt(req.query.pagina) || 1
		const limite = parseInt(req.query.limite) || 6
		const offset = (pagina - 1) *limite

		const {count, rows} = await Reporte.findAndCountAll({
			limit: limite,
			offset: offset,
		})

		if (count === 0) {
			return res.status(404).json({ mensaje: 'No existen reportes por el momento.' })
		}

		res.status(200).json({
			reportes: rows,
			totalPaginas: Math.ceil(count / limite),
			paginaActual: pagina,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}


exports.eliminarReporte = async (req, res) => {
	try {
		const { id } = req.params
		const reporte = await Reporte.findByPk(id)
		if (!reporte) {
			return res.status(404).json({ message: 'El reporte no existe' })
		}
		await reporte.destroy()
		res.status(200).json({ message: 'Reporte eliminado' })
		console.log(res)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

exports.actualizarReporte = async (req, res) => {
	try {
		const { id } = req.params
		const { id_usuario, nombre, motivo } = req.body
		const reporte = await Reporte.findByPk(id)
		if (!reporte) {
			return res.status(404).json({ message: 'El reporte no exite' })
		}
		await reporte.update({ id_usuario, nombre, motivo })
		res.status(200).json({ message: 'Reporte actualizado' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}