
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res) => {

    const { email, password } = req.body;

    try {


        // Verificar si el email existe
        const user = await User.findOne({ email });
        
        if( !user ){
            return res.status(400).json({
                msg: 'email / password no son correctos - email'
            })
        }

        // Si el usuarios esta activo en la BD
        if( !user.status ) {
            return res.status(400).json({
                msg: 'email / password no son correctos - status'
            })
        }


        // Vericar la password
        const validPassword = bcryptjs.compareSync( password, user.password );

        if( !validPassword ) {
            return res.status(400).json({
                msg: 'email / password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT( user.id );





        res.json({
            user,
            token
        })
        
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: "Hable con el administrador"
        })

    }
     
}


module.exports = {
    login
}