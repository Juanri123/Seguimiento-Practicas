// Models/Bitacoras.js
const { DataTypes } = require('sequelize')
const sequelize = require('../Config/db.js')

const Bitacoras = sequelize.define(
	'Bitacoras',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		motivo: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		estado: {
			type: DataTypes.STRING(20),
			defaultValue: 'pendiente',
			allowNull: false,
			validate: {
				isIn: [['pendiente', 'aceptada', 'rechazada']],
				notEmpty: true
			}
		},
		archivo: {
			type: DataTypes.STRING(150),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		fecha: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		aprendiz_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	},
	{
		tableName: 'bitacora',
		timestamps: false
	}
)

module.exports = Bitacoras