const { DataTypes } = require('sequelize');
const Sequelize = require('../Config/db.js');

const Visita = Sequelize.define(
  'Visita',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente",
      validate: {
        isIn: [['pendiente', 'confirmada', 'rechazada']],
      },
    },
    motivo: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    aprendiz_id: {  // 👈🏼 este es el nuevo campo que debes agregar
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'visita',
    timestamps: false,
  }
);

module.exports = Visita;
