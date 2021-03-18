const auth = require('../middleware/auth')
const _ = require('lodash')
const express = require('express');
const router = express.Router();
const { userSchema, loginSchema ,validate } = require('../utils/validation')
const { User } = require('../db/models/user')
const bcrypt = require('bcryptjs')



router.get('/', async (req, res) => {
    const users = await User
        .find()
        .sort('name')
    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    
   const user = await User
        .findById(req.user._id)
        .select('-password')
    if (!user) return res.status(404).send(`User not found`); 
    res.send(user);
});

router.post('/', async (req, res) => {
    const {error} = validate(userSchema, req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email})
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send( _.pick(user, ['name', 'email']))
})


router.put('/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
            new: true
    })
    if (!user) return res.status(404).send(`User with id ${req.params.id} was not found`);

   const {error} = validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);
    res.send(user)
})


module.exports = router;