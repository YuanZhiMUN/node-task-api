var express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
var router = express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{ 
        await user.save()
        const token = await user.generateToken()
        res.status(201).send({ user, token })
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', auth, async (req, res) => {
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
        const token = await user.generateToken()
        res.send({user: user.getPublicInfor(), token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e){
        res.status(500).send()
    }
})
module.exports = router