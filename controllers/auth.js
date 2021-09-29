
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res) => {

    const { id_token } = req.body;
   
    try {

        const googleUser = await googleVerify( id_token ); 

        const { email, img, name } = googleUser;

        let user = await User.findOne({ email });

        console.log(user)

        if( !user ){
            const data = { name, email, img, password: ':p', google: true, role: 'USER_ROLE' }
            user = new User( data );
            await user.save();
        }

        // Si el user en BD
        if( !user.status ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT( user.id );
        console.log(token)

        res.json({
            user,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            msg: "El token no se pudo verificar",
            ok: false
        })
    }

   
}


module.exports = {
    login,
    googleSignIn
}