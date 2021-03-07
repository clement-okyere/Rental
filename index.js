require('express-async-errors')
require('winston-mongodb')
const winston = require('winston')
const config = require('config')
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const rentals = require('./routes/rentals')
const movies = require('./routes/movie')
const genres = require('./routes/genres')
const customers = require('./routes/customer')
const users = require('./routes/user');
const auth = require('./routes/auth');
const error = require('./middleware/error')


process.on('unhandledRejection', (err) => {
  throw err;
})

winston.handleExceptions(new winston.transports.file({filename: 'uncaughtExceptions.log'}))
winston.add(winston.transports.File, { filename: 'logfile.log' })
winston.add(winston.transports.MongoDB,
  {
    db: 'mongodb://localhost/playground',
    level: 'error'
  }
)


if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR jwtPrivateKey is not defined')
  process.exit(1)
}

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to Mongodb....'))
    .catch(err => console.error("could not connect to mongodb"))


app.use(express.json())
app.use('/api/rentals', rentals)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/genres', genres)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.use(error)

const PORT = process.env.PORT || 3000
app.listen(3000, () => {
  console.log(`listening on port ${PORT}`)
})


