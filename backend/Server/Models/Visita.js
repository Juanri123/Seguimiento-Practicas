const { DataTypes } = require('sequelize')
const Sequelize = require('../Config/db.js')

const Visita = Sequelize.define(
	'Visita',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		direccion: {
			type: DataTypes.STRING(150),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		tipo: {
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		fecha: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isDate: true,
				notEmpty: true
			}
		},
		hora: {
			type: DataTypes.TIME,
			allowNull: false,
			validate: {
				notEmpty: true,
				isTime: true
			}
		},
		estado: {
			type: DataTypes.STRING(20),
			defaultValue: 'pendiente',
			validate: {
				isIn: [['pendiente', 'confirmada', 'rechazada']]
			}
		},
		motivo: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		aprendiz_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	},
	{
		tableName: 'visita',
		timestamps: false
	}
)

module.exports = Visita