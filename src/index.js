const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const { request, response } = require('express')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.get('', (request, response) => {
    response.send('Welcome to Task Manager App (API)')
})
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})