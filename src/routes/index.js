const express = require('express')
const app = express()

const labelBilletRoute = require('./labelBilletRoute')

app.use('/boleto', labelBilletRoute)
app.use('/', (request, response) => { //Rota default
    return response.status(404).json({ message: "Not Found" })
})
module.exports = app