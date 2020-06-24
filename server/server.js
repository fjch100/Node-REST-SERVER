/**********************************
 * Archivo para la creacion del servidor de HTTP
 * y conexion a la BD
 * 
 ************************************/

require('./config/config'); //configuraciones
const express = require('express'); //servidor HTTP
const app = express(); //la instancia del servidor HTTP
const mongoose = require('mongoose'); //maneja mongoDB,conexiones,modelos y querys
const bodyParser = require('body-parser'); //convierte el body en JSON
const path = require('path');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//sirve paginas estaticas/assets/imagenes desde el directorio "public"
app.use(express.static(path.resolve(__dirname, '../public')));

//maneja las rutas(como un controlador) para el modelo de usuario(CRUD)
app.use(require('./routes/index'));



//Realiza la conexion a MongoDB / base de datos LOCAL "cafe"
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//Realiza la conexion a MongoAtlas / base de datos PRODUCCION "cafe"
//mongoose.connect('mongodb+srv://cafe-user:cafe1mongodb@cluster0-7npgk.mongodb.net/cafe?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('App Connected to MongoDB ');
});

//Servidor HTTP comienza a escuchar el puerto
app.listen(process.env.PORT, () => { console.log(`Escuchando en el puerto: ${process.env.PORT}`) })