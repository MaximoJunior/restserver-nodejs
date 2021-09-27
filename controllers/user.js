
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const userGet = async(req, res) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }

    // const users = await User.find( query )
    //     .skip( Number( from ) )
    //     .limit( Number( limit ));

    // const total = await User.countDocuments( query );

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ]);

    res.json({
       total,
       users
    });
} 

const userPost = async (req, res) => {

    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role });

   
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en base de datos
    await user.save();
    
    res.status(201).json(user);
} 

const userPut = async(req, res) => {
    const { id } = req.params;
    
    const { _id, password, google, email,  ...resto } = req.body;

    // TODO validar contra BD
    if( password ) {
       // Encriptar la contraseña
       const salt = bcryptjs.genSaltSync();
       resto.password = bcryptjs.hashSync( password, salt );
    }
     
    const user = await User.findByIdAndUpdate( id, resto )
    res.json({
        user
    });

} 

const userDelete = async(req, res) => {
    const { id } = req.params;

    // const uid = req.uid;

    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { status: false } )

    const authUser = req.user;


    res.json(user);
} 



module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}