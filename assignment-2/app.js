const express = require('express')

const app = express()

// Assignment Number 2
// app.use((req, res, next) => {
//     console.log('First Middleware')
//     next()
// })

// app.use((req, res, next) => {
//     console.log('Second Middleware')
//     res.send('<h1>Assignment 2</h1>')
// })

app.use('/users', (req, res, next) => {
    console.log("Request Path - /users")
    res.send('<h1>Request goes to /users PATH</h1>')
})

app.use('/', (req, res, next) => {
    console.log("Request Path - /")
    res.send('<h1>Request goes to / PATH</h1>')
})

app.listen(3000)