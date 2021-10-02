const { Router } = require('express');
const { check } = require('express-validator');

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const { existeCategoria } = require('../helpers/db-validators');

const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

/**
 * {{url}}/api/categorias
 */


// Obtener todas las categorias - publico - paginados
router.get('/', getCategories );  

// Obtener una categoria por id - publico 
router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], getCategory );


// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'Enter a category name').not().isEmpty(),
    validarCampos
], createCategory );

// Actualizar - privado - cualquiera con un token valido
router.put('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoria ),
    check('name', 'Enter a category name').not().isEmpty(),
    validarCampos
], updateCategory );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], deleteCategory);





module.exports = router;