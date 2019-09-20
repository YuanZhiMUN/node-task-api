const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task