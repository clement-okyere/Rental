const express = require('express')
const rentals = require('../routes/rentals')
const movies = require('../routes/movie')
const genres = require('../routes/genres')
const customers = require('../routes/customer')
const users = require('../routes/user');
const auth = require('../routes/auth');
const error = require('../middleware/error')

module.exports = function (app) {
        app.use(express.json())
        app.use('/api/rentals', rentals)
        app.use('/api/customers', customers)
        app.use('/api/movies', movies)
        app.use('/api/genres', genres)
        app.use('/api/users', users)
        app.use('/api/auth', auth)
        app.use(error)
}