const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (request, response) => {
    const user = new User(request.body)

    try {
        await user.save()
        response.status(201).send(user)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.get('/users', async (request, response) => {
    try {
        const users = await User.find({})
        response.send(users)
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/users/:id', async (request, response) => {
    const _id = request.params.id

    try {
        const user = await User.findById(_id)
        
        if (!user) {
            return response.status(404).send()
        }
        response.send(user)
    } catch (error) {
        response.status(500).send()
    }
})

router.patch('/users/:id', async (request, response) => {
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

        const user = await User.findById(request.params.id)

        updates.forEach((update) => user[update] = request.body[update])
        await user.save()

        if (!user) {
            return response.status(404).send()
        }
        response.send(user)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.delete('/users/:id', async (request, response) => {
    try {
        const user = await User.findByIdAndDelete(request.params.id)

        if (!user) {
            return response.status(404).send()
        }
        response.send(user)
    } catch (error) {
        response.status(500).send()   
    }
})

module.exports = router