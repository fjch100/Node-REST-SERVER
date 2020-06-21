const express = require('express'); //servidor HTTP
const app = express(); //la instancia del servidor HTTP
const bcrypt = require('bcrypt'); //modulo de Encriptacion del Password
const Usuario = require('../models/usuario'); //carga el modelo de Usuario
const jwt = require('jsonwebtoken'); //modulo para creat tokens
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        //audience: process.env.CLIENT_ID, // client ID for HEROKU ENV Variable
        audience: '371383672843-m8df9ek2q60vtntqd4oct4ggfcoh9qbf.apps.googleusercontent.com' // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    await verify(token).catch(err => console.log(err));

    res.json({
        token
    })

});

module.exports = app;