require('./config/config');
const express = require('express');
const app = express();
const path = require('path');

// Using Node.js `require()`
const mongoose = require('mongoose');
const bodyParser = require('body-parser');




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));

//configuracion global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); // enlaza el track de error a la consola (proceso actual)
db.once('open', () => {
    console.log('Base de datos ONLINE'); // si esta todo ok, imprime esto
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', 3000);
});