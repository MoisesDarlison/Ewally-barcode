const routes = require('express').Router()
const { validate } = require('../controllers/labelBilletController')

routes.get('/:barCode', validate)
routes.get('/', validate)

module.exports = routes
