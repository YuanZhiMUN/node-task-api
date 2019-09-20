const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        const response = await user.save()
        if (!response){
            return res.status(400).send()
        }
        res.send(response)
    }
    catch(e){
        res.status(400).send(e)
    }
})


app.get('/users', async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user)
    }
    catch(e){
            res.status(500).send(e)
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if (!user){
            return res.status(400).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.patch('/users/:id', async (req, res) => {
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const tobeUpdated = Object.keys(req.body)
    const validUpdate = tobeUpdated.every(prop => allowedUpdate.includes(prop))
    if(!validUpdate){
        return res.status(400).send({error: "Invalid update"})
    }

    try{
        const user = await User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
        if (!user){
            return res.status(400).send({error: "Update failed"})
        }
        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({_id: req.params.id})
        if(!user){
            return res.status(404).send({error: "delete failed"})
        }

        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        const response = await task.save()
        if (!response){
            return res.status(400).send()
        }
        res.status(201).send(response)
    }
    catch(e){
        res.status(400).send(e)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find({})
        if(!task) {
            return res.status(400).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id})
        if (!task){
            return res.status(400).send()
        }
        res.send(task)
    }
    catch(e){
            res.status(500).send(e)
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const allowedUpdate = ['description', 'completed']
    const tobeUpdated = Object.keys(req.body)
    const isvalid = tobeUpdated.every(prop => allowedUpdate.includes(prop))

    if (!isvalid){
        return res.status(400).send({error: "Invalid update"})
    }

    try {
        const task = await Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
        if (!task) {
            return res.status(400).send({error: "Update failed"})
        }

        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id})
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log('the server is on ' + port)
})

