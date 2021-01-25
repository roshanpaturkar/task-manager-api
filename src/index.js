const express = require('express')
require('./db/mongoose')
const {ObjectID} = require('mongodb')

const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (request, response) => {
    const user = new User(request.body)

    try {
        await user.save()
        response.status(201).send(user)
    } catch (error) {
        response.status(400).send(error)
    }
})

app.get('/users', async (request, response) => {
    try {
        const users = await User.find({})
        response.send(users)
    } catch (error) {
        response.status(500).send()
    }
})

app.get('/users/:id', async (request, response) => {
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

app.post('/tasks', async (request, response) => {
    const task = new Task(request.body)
    
    try {
        await task.save()
        response.status(201).send(task)
    } catch (error) {
        response.status(400).send(error)
    }
})

app.get('/tasks', async (request, response) => {
    try {
        const tasks = await Task.find({})
        response.send(tasks)
    } catch (error) {
        response.status(500).send()
    }
})

app.get('/tasks/:id', async (request, response) => {
    const _id = request.params.id

    try {
        const task = await Task.findById(_id)
        
        if (!task) {
            return response.status(404).send()
        }
        response.send(task)
    } catch (error) {
        response.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})