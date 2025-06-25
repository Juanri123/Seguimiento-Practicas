// /Server/Middlewares/uploadMiddleware.js
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadPath = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, { recursive: true })
}

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

const fileFilter = (req, file, cb) => {
	const ext = path.extname(file.originalname).toLowerCase()
	const allowed = ['.jpeg', '.jpg', '.png', '.pdf', '.doc', '.docx', '.txt']
	if (allowed.includes(ext)) {
		cb(null, true)
	} else {
		cb(new Error('Tipo de archivo no permitido. Solo PDF, imágenes o documentos.'))
	}
}

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter
})

module.exports = upload
