var express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
var router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '*****@gmail.com',
      pass: '*****'
    }
})

const mailWelcome = {
    from: '*****t@gmail.com',
    to: '*****t@gmail.com',
    subject: 'Welcome',
    text: 'Welcome to Task manager !'
};

const mailThanks = {
    from: '*****@gmail.com',
    to: '******@gmail.com',
    subject: 'Thanks',
    text: 'Sorry for your leave'
};

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a permited file"))
        }

        cb(null, true)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{ 
        await user.save()
        const token = await user.generateToken()
        transporter.sendMail(mailWelcome, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
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

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const tobeUpdated = Object.keys(req.body)
    const validUpdate = tobeUpdated.every(prop => allowedUpdate.includes(prop))
    if(!validUpdate){
        return res.status(400).send({error: "Invalid update"})
    }

    try {
        tobeUpdated.forEach(prop => req.user[prop] = req.body[prop])
        const res_user = await req.user.save()
        res.send(res_user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        transporter.sendMail(mailThanks, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
        res.send(req.user)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({user, token})
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

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e){
        res.send(400).send(e)
    }   
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e){
        res.status(404).send()
    }
})

module.exports = router