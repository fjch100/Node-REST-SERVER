const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

/*********************************************
 *  CARGA DE ARCHIVOS POR PUT
 *********************************************/
app.put('/upload/:tipo/:id', function(req, res) {
    let id = req.params.id;
    let tipo = req.params.tipo;

    if (!req.files) { // NO viene archivo
        return res.status(400).json({
            ok: false,
            error: {
                message: 'ningun archivo fue subidos'
            }
        })
    }

    tipoPermitidos = ['usuario', 'producto'];
    if (tipoPermitidos.indexOf(tipo) < 0) { //NO es tipo permitido
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Los Tipos permitidas son ' + tipoPermitidos.join(',')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombres = archivo.name.split('.');
    let extension = nombres[nombres.length - 1]

    let extensionesPermitidas = ['jpg', 'png', 'gif', 'jepg'];

    if (extensionesPermitidas.indexOf(extension) < 0) { //No es la extension permitida
        return res.status(400).json({
            ok: false,
            error: {
                message: 'las extensiones permitidas son ' + extensionesPermitidas.join(',')
            }
        })
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'usuario':
                actualizaImagenUsuario(id, res, nombreArchivo);
                break;
            case 'producto':
                actualizaImagenProducto(id, res, nombreArchivo);
                break;

            default:
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'tipo incorrecto'
                    }
                });
                break;
        }
    });
});

function actualizaImagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        borrarArchivo(usuarioDB.img, 'usuario');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((error, usuarioGuardado) => {
            return res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    });
};

function actualizaImagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        borrarArchivo(productoDB.img, 'producto');

        productoDB.img = nombreArchivo;
        productoDB.save((error, productoGuardado) => {
            return res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    });
};

function borrarArchivo(ArchivoBorrar, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ArchivoBorrar}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;