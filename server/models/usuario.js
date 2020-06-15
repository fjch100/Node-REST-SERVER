/**********************************
 * Modelo de Usuario,
 * Squema de Mongoose y DB
 * Metodos asociados al modelo
 ************************************/

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); //modulo que ayuda a validar el modelo

//Roles de Usuarios Validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'el {VALUE} no es un rol valido'
}


let Schema = mongoose.Schema;

let usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: 'Error, el {PATH} debe ser UNICO o ya existe en la BD.' });

//se exporta un modelo creado a partir del squema
module.exports = mongoose.model('usuario', usuarioSchema);