const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    address: {
        type: String
    }
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)