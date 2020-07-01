const express = require('express'); //servidor HTTP
const app = express(); //la instancia del servidor HTTP


app.use(require('./usuarios'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./productos'));


module.exports = app;