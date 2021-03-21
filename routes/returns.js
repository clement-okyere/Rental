const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validator = require("../middleware/validate");
const Rental = require("../db/models/rental");
const { Movie } = require("../db/models/movie");
const {
  rentalSchema,
  validate,
  getErrorMessage,
} = require("../utils/validation");
const moment = require("moment");

router.post(
  "/",
  [auth, validator(rentalSchema, validate)],
  async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send("Rental not found");
    if (rental.dateReturned)
      return res.status(400).send("Rental already returned");

    await Movie.update(
      { _id: rental.movie._id },
      {
        $inc: { numberInStock: 1 },
      }
    );

    rental.return();
    await rental.save();

    res.send(rental);
  }
);

module.exports = router;
