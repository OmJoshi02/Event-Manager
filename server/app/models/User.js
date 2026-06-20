import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    mobile : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    collegeName : {
        type : String,
        default : '',
    },

    department : {
        type : String,
        default : '',
    },

    year : {
        type : Number
    },

    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },

    
},{
        timestamps : true,
    })

export default mongoose.model('User', userSchema)