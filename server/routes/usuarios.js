/*******************************************
 * Ruteador (controller) para Usuarios
 * incluye CRUD Usuarios
 * y logica de la aplicacion para usuarios
 ******************************************/

const express = require('express'); //Modulo Servidor HTTP
const bcrypt = require('bcrypt'); //modulo de Encriptacion del Password
const _ = require('underscore'); //Modulo helper, con funciones utilitarias

const app = express(); //instancia del servidor
const Usuario = require('../models/usuario'); //carga el modelo de Usuario

/**************************************
 *  GET USUARIO = LISTADO DE USUARIOS
 *************************************/
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //find all usuarios, retorna solo "limite" documentos comenzando "desde"
    Usuario.find({ estado: true }, 'nombre email role google estado')
        .skip(desde) //salta los primeros "desde" registros
        .limit(limite) //trae la cantidad "limite" de registros
        .exec((erro, usuarios) => {
            if (erro) {
                return res.status(400).json({
                    ok: false,
                    erro
                })
            }
            //cuenta cuantos usuarios hay
            Usuario.countDocuments({ estado: true }, ((err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios
                });
            }));

        })
});

/**************************************
 *  POST USUARIO = CREA UN USUARIO
 *************************************/
app.post('/usuario', function(req, res) {
    let body = req.body;
    //creamos la instancia del nuevo usuario a guardar
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        google: body.google
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
});

/**************************************
 *  PUT USUARIO = ACTUALIZA UN USUARIO
 *************************************/
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //busca un usuario y lo actualiza, validando con el modelo
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

/**************************************
 *  DELETE = BORRA/DESACTIVA UN USUARIO 
 *************************************/
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //busca un usuario por id, lo borra de la BD y lo retorna al callback
    //Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {

    //busca un usuario por id, coloca el flag de estadoen false lo retorna al callback
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) { //si el usuario no se encuentra NO da ERROR, pero usuarioDB=null
            return res.status(400).json({
                ok: false,
                err: 'No se encontro el usuario'
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});



module.exports = app;