const express = require('express');
const app = express();
const { verificaToken } = require('../middleware/autorizacion'); //modulo de middleware para verificar token
const _ = require('underscore'); //Modulo helper, con funciones utilitarias

let Producto = require('../models/producto');

/**************************************
 *  POST Producto: crea un producto
 *************************************/
app.post('/productos', verificaToken, (req, resp) => {
    let data = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    let usuarioId = req.usuario._id;
    data.usuario = usuarioId;
    //console.log(data);
    let producto = new Producto(data);
    producto.save((err, productoDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!productoDB) {
            return resp.status(500).json({
                ok: false,
                message: 'No se logro salvar el Producto'
            })
        }
        return resp.json({
            ok: true,
            producto: productoDB
        })
    })

})




/**************************************
 *  Buscar Producto
 *************************************/
app.get('/productos/buscar/:termino', (req, resp) => {
    let termino = req.params.termino;
    let buscar = new RegExp(termino, 'i');
    Producto.find({ nombre: buscar })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: err
                })
            }

            return resp.json({
                ok: true,
                producto: productoDB
            })
        })
})



/**************************************
 *  GET Productos: obtiene el listado de productos
 *************************************/
app.get('/productos', verificaToken, (req, resp) => {
    let limite = Number(req.query.limite) || 5;
    let desde = Number(req.query.desde) || 0;
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: err
                })
            }
            resp.json({
                ok: true,
                producto: productoDB
            })
        })
})


/**************************************
 *  GET Productos/:id , obtiene un producto por el id
 *************************************/
app.get('/productos/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: err
                })
            }
            if (!productoDB) {
                return resp.json({
                    ok: true,
                    message: 'No hay producto disponible con ese Id'
                })
            }
            return resp.json({
                ok: true,
                producto: productoDB
            })
        })
})



/**************************************
 *  PUT Producto: Modifica un producto
 *************************************/
app.put('/productos/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible']);
    body.usuario = req.usuario._id;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, productoDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!productoDB) {
            return resp.status().json({
                ok: false,
                message: `El producto con Id: ${id} no existe`
            })
        }
        return resp.json({
            ok: true,
            producto: productoDB
        })
    })
})


/**************************************
 *  DELETE Producto: Coloca un producto NO Disponible
 *************************************/
app.delete('/productos/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { 'disponible': false }, { new: true, useFindAndModify: false, context: 'query' }, (err, productoDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!productoDB) {
            return resp.status().json({
                ok: false,
                message: `El producto con Id: ${id} no existe`
            })
        }
        return resp.json({
            ok: true,
            message: 'se borro el producto'
        })
    });

});


module.exports = app;