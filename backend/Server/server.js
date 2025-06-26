const express = require('express')
const sequelize = require('./Config/db.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const multer = require('multer')

// Cargar variables de entorno
dotenv.config()

// Importar rutas
const indexRoutes = require('./Routes/index.routes.js')

// Importar y ejecutar asociaciones entre modelos
require('./Models/Asociaciones')

// Crear una instancia de Express
const app = express()

app.get('/', (req, res) => {
	res.send('Hola, mundo, este es mi back')
})

// Conexión a la base de datos
async function connectDB() {
	try {
		await sequelize.sync({force: false})
		console.log('Base de datos sincronizada')
	} catch (error) {
		console.log('Error al sincronizar base de datos:', error.message)
	}
}
connectDB()

// Middleware de CORS (sin modificar)
app.use(
	cors({
		origin: ['http://localhost:3001'],
		// origin: ['http://seguimiento-practicas.vercel.app'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	})
)
app.options('*', cors())

// Middleware adicional
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas de API
app.use('/api', indexRoutes)

// Middleware de manejo de errores para Multer y otros
app.use((error, req, res, next) => {
	if (
		error instanceof multer.MulterError ||
		error.message.includes('Solo se permiten')
	) {
		return res.status(400).json({message: error.message})
	}
	console.error('Error inesperado:', error)
	res.status(500).json({message: 'Error interno del servidor'})
})

// Puerto del servidor
const port = 3000

// Iniciar el servidor
app.listen(port, () => {
	console.log('Servidor conectado en http://localhost:' + port)
})
