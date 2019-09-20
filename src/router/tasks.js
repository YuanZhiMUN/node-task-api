const express = require('express')
const Task = require('../models/task')
const router = express.Router()

router.post('/tasks', async (req, res) => {
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

router.get('/tasks', async (req, res) => {
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

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
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

router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router