const express = require("express");
const route = express.Router();
const { Genre } = require("../db/models/genre");
const { Movie } = require("../db/models/movie");
const {
  movieSchema,
  validate,
  getErrorMessage,
} = require("../utils/validation");

route.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

route.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send(`Movie with id ${id} could not be found`);
  res.send(movie);
});

route.post("/", async (req, res) => {
  const { error } = validate(movieSchema, req.body);
  if (error) return res.status(400).send(getErrorMessage(error));

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

route.put("/:id", async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre.id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send(`Movie with id ${id} could not be found`);

  const { error } = validate(movieSchema, req.body);
  if (error) return res.status(400).send(getErrorMessage(error));

  res.send(movie);
});

route.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send(`Movie with id ${id} could not be found`);
  res.send(movie);
});

module.exports = route;
