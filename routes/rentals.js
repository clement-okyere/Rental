const express = require("express");
const route = express.Router();
const Rental = require("../db/models/rental");
const Customer = require("../db/models/customer");
const Movie = require("../db/models/movie");
const Fawn = require("fawn");
const {
  rentalSchema,
  validate,
  getErrorMessage,
} = require("../utils/validation");
const mongoose = require("mongoose");

Fawn.init(mongoose);

route.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

route.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res
      .status(404)
      .send(`Rental with id ${req.params.id} does not exist`);
  res.send(rental);
});

route.post("/", async (req, res) => {
  const { error } = validate(rentalSchema, req.body);
  if (error) return res.status(400).send(getErrorMessage(error));

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} does not exist`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res
      .status(404)
      .send(`Movie with id ${req.params.id} does not exist`);

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not available for rent");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    return res.status(500).send("Something failed.");
  }
});

route.put("/:id", async (req, res) => {
  const { error } = validate(rentalSchema, req.body);
  if (error) return res.status(400).send(getErrorMessage(error));

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} does not exist`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res
      .status(404)
      .send(`Movie with id ${req.params.id} does not exist`);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      customer: {
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        title: movie,
        dailyRentalRate: movie.dailyRentalRate,
      },
    },
    {
      new: true,
    }
  );
  if (!rental)
    return res.status(404).send(`Rental with id ${id} does not exist`);

  res.send(rental);
});

route.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send(`Customer with id ${id} does not exist`);
  res.send(customer);
});

module.exports = route;
