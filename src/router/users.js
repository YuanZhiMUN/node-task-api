var express = require('express')
const User = require('../models/user')
var router = express.Router()

router.post('/users', async (req, res) => {
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

module.exports = router