

const validarCampos = require('../middlewares/validar-campos');
const validarJWT  = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarUploads = require('./validar-uploads')
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarUploads
}