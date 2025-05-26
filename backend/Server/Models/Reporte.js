const { DataTypes } = require('sequelize')
const Sequelize = require('../Config/db.js')

const Reporte = Sequelize.define(
	'Reporte',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		id_usuario: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			validate: {
				isInt: true
			}
		},
		fecha: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				isDate: true
			}
		},
		nombre: {
			type: DataTypes.STRING(45),
			allowNull: false,
			validate: {
				len: [3, 45]
			}
		},
		motivo: {
			type: DataTypes.STRING(255),
			allowNull: true,
			validate: {
				len: [0, 255]
			}
		},
		estado: {
			type: DataTypes.STRING,
			defaultValue: 'Pendiente'
		},
		archivo: {
			type: DataTypes.STRING,
			allowNull: false
		},
	},
	{
		tableName: 'reporte',
		timestamps: false
	}
)

module.exports = Reporte