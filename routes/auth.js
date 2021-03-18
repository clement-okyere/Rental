const config = require('config')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const express = require('express');
const router = express.Router();
const { loginSchema ,validate } = require('../utils/validation')
const { User } = require('../db/models/user')
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const {error} = validate(loginSchema, req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    console.log('User', user)
    if (!user) return res.status(401).send('Invalid username or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    console.log('validPassword', validPassword)
    if (!validPassword) return res.status(401).send('Invalid username or password')

    const token = user.generateAuthToken()
    res.send(token)
})

module.exports = router