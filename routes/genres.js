const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express');
const router = express.Router();
const { genreSchema, validate } = require('../utils/validation')
const { Genre } = require('../db/models/genre')
const mongoose = require('mongoose')



router.get('/', async (req, res) => {
    throw new Error('Could not get the genres')
        const genres = await Genre
            .find()
            .sort('name')
        res.send(genres);
});

router.get('/:id', async (req, res) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid Genre Id')
    const genre = await Genre
                    .findById(req.params.id)
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`); 
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(genreSchema, req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    });
    const result = await genre.save();
    res.send(result)
})

router.put('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
            new: true
    })
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);

   const {error} = validate(req.body, genreSchema);
    if (error) return res.status(400).send(error.details[0].message);
    res.send(genre)
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);
    res.send(genre)
})

module.exports = router;