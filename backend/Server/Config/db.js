//Configuracion base de datos con un ORM Sequlize
const { Sequelize } = require("sequelize");

//Configurar el Sequelize
const sequelize = new Sequelize('bd_project','root','', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Los logs son mesajes que dicen que esta sucediendo
    //muestran las consultas SQL que el ORM ejecuta
});

//verificar la conexion 
async () => {
  try {
    await sequelize.authenticate(); //Metodo para verificar la conexion
    console.log("La conexion a MySQL con Sequelize exitosa");
  } catch (error) {
    console.log("No se pudo conectar a MySQL:", error.message);
  }
};

module.exports = sequelize;