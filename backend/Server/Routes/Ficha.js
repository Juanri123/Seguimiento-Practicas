const express = require('express');
const router = express.Router();
const fichaController = require('../Controllers/Ficha');

router.post('/', fichaController.crearFicha);

// Obtener todas las fichas (solo códigos y nombre del programa)
router.get('/', fichaController.obtenerFichas);

// Actualizar una ficha por ID
router.put('/:id', fichaController.actualizarFicha);

// Eliminar una ficha por ID
router.delete('/:id', fichaController.eliminarFicha);

// Obtener aprendices de una ficha específica por código
router.get('/:codigo/aprendices', fichaController.obtenerAprendicesPorFicha);

module.exports = router;
