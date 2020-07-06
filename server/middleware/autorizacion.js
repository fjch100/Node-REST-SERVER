const jwt = require('jsonwebtoken'); //modulo para creat tokens

/******************************************
 *   Verifica si viene el Autority Token
 *   y si es valido y activo
 ******************************************/
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
                ERROR: 'BAD TOKEN PROVIDED'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};


/******************************************
 *   Verifica si el usuario es ADMIN
 *   
 ******************************************/
let verificaAdmin_role = (req, res, next) => {
    let role = req.usuario.role;
    if (role === 'USER_ROLE') {
        return res.status(401).json({
            ok: false,
            message: 'No tiene suficientes privilegios'
        })
    }
    next();
};


/******************************************
 *   Verifica si viene el Autority Token para la imagen
 *   y si es valido y activo
 ******************************************/
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
                ERROR: 'BAD TOKEN PROVIDED'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

module.exports = {
    verificaToken,
    verificaAdmin_role,
    verificaTokenImg
}