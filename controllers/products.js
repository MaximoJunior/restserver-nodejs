const { Product } = require("../models");


const createProduct = async (req, res) => {

    const { status, user, ...data } = req.body;
    data.name = data.name.toUpperCase();
    
    let product = await Product.findOne( { name: data.name } );

    if( product ){
        return res.status(400).json({
            msg: `El producto ${ data.name }, ya existe`
        })
    }
    
    data.user = req.user._id;

    product = await new Product( data );
    await product.save();

    res.status(201).json( product )
}

const getProducts = async(req, res) => {

    const { limit = 10, from = 0 } = req.query;
    const query = { status: true }
    
    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query ).skip( Number( from ) ).limit( Number( limit ) )
               .populate('category', 'name')
               .populate('user', 'name')
    ])

    res.json({
        total,
        products
    });

}

const getProduct = async(req, res) => {

    const { id } = req.params;
    
    const product = await Product.findById( id )
                         .populate('category', 'name')
                         .populate('user', 'name')

    res.json( product );

}

const updateProduct = async(req, res) => {

    const { id } = req.params;
    const { status, user, ...data } = req.body;

    // User who updated it
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new:true })

    res.json( product );
}

const deleteProduct = async(req, res) => {

    const { id } = req.params;
    const query = { status: false }

    const product = await Product.findByIdAndUpdate( id, query, {new:true} )
    
    res.json( product );
}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}