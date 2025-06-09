const Bitacoras = require('../Models/Bitacora');
const Notificacion = require('../Models/Notificacion');
const Usuario = require('../Models/Usuario');


// Obtener todas las bitácoras
exports.getAllBitacoras = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 6;
    const offset = (pagina - 1) * limite;
    const { usuarioId } = req.query;

    const where = {};
    if (usuarioId) {
      where.aprendiz_id = usuarioId;
    }

    const { count, rows } = await Bitacoras.findAndCountAll({
      where,
      offset,
      limit: limite,
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
    console.log(rows.map(b => ({
      id: b.id,
      fecha: b.fecha,
      aprendiz: b.aprendiz ? { nombres: b.aprendiz.nombres, apellidos: b.aprendiz.apellidos } : null
    })));

    const totalPaginas = Math.ceil(count / limite);

    res.status(200).json({
      bitacoras: rows,
      totalPaginas,
    });
  } catch (error) {
    console.error('Error en getAllBitacoras:', error);
    res.status(500).json({ error: error.message });
  }
};



// Obtener una bitácora por ID
exports.getBitacoraById = async (req, res) => {
    try {
        const { id } = req.params;
        const bitacora = await Bitacoras.findByPk(id);
        if (!bitacora) {
            return res.status(404).json({ error: 'Bitácora no encontrada' });
        }
        res.status(200).json(bitacora);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la bitácora' });
    }
};

exports.createBitacora = async (req, res) => {
  try {
    const { aprendiz_id, fecha } = req.body;
    const archivo = req.file?.filename;

    if (!aprendiz_id || !fecha || !archivo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Crear la bitácora  
    const nuevaBitacora = await Bitacoras.create({
      aprendiz_id,
      fecha,
      archivo,
    });

    // Buscar aprendiz
    const aprendiz = await Usuario.findByPk(aprendiz_id);
    if (!aprendiz) {
      return res.status(404).json({ message: 'Aprendiz no encontrado' });
    }

    const nombreAprendiz = aprendiz.nombres;
    const apellidoAprendiz = aprendiz.apellidos;

    // Buscar todos los instructores
    const instructores = await Usuario.findAll({ where: { rol: 'instructor' } });

    // Crear una notificación para cada instructor
    for (const instructor of instructores) {
      await Notificacion.create({
        mensaje: `El aprendiz ${nombreAprendiz} ${apellidoAprendiz} ha subido una nueva bitácora`,
        id_usuario: instructor.id,
        tipo: 'bitacora'
      });
    }

    res.status(201).json({ bitacora: nuevaBitacora });

  } catch (error) {
    console.error('Error al crear la bitácora:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la bitácora' });
  }
};


// Actualizar una bitácora
exports.updateBitacora = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_bitacora, numero_bitacora } = req.body;
        const archivo = req.file ? req.file.filename : null;

        const bitacora = await Bitacoras.findByPk(id);
        if (!bitacora) {
            return res.status(404).json({ error: 'Bitácora no encontrada' });
        }

        await bitacora.update({ nombre_bitacora, numero_bitacora, archivo });

        res.status(200).json(bitacora);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la bitácora' });
    }
};

exports.aceptarBitacora = async (req, res) => {
    const { id } = req.params;

    try {
        const bitacora = await Bitacoras.findByPk(id);

        if (!bitacora) {
            return res.status(404).json({ error: 'Bitácora no encontrada' });
        }

        bitacora.estado = 'aceptada';
        bitacora.motivo = null; // limpia motivo si había uno anterior
        await bitacora.save();

        res.status(200).json({ mensaje: 'Bitácora aceptada con éxito', bitacora });
    } catch (error) {
        console.error('Error al aceptar bitácora:', error);
        res.status(500).json({ error: 'Error al aceptar la bitácora' });
    }
};

exports.rechazarBitacora = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  try {
    const bitacora = await Bitacoras.findByPk(id);
    if (!bitacora) return res.status(404).json({ message: "Bitacora no encontrada" });

    bitacora.estado = "rechazada";
    bitacora.motivo = motivo;
    await bitacora.save();

    // Corregido: convertir a Date antes de formatear
    const fecha = new Date(bitacora.fecha);
    const fechaFormateada = fecha.toISOString().split("T")[0];

    const mensaje = `Tu bitacora del ${fechaFormateada} fue rechazada. Motivo: ${motivo}`;
    const id_usuario = bitacora.aprendiz_id;

    const nuevaNotificacion = await Notificacion.create({
      mensaje,
      id_usuario,
      estado: "pendiente",
    });

    res.status(200).json({
      message: "Bitacora rechazada con motivo y notificación creada",
      data: nuevaNotificacion
    });

  } catch (error) {
    console.error("Error al rechazar bitacora:", error);
    res.status(500).json({
      error: {
        message: 'Error al rechazar la bitacora',
        stack: error.stack,
      }
    });
  }
};

// Eliminar una bitácora
exports.deleteBitacora = async (req, res) => {
    try {
        const { id } = req.params;

        const bitacora = await Bitacoras.findByPk(id);
        if (!bitacora) {
            return res.status(404).json({ error: 'Bitácora no encontrada' });
        }

        await bitacora.destroy();
        res.status(200).json({ message: 'Bitácora eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la bitácora' });
    }
};