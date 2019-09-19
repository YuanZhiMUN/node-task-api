const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please input correct email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isLength(value,{min:6, max: 12})){
                throw new Error('The password should be between 6 and 12 characters')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value < 0 ){
                throw new Error('age should be positive')
            }
        }
    }
})

module.exports = User