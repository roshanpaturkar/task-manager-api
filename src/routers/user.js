const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { request, response } = require('express')
const router = new express.Router()

router.post('/users', async (request, response) => {
    const user = new User(request.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({user, token})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/users/login', async (request, response) => {
    try {
        const user = await User.findUserByCredentials(request.body.email, request.body.password)
        const token = await user.generateAuthToken()
        response.send({user, token})
    } catch (error) {
        response.status(400).send()
    }
})

router.post('/users/logout', auth, async (request, response) => {
    try {
        request.user.tokens = request.user.tokens.filter((token) => {
            return token.token !== request.token
        })

        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (request, response) => {
    try {
        request.user.tokens = []
        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/users/me', auth, async (request, response) => {
    response.send(request.user)
})

router.patch('/users/me', auth, async (request, response) => {
    const updates = Object.keys(request.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return response.status(400).send({error: 'Invalid updates!'})
    }

    try {
        //this method by pass save() of mongoose and do direct operations on database, in result we can not trigger some important methods
        //like userSchema.pre() and can not do any pre-operations before updates. thats why we use another way  
        //const user = await User.findByIdAndUpdate(request.params.id, request.body, {new: true, runValidators: true})

        updates.forEach((update) => request.user[update] = request.body[update])
        await request.user.save()

        response.send(request.user)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (request, response) => {
    try {
        await request.user.remove()
        response.send(request.user)
    } catch (error) {
        response.status(500).send()   
    }
})

const upload = multer ({
        limits: {
            fileSize: 1000000
        },
        fileFilter (request, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error ('Please upload an image'))
            }
            callback(undefined, true)
        }
    })

router.post('/users/me/avatar', auth, upload.single('avatar'), async (request, response) => {
    request.user.avatar = request.file.buffer
    await request.user.save()
    response.send()
}, (error, request, response, next) => {
    response.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (request, response) => {
    try {

        if (!request.user.avatar) {
            response.status(404).send()
        }

        request.user.avatar = undefined
        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

module.exports = router