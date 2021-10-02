const jwt = require("jsonwebtoken")
const User = require('../models/user');

const validarJWT = async(req, res, next) => {
   
    const token = req.header('x-token')
    
    if( !token ){
        return res.status(401).json({
            msg: "No hay token"
        })
    }


    try {

       const { uid } =  jwt.verify(token, process.env.SECRETORPRIVATEKEY);


       // Leer el usuario que corresponde al uid(id del usuario autenticado)
       const user = await User.findById( uid );

       if( !user ){
        return res.status(401).json({
            msg: "Token no valido - usuario no existe BD"
        })
       }

       // Verificar si el uid tiene estado true
       if( !user.status ){
        return res.status(401).json({
            msg: "Token no valido - usuario status: false"
        })
       }

       // Add to object request
       req.user = user;

        next();
    } catch (error) {

        console.log(error)
        return res.status(401).json({
            msg: "Token no valido"
        })

    }

}

module.exports = {
    validarJWT
}