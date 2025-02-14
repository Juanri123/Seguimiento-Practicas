const Aprendiz = require('../Models/aprendicesModel');

//Crear un nuevo aprendiz
exports.Crearaprendiz = async (req, res) => {
    try {
        const { id_usuario, id_empresa, id_reporte } = req.body;
        const nuevoAprendiz = await Aprendiz.create({ id_usuario, id_empresa, id_reporte });
        res.status(201).json(nuevoAprendiz);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
//Obtener todos los aprendices
exports.Obteneraprendices = async (req, res) => {
    try {
        const aprendices = await Aprendiz.findAll();
        // Verificar si hay aprendices
        if (!aprendices) {
            return res.status(404).json({ message: 'No se encontraron aprendices' })
        }
        res.status(200).json(aprendices);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

//Obtener aprendices sacando a los inactivos
exports.Obteneraprendices = async (req, res) =>{
    try{
        let{page, size} = req.query;
        page = page ? parseInt(page): 1;
        sizw = sixze? parseInt(size):10;
        const offset = (page - 1) * size;
        const limit = size;

        const aprendices = await Aprendiz.findAndCountAll({
            where:{activo: true},//Para filtrar a los activos
            limit,
            offset
        });
        res.status(200).json({
            total:aprendices.count,
            totalPages:Math.ceil(aprendixces.count / size),
            data:aprendices.rows
        });
    }catch(error){
        res.status(500).json({error: error.message});
    }
}
//Obtener aprendices con ID
exports.ObteneraprendicesID = async (req, res) => {
    try {
        const { id } = req.params;
        const aprendiz = await Aprendiz.findByPk(id);
        if (!aprendiz) {
            return res.status(404).json({ message: 'Aprendiz no encontrado' });
        }
        res.status(200).json(aprendiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//Actualizar aprendices
exports.ActualizaraprendizID = async(req, res) => {
    try{
        const [filasActualizadas] = await Aprendiz.update(req.body,
            {where: {id: req.params.id}
        }); if (!filasActualizadas)

            return res.status(404).json ({ error: 'Aprendiz no encontrado'});

            res.status(200).json({message: 'Aprendiz Actualizado'});
    }catch (error){
        res.status(500).json({error:error.message})
    }

};

// Eliminar Aprendiz por ID
exports.EliminaraprendizID = async (req, res) => {
    try {
        const filasEliminadas = await Aprendiz.destroy({
            where: { id: req.params.id }
        });

        if (!filasEliminadas) {
            return res.status(404).json({ error: 'Aprendiz no encontrado' });
        }

        return res.json({ mensaje: "Aprendiz eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//Elimnar  desactivar aprendiz
exports.EliminaraprendizID = async (req, res) => {
    try{
        const aprendiz = await Aprendiz.findByPk(req.params.id);
        if(!aprendiz)
        return res.status(404).json({error: 'Aprendiz no encontrado'});
        aprendiz.actico = false;
        await aprendiz.save();

        res.status(200).json({message: 'Aprendiz marcado como inactivo'});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}
