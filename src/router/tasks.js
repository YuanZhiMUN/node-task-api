const express = require('express')
const Task = require('../models/task')
const router = express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
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
        const task = await Task.findOne({_id: req.params.id})
        tobeUpdated.forEach(prop => task[prop] = req.body[prop])
        const res_task = await task.save()
    
        if (!task) {
            return res.status(400).send({error: "Update failed"})
        }

        res.send(res_task)
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