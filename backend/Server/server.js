const express = require('express');
const sequelize = require('./Config/db.js');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const indexRoutes = require('./Routes/index.routes.js');
const authRoutes = require("./Routes/authRutas.js");

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
dotenv.config();
const app = express();

app
//Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Agregar rutas
//app.use('/routes',routes);
app.use('/api', indexRoutes);
app.use("/api/auth",authRoutes)

//Puerto del servidor
const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log('Se realizo la conexion en el puerto', port)
});


