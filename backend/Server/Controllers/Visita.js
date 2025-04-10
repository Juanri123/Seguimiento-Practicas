const Visita = require('../Models/Visita');
const Usuario = require('../Models/Usuario');

exports.crearVisita = async (req, res) => {
  try {
    const { direccion, tipo, fecha } = req.body;
    const nuevaVisita = await Visita.create({ direccion, tipo, fecha });
    res.status(201).json({ nuevaVisita });
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};

exports.verVisitas = async (req, res) => {
  try {
    const visitas = await Visita.findAll({
      include: {
        model: Usuario,
        attributes: ['nombres', 'apellidos'] // trae solo lo necesario
      }
    });

    res.status(200).json({ visitas });
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    res.status(500).json({ error: "Error al obtener visitas" });
  }
};

exports.actualizarVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const { direccion, tipo, fecha } = req.body;
    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({ error: 'La visita no existe' });
    }
    await visita.update({ direccion, tipo, fecha });
    res.status(200).json({ message: 'Visita actualizada' });
  } catch (error) {
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
    res.status(201).json({ message: 'Visita eliminada' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.aceptarVisita = async (req, res) => {
  try {
    const visita = await Visita.findByPk(req.params.id);
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });

    visita.estado = "aceptada";
    await visita.save();
    res.json({ message: "Visita aceptada" });
  } catch (err) {
    res.status(500).json({ error: "Error al aceptar la visita" });
  }
};

exports.rechazarVisita = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  try {
    const visita = await Visita.findByPk(id);
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });

    visita.estado = "rechazada";
    visita.motivo = motivo; // Guardar motivo del rechazo
    await visita.save();

    res.status(200).json({ message: "Visita rechazada con motivo" });
  } catch (error) {
    console.error("Error al rechazar visita:", error);
    res.status(500).json({ message: "Error al rechazar visita" });
  }
};
