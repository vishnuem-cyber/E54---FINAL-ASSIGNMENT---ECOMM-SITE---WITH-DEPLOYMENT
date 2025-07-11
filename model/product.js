const mongoose = require('mongoose')
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true
    },
    
    price:Number,
    description:String,
    imageUrl:String
})

const Product =mongoose.model('product',productSchema)
module.exports= Product