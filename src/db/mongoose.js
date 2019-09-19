const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-api', { useNewUrlParser: true, useCreateIndex: true })

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})
