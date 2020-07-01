/*******************************************
 * Ruteador (controller) para Categorias
 * incluye CRUD 
 * y logica de la aplicacion para categorias
 ******************************************/

const express = require('express'); //Modulo Servidor HTTP
//const bcrypt = require('bcrypt'); //modulo de Encriptacion del Password
//const _ = require('underscore'); //Modulo helper, con funciones utilitarias
const Categoria = require('../models/categoria');
const app = express(); //instancia del servidor
const { verificaToken, verificaAdmin_role } = require('../middleware/autorizacion'); //modulo de middleware para verificar token

/**************************************
 *  GET Categorias = LISTADO DE categorias
 *************************************/
app.get('/categoria', verificaToken, (req, resp) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario')
        .exec((error, categorias) => {
            if (error) {
                return resp, status(500).json({
                    ok: false,
                    message: error
                })
            }
            return resp.json({
                ok: true,
                categorias
            })
        });
})



/***************************************************
 *  GET Categoria = obtiene una categoria por el id
 **************************************************/
app.get('/categoria/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return resp, status(500).json({
                ok: false,
                message: error
            })
        }
        resp.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


/*********************************************
 *  POST categoria: crea una categoria en BD
 **********************************************/
app.post('/categoria', verificaToken, (req, resp) => {
    //obtiene el nombre
    let descripcion = req.body.descripcion;
    //obtiene el usuario
    let usuarioConectado = req.usuario;
    let categoria = new Categoria({
        descripcion,
        usuarioId: usuarioConectado._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            });
        }
        return resp.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


/******************************************************
 *  PUT categoria: Modifica el nombre de la categoria
 ******************************************************/
app.put('/categoria/:id', [verificaToken, verificaAdmin_role], (req, resp) => {
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    if (!descripcion) { // sin nombre no se modifica
        return resp.status(400).json({
            ok: false,
            message: 'Error, Request sin nombre'
        });
    }

    Categoria.findByIdAndUpdate(id, { "descripcion": descripcion }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            });
        }
        if (!categoriaDB) {
            return resp.status(500).json({
                ok: false,
                message: 'El id proporcionado no existe'
            });
        }
        return resp.json({
            ok: true,
            categoria: categoriaDB
        });
    })
})



/******************************************************
 *  DELETE categoria: BORRA una categoria
 ******************************************************/
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, resp) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, { useFindAndModify: false }, (err, categoriaDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            });
        }
        if (!categoriaDB) {
            return resp.status(500).json({
                ok: false,
                message: 'El id proporcionado no existe'
            });
        }
        return resp.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

module.exports = app;