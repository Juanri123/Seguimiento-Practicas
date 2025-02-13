const express = require('express');
const router = express.Router();
const aprendicesController = require('../Controllers/aprendicesController');

//Rutas

router.post('/aprendices', aprendicesController.Crearaprendiz);//Crear aprendiz
router.get('/aprendices', aprendicesController.Obteneraprendices);//Obtener todos los aprendices
router.get('/aprendices/:id', aprendicesController.ObteneraprendicesID);//Obtener aprendiz por su id
router.put('/aprendices/:id', aprendicesController.ActualizaraprendizID);//Atualiar aprendiz por id
router.delete('/aprendices/:id', aprendicesController.EliminaraprendizID)//Eliminar aprendiz por id
module.exports = router;


//router.get('/aprendices',autentificcion.rol(['Instructor',]), aprendicesController.Obteneraprendices);//Obtener todos los aprendices
