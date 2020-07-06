const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middleware/autorizacion');

let app = express();

app.get('/images/:tipo/:img', verificaTokenImg, (req, resp) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let pathNoimg = path.resolve(__dirname, `../assets/no-image.png`);
    if (fs.existsSync(pathImg)) {
        return resp.sendFile(pathImg);
    } else {
        return resp.sendFile(pathNoimg);
    }
});



module.exports = app;