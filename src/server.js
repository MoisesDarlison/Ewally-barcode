require('dotenv').config()
const app = require('./app')
const { PORT = 3333 } = process.env
app.listen(PORT, () => console.log(`listening on port ${PORT}`))