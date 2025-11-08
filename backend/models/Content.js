const {Schema,model} = require('mongoose');


const contentSchema = new Schema({
    content:{
        type:String,
        required:true,
        trim:true,
    },

    password:{
        type:String,
        required:true,
        trim:true

    },

    passwordSig:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
    
},{timestamps:true})


const Content = model("Content",contentSchema);

module.exports = Content;