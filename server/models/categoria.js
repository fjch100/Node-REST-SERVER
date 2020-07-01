/**********************************
 * Modelo de Categoria,
 * Squema de Mongoose y DB
 * Metodos asociados al modelo
 ************************************/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //modulo que ayuda a validar el modelo
var Schema = mongoose.Schema;

let categoriaSchema = mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'usuarios' }
})

categoriaSchema.plugin(uniqueValidator, { message: 'Error, el {PATH} debe ser UNICO o ya existe en la BD.' });
module.exports = mongoose.model('categoria', categoriaSchema);