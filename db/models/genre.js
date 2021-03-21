const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
});

const Genre = mongoose.model("Genre", genreSchema);
module.exports = {
  Genre,
  genreSchema,
};
