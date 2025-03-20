const { DataTypes } = require('sequelize');
const Sequelize = require('../Config/db.js');

const Reporte = Sequelize.define(
  'Reporte',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      validate: {
        isInt: true,
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0],
      },
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        len: [3, 45],
      },
    },
  },
  {
    tableName: 'reporte',
    timestamps: false,
  }
);

module.exports = Reporte;
