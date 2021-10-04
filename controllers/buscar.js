const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const coleccionesPermitidas = [
    'users',
    'categories',
    'products',
    'roles'
]

const buscarUsers = async( termino = '' , res ) =>{

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ) {
        const user = await User.findById( termino );
        return res.json({
            results: user? [ user ] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const user = await User.find({ 
           $or: [{ name: regex }, { email: regex}], 
           $and: [{ status: true }]});

    return res.json({
        results: user
    })

}

const buscarCategories = async( termino = '' , res ) =>{

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ) {
        const category = await Category.findById( termino )
                               .populate('user', 'name');
        return res.json({
            results: category? [ category ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const category = await Category.find({ name: regex, status: true })
                           .populate('user', 'name');

    return res.json({
        results: category
    })

}

const buscarProducts = async( termino = '' , res ) =>{

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ) {
        const products = await Product.findById( termino ).populate("category", 'name');
        return res.json({
            results: products? [ products ] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const products = await Product.find({ name: regex, status: true })
                                  .populate("category", 'name');

    return res.json({
        results: products
    })

}

const buscar = (req, res) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son  ${ coleccionesPermitidas }`
        })
    }

    switch( coleccion ){
        case 'users': 
                 buscarUsers( termino, res );
              break;
        case 'categories': 
                 buscarCategories( termino, res);
              break;
        case 'products': 
               buscarProducts( termino, res );
              break;
        case 'roles': 
              break;
        default: 
             res.status(500).json({
                 msg: 'Se me olvido hacer esta ruta'
             })
    }
}


module.exports = {
    buscar
}