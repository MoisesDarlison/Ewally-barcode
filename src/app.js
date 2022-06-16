const express = require('express')
const app = express()

const routes = require('../src/routes/index')

app.use(express.json())
app.use(routes)

module.exports = app