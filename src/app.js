const express = require('express')
const cors = require('cors')
require('./db/mongoose')

const userRouter = require('./routers/user')
const otpRouter = require('./routers/otp')
const taskRouter = require('./routers/task')

const app = express()

app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(otpRouter)
app.use(taskRouter)

module.exports = app