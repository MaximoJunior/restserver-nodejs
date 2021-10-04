const { Category, Role, User, Product } = require('../models');

 const esRoleValido = async (role = '') => {
    const existeRole = await Role.findOne({ role });
    if( !existeRole ){
        throw new Error(`El role ${role} no esta registrado en la BD`)
    }
}

 // Verificar si el correo existe
 const emailExiste = async( email = '' )=> {
    const existeEmail = await User.findOne({ email });
    if( existeEmail ){
        throw new Error(`Ese email ${email}, ya esta registrado`);
    }
}

 // Verificar si el usuario _id existe
 const existeUserById = async( id )=> {
    const existeUser = await User.findById(id);
    if( !existeUser ){
        throw new Error(`Este id: ${id}, no existe`);
    }
}

const existeCategoria = async( id ) => {
     
    const existeCategoria = await Category.findById( id );
    if( !existeCategoria ){
        throw new Error(`There are any category with id: ${id}`);
    }
}

const existProduct = async( id ) => {
    const existProduct = await Product.findById( id );
    if( !existProduct ) {
        throw new Error(`There are any product width id: ${ id }`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = [] ) => {
    if( !colecciones.includes( coleccion)){
        throw new Error(`La Coleccion ${ coleccion } no es valida, ${ colecciones }`);
    }
    return true;
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUserById,
    existeCategoria,
    existProduct,
    coleccionesPermitidas
}