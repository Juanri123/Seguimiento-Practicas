// /Server/Routes/bitacoras.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const bitacorasController = require('../Controllers/BitacorasController');

router.get('/verBitacoras', bitacorasController.getAllBitacoras);
router.get('/:id', bitacorasController.getBitacoraById);
router.post('/', upload.single('archivo'), bitacorasController.createBitacora);
router.put('/:id', upload.single('archivo'), bitacorasController.updateBitacora);
router.put('/rechazar/:id', bitacorasController.rechazarBitacora);
router.put('/aceptar/:id', bitacorasController.aceptarBitacora);
router.delete('/:id', bitacorasController.deleteBitacora);

module.exports = router;
