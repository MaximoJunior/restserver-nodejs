
const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPost, userPut, userDelete } = require('../controllers/user');
const { esRoleValido, emailExiste, existeUserById } = require('../helpers/db-validators');


const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares/');


const router = Router();

router.get('/', userGet );

router.put('/:id', [
   check('id', 'No es un id valido').isMongoId(),
   check('id').custom( existeUserById ),
   check("role").custom( esRoleValido ),
   validarCampos
], userPut );

router.post('/',
[
    check('name', "El name is obligatorio").not().isEmpty(),
    check('password', "El password deber ser mas de 6 caracteres").isLength({ min: 6 }),
    check('email', "El email no es valido").isEmail(),
    check("email").custom( emailExiste ),
    // check('role', "No es un role valido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check("role").custom( esRoleValido ), 
    validarCampos
], userPost );

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', "No es un id valido").isMongoId(),
    check('id').custom( existeUserById ),
    validarCampos
], userDelete );

module.exports = router;