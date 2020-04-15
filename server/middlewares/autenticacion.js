const jwt = require('jsonwebtoken');


//=================
// Verificacion token
//=================

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        //payload del token
        req.usuario = decoded.usuario;
        next();

    });


};

//=================
// Verificacion Admin rol
//=================

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    let rol = usuario.rol;
    if (rol != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no permitido para modificar BD'
            }
        });
    }

    next();


};

module.exports = {
    verificaToken,
    verificaAdminRole
}