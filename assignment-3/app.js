const path = require('path')

const express = require('express')

const mainRoute = require('./routes/main')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use(mainRoute)

app.listen(3000)