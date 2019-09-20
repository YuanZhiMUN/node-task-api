var express = require('express')
const User = require('../models/user')
var router = express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.get('/users', async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user)
    }
    catch(e){
            res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const tobeUpdated = Object.keys(req.body)
    const validUpdate = tobeUpdated.every(prop => allowedUpdate.includes(prop))
    if(!validUpdate){
        return res.status(400).send({error: "Invalid update"})
    }

    try{
        const user = await User.findById(req.params.id)
        tobeUpdated.forEach(prop => user[prop] = req.body[prop])
        const res_user = await user.save()
        
        if (!user){
            return res.status(400).send({error: "Update failed"})
        }
        res.send(res_user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
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

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

module.exports = router