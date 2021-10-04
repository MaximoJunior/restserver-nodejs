const { Schema, model } = require('mongoose');


const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El name es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        require: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    price:  {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    description: { type: String },
    available: { type: Boolean, default: true },
    img: { type: String }
});

ProductSchema.methods.toJSON = function(){
    const { __v, status, ...data } = this.toObject();
    return data;
}



module.exports = model( 'Product', ProductSchema );