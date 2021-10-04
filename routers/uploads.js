const { Router }  = require('express');
const { check } = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, existeArchivo } = require('../middlewares');


const router = Router();


router.post('/', existeArchivo, cargarArchivo );

router.put('/:coleccion/:id',[
    existeArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c  => coleccionesPermitidas( c, ['users', 'products']) ),
    validarCampos
], actualizarImagenCloudinary );


router.get('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c  => coleccionesPermitidas( c, ['users', 'products']) ),
    validarCampos
], mostrarImagen );




module.exports = router;