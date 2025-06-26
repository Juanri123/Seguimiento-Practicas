const Usuario = require('../Models/Usuario')
const Ficha = require('../Models/Ficha')
const bcrypt = require('bcryptjs')

// Crear un usuario (aprendiz o instructor)
exports.crearUsuario = async (req, res) => {
	try {
		const {
			nombres,
			apellidos,
			identificacion,
			correo,
			rol,
			clave,
			ficha: codigoFicha
		} = req.body

		const usuarioExistente = await Usuario.findOne({
			where: { identificacion }
		})
		if (usuarioExistente) {
			return res
				.status(400)
				.json({ message: 'Ya existe un usuario con ese documento.' })
		}	// Validar que no se repita usuario por número de identifcación

		const correoExistente = await Usuario.findOne({ where: { correo } })
		if (correoExistente) {
			return res
				.status(400)
				.json({ message: 'Este correo ya se encuentra registrado' })
		}	// Validar que no se repita usuario por correo electrónico

		// Solo buscar o crear ficha si el rol NO es instructor
		let fichaExistente = null
		if (rol !== 'instructor') {
			if (!codigoFicha) {
				return res
					.status(400)
					.json({ message: 'Código de ficha requerido para este rol' })
			}

			fichaExistente = await Ficha.findOne({ where: { codigo: codigoFicha } })

			if (!fichaExistente) {
				fichaExistente = await Ficha.create({ codigo: codigoFicha })
			}
		}

		// Validar que la contraseña tenga mínimo 8 caracteres 
		if (clave.length < 8) {
			return res
				.status(400)
				.json({ message: 'La contraseña debe tener 8 caracteres como mínimo.' })
		}

		const nuevoUsuario = await Usuario.create({
			nombres,
			apellidos,
			correo,
			rol,
			clave: await bcrypt.hash(clave, 2),
			identificacion,
			ficha: fichaExistente ? fichaExistente.id : null
		})

		res.status(201).json(nuevoUsuario)
	} catch (error) {
		res.status(500).json({ error: 'Error interno del servidor' })
	}
}

// Obtener todos los usuarios (solo aprendices aquí)
exports.obtenerUsuarios = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const offset = (page - 1) * limit

		const { count, rows } = await Usuario.findAndCountAll({
			where: {
				rol: 'aprendiz'
			},
			limit,
			offset
		})

		if (count === 0) {
			return res.status(404).json({ message: 'No hay usuarios registrados' })
		}

		return res.status(200).json({
			usuarios: rows,
			totalUsuarios: count,
			page,
			limit,
			totalPages: Math.ceil(count / limit)
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
	try {
		const { id } = req.params
		const usuario = await Usuario.findByPk(id)

		if (!usuario) {
			return res.status(404).json({ message: 'Usuario no existe' })
		}

		res.status(200).json(usuario)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
	try {
		const { id } = req.params
		let { nombres, apellidos, correo, rol, identificacion, ficha } = req.body

		const usuario = await Usuario.findByPk(id)
		if (!usuario) {
			return res.status(404).json({ message: 'Usuario no encontrado' })
		}

		const haCambiado = (nuevo, actual) => {
			return (
				nuevo !== undefined &&
				nuevo !== actual &&
				(nuevo !== null || actual !== null)
			)
		}

		const verificarCambios =
			haCambiado(nombres, usuario.nombres) ||
			haCambiado(apellidos, usuario.apellidos) ||
			haCambiado(correo, usuario.correo) ||
			haCambiado(identificacion, usuario.identificacion)

		if (!verificarCambios) {
			return res
				.status(400)
				.json({ message: 'Modifique algún campo para actualizar.' })
		}

		await usuario.update({
			nombres,
			apellidos,
			correo,
			rol,
			identificacion,
			ficha
		})

		res.status(200).json({ message: 'Usuario actualizado correctamente' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
	setTimeout(async () => {
		try {
			const { id } = req.params
			const usuario = await Usuario.findByPk(id)
			if (!usuario) {
				return res.status(404).json({ message: 'Usuario no encontrado' })
			}

			await usuario.destroy()
			res.status(200).json({ message: 'usuario eliminado' })
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	}, 400000)
}