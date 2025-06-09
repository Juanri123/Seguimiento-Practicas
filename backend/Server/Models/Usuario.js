const { DataTypes } = require('sequelize')
const Sequelize = require('../Config/db.js')

// Modelo de usuarios (base para aprendices e instructores)
const Usuario = Sequelize.define(
	'Usuario',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		nombres: {
			type: DataTypes.STRING(65),
			allowNull: false,
			validate: {
				len: [3, 65],
				notEmpty: true
			}
		},
		apellidos: {
			type: DataTypes.STRING(65),
			allowNull: false,
			validate: {
				len: [3, 65],
				notEmpty: true
			}
		},
		identificacion: {
			type: DataTypes.STRING(20),
			allowNull: true,
			validate: {
				isAlphanumeric: true,
				len: [5, 20],
				notEmpty: true
			}
		},
		correo: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				notEmpty: true
			}
		},
		rol: {
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [['aprendiz', 'instructor']]
			}
		},
		clave: {
			type: DataTypes.STRING(60),
			allowNull: false,
			validate: {
				len: [6, 60],
				notEmpty: true
			}
		},
		ficha: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			validate: {
				isInt: true,
				notEmpty: false
			}
		}
	},
	{
		tableName: 'usuario',
		timestamps: false
	}
)

module.exports = Usuario