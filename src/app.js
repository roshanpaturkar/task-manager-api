const express = require('express')
const cors = require('cors')
var origin = require('./cors/origin')
require('./db/mongoose')

const userRouter = require('./routers/user')
const otpRouter = require('./routers/otp')
const taskRouter = require('./routers/task')

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

module.exports = app