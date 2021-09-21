const Role = require('../models/role');
const User = require('../models/user');

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



module.exports = {
    esRoleValido,
    emailExiste,
    existeUserById
}