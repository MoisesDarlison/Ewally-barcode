require('dotenv').config()
const logger = require('log4js').getLogger()
logger.level = 'debug'

const app = require('./app')
const { PORT = 3333 } = process.env
app.listen(PORT, () => logger.info(`listening on port ${PORT}`))
