require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const winston = require('winston')
const app = express();
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/logger')()
require('./startup/config')()


const PORT = process.env.PORT || 3000
const server = app.listen(3000, () => {
  winston.info(`listening on port ${PORT}`)
})

module.exports = server;


