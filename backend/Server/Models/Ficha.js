const { DataTypes } = require('sequelize');
const Sequelize = require('../Config/db');

const Ficha = Sequelize.define('Ficha', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
    unique: true
  },
  programa: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
    tableName: 'ficha',
    timestamps: false,
});

module.exports = Ficha;
