const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (request, response) => {

    const task = new Task({
        ...request.body,
        owner: request.user._id
    })  

    try {
        await task.save()
        response.status(201).send(task)
    } catch (error) {
        response.status(400).send(error)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//Get /tasks?sortBy=createdAt:desc
//Get /tasks?sortBy=completed:desc
router.get('/tasks', auth, async (request, response) => {
    const match = {}
    const sort = {}

    if (request.query.completed) {
        match.completed = request.query.completed === 'true'
    }

    if (request.query.sortBy) {
        const parts = request.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await request.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(request.query.limit),
                skip: parseInt(request.query.skip),
                sort
            }
        }).execPopulate()
        response.send(request.user.tasks)
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (request, response) => {
    const _id = request.params.id

    try {
        const task = await Task.findOne({_id, owner: request.user._id})
        
        if (!task) {
            return response.status(404).send()
        }
        response.send(task)
    } catch (error) {
        response.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (request, response) => {
    const updates = Object.keys(request.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return response.status(400).send({error: 'Invalid updates!'})
    }

    try {
        //by pass save() 
        //const task = await Task.findByIdAndUpdate(request.params.id, request.body, {new: true, runValidators: true})

        const task = await Task.findOne({_id: request.params.id, owner: request.user._id})

        if (!task) {
            return response.status(404).send()
        }

        updates.forEach((update) => task[update] = request.body[update])
        await task.save()
        response.send(task)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (request, response) => {
    try {
        //const task = await Task.findByIdAndDelete(request.params.id)
        const task = await Task.findOneAndDelete({_id: request.params.id, owner: request.user._id})

        if (!task) {
            return response.status(404).send()
        }
        response.send(task)
    } catch (error) {
        response.status(500).send()   
    }
})

module.exports = router