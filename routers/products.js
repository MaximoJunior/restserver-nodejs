const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existeCategoria, existProduct } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();


router.get('/', getProducts );

router.get('/:id',[
   check('id', "El id no es valido").isMongoId(),
   validarCampos
], getProduct );

router.post('/',[
    validarJWT,
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('category', 'La category es obligatorio').isMongoId(),
    check('category').custom( existeCategoria ),
    validarCampos
], createProduct );

router.put('/:id',[
    validarJWT,
    check('id', "El id no es valido").isMongoId(),
    check('id').custom( existProduct ),
    validarCampos
], updateProduct)


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', "El id no es valido").isMongoId(),
    check('id').custom( existProduct ),
    validarCampos
] ,deleteProduct)


module.exports = router;