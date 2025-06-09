const { DataTypes } = require('sequelize')
const Sequelize = require('../Config/db')

const Ficha = Sequelize.define(
	'Ficha',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		codigo: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			unique: true,
			validate: {
				isInt: true,
				min: 1,
				notEmpty: true
			}
		},
		programa: {
			type: DataTypes.STRING(100),
			allowNull: false,
			validate: {
				len: [4, 100],
				notEmpty: true
			}
		}
	},
	{
		tableName: 'ficha',
		timestamps: false
	}
)

module.exports = Ficha