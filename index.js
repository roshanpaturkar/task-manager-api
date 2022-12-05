const express = require('express')
const cors = require('cors')
var origin = require('./src/cors/origin')
require('./src/db/mongoose')

const userRouter = require('./src/routers/user')
const otpRouter = require('./src/routers/otp')
const taskRouter = require('./src/routers/task')

const app = express()

//  CORS origins configuration
if (process.env.ENV != undefined) {
    app.use(cors())
} else {
    app.use(cors(origin))
}

app.use(express.json())
app.use(userRouter)
app.use(otpRouter)
app.use(taskRouter)

module.exports = app;