const { Category } = require("../models");


// getCategories - pages - total - populate
const getCategories = async( req, res )=>{

    const { limit = 5, from = 0 } = req.query;
    const query =  { status: true };
    // const categories  = await Category.find( query )
    //                    .populate('user') //It's like joins in SQL
    //                    .skip( Number( from ) )
    //                    .limit( Number( limit ) );

    // const total = await Category.countDocuments( query );

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
                .populate('user', 'name')
                .skip( Number( from ) )
                .limit( Number( limit ) )
    ]);

    const data = {
        total,
        categories
    }

    res.json( data )
}

// getCategory - populate {}
const getCategory = async( req, res )=> {

    const { id } = req.params;
    
    const category = await Category.findById( id ).populate('user', 'name');

    res.json( category );
}

//
const createCategory = async(req, res)=>{

    const name = req.body.name.toUpperCase();

    let category = await Category.findOne({ name });

    if( category ){
        return res.status(400)
                  .json({
                      msg: `The ${ category.name } category is already existe`
                  });
    }

    const data = {
        name,
        user: req.user._id
    }

    category = new Category( data );
    //Save
    await category.save();

    res.status(201).json( category )
};
 
// updateCategory 
const updateCategory = async(req, res)=> {

    const { id } = req.params;
    const name = req.body.name.toUpperCase();

    let category = await Category.findOne({ name, _id: { $ne: id } });

    // If category name is already existe
    if( category ){
        return res.status(400).json({
            msg: `La categoria ${ name } ya existe`
        });
    }
   
    const data = {
        name,
        user: req.user._id
    }

    category = await Category.findByIdAndUpdate(id, data, { new: true });
    
    res.json(category)
}


// deleteCategory - status: false
const deleteCategory = async(req, res) => {

    const { id } = req.params;

    const category  = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );

    res.json( category );
}



module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}