const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const Reporte = require('../Controllers/Reporte');

router.get('/verReportes', Reporte.verReportes);
router.get('/:id', Reporte.verReportePorId);
router.post('/', upload.single('archivo'), Reporte.crearReporte);
router.post('/', Reporte.crearReporte);
router.put('/:id', Reporte.actualizarReporte);
router.delete('/:id', Reporte.eliminarReporte);

module.exports = router;
