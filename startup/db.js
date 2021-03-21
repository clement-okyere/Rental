const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(config.get("db"), { useNewUrlParser: true })
    .then(() => winston.info(`Connected to ${db}....`))
    .catch((err) => winston.error(`could not connect to ${db}`, err));
};
