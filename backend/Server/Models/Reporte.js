const { DataTypes } = require('sequelize')
const Sequelize = require('../Config/db.js')

const Reporte = Sequelize.define(
	'Reporte',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		nombre: {
			type: DataTypes.STRING(45),
			allowNull: false,
			validate: {
				len: [3, 45]
			}
		},
		estado: {
			type: DataTypes.STRING(20),
			defaultValue: 'Pendiente',
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		archivo: {
			type: DataTypes.STRING(150),
			allowNull: false,
			validate: {
				isUrl: true,
				notEmpty: true
			}
		},
		fecha: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				isDate: true,
				notEmpty: true
			}
		},
		id_usuario: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: 'usuario',
				key: 'id'
			},
			validate: {
				isInt: true,
				min: 1,
				notEmpty: true
			}
		}
	},
	{
		tableName: 'reporte',
		timestamps: false
	}
)

module.exports = Reporte