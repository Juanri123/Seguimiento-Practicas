const express = require('express');
const aprendicesRoutes = require('./Routes/aprendicesRutas.js');
const bodyParser = require('body-parser');
const Aprendices = require('./Models/aprendicesModel.js');
const sequelize = require('./Config/db.js')

//Sincronizar con la base de datos
async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.log('Error alsincronizar base de datos', error.message);
    }
};


//Crear el servidor
const app = express();

//Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Agregar rutas
//app.use('/routes',routes);
app.use('/api', aprendicesRoutes);

//Puerto del servidor
const port = 3000;

app.listen(port, () => {
    console.log('Se realizo la conexion en el puerto', port)
});