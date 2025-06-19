// /Server/Middlewares/uploadMiddleware.js
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ruta del directorio de carga
const uploadPath = path.join(__dirname, '../uploads')

// Crear el directorio si no existe
if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, {recursive: true})
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadPath)
	},
	filename: function (req, file, cb) {
		const timestamp = Date.now()
		const extension = path.extname(file.originalname)
		cb(null, `${timestamp}${extension}`)
	}
})

// Filtro de tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
	const filetypes = /jpeg|jpg|png|pdf|doc|docx|txt/
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	)
	const mimetype = filetypes.test(file.mimetype)

	if (mimetype && extname) {
		return cb(null, true)
	} else {
		cb(new Error('Solo se permiten archivos válidos: PDF, imágenes o documentos.'))
	}
}

// Middleware de subida
const upload = multer({
	storage,
	limits: {fileSize: 10 * 1024 * 1024}, // 10 MB
	fileFilter
})

module.exports = upload
