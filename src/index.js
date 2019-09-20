const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/users')
const taskRouter = require('./router/tasks')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('the server is on ' + port)
})

