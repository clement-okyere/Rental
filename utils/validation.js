const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
//const passwordComplexity = require("joi-password-complexity");

let complexityOptions = {
  min: 8,
  max: 25,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const rentalSchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});

const customerSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  isGold: Joi.boolean().required(),
  phone: Joi.string().required(),
});

const genreSchema = Joi.object({
  name: Joi.string().min(5).required().max(50),
});

const movieSchema = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().required().min(0),
  dailyRentalRate: Joi.number().required().min(0),
});

const userSchema = Joi.object({
  name: Joi.string().required().min(5).max(50),
  email: Joi.string().required().min(5).max(255).email(),
  password: Joi.string().required().min(4).max(1024),
});

const loginSchema = Joi.object({
  email: Joi.string().required().min(5).max(255).email(),
  password: Joi.string().required().min(4).max(1024),
});

const validate = (schema, model) => {
  const result = schema.validate(model);
  return result;
};

const getErrorMessage = (error) => {
  const { details } = error;
  return details.map((d) => d.message).join(" ");
};

module.exports = {
  rentalSchema,
  customerSchema,
  movieSchema,
  genreSchema,
  userSchema,
  loginSchema,
  validate,
  getErrorMessage,
};
