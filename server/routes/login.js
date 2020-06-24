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
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (usuarioDB) { //El usario existe manejalo
            if (!usuarioDB.google) { //el usuario no es de google pero entro con google
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Por favor haga login de manera normal No use Google'
                    }
                });
            } else { //el usuario es de google y puede que expiro
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    token,
                    usuario: usuarioDB
                });

            }
        } else { //el usuario no existe cre uno nuevo
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                google: true,
                img: googleUser.img,
                password: ':)'
            });

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                //usuarioDB.password= null;// no password al cliente
                res.json({
                    ok: true,
                    usuario: usuarioDB
                });
            })

        }
    })



});

module.exports = app;