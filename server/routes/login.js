const express = require('express'); //servidor HTTP
const app = express(); //la instancia del servidor HTTP
const bcrypt = require('bcrypt'); //modulo de Encriptacion del Password
const Usuario = require('../models/usuario'); //carga el modelo de Usuario
const jwt = require('jsonwebtoken'); //modulo para creat tokens

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: 'el (usuario) o contraseña no son validos'
            })
        }

        if (bcrypt.compareSync(body.password, usuarioDB.password)) {
            let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            res.json({
                ok: true,
                token,
                usuario: usuarioDB
            });
        } else {
            return res.status(400).json({
                ok: false,
                error: 'el usuario o (contraseña) no son validos'
            });
        }
    });
});


module.exports = app;