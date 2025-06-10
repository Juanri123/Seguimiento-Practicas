const { DataTypes } = require('sequelize');
const Sequelize = require('../Config/db.js');

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
				notEmpty: { msg: 'La dirección no puede estar vacía' }
			}
		},
		tipo: {
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				notEmpty: { msg: 'El tipo no puede estar vacío' }
			}
		},
		fecha: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				isDate: { msg: 'La fecha debe ser válida' },
				notEmpty: { msg: 'La fecha no puede estar vacía' }
			}
		},
		hora: {
			type: DataTypes.TIME,
			allowNull: false,
			validate: {
				notEmpty: { msg: 'La hora no puede estar vacía' }
			}
		},
		estado: {
			type: DataTypes.STRING(20),
			allowNull: false,
			defaultValue: 'pendiente',
			validate: {
				isIn: {
					args: [['pendiente', 'aceptada', 'rechazada']],
					msg: 'El estado debe ser pendiente, aceptada o rechazada'
				}
			}
		},
		motivo: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		aprendiz_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			validate: {
				isInt: { msg: 'El ID del aprendiz debe ser un número entero' },
				min: 1
			}
		}
	},
	{
		tableName: 'visita',
		timestamps: false
	}
);

module.exports = Visita;
