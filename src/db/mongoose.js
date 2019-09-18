const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/task-api', { useNewUrlParser: true, useCreateIndex: true })

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

const Task = mongoose.model('Task', {
    description: {
        type: Str,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})
