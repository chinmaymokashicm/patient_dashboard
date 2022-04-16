const mongoose = require("mongoose");

const allergies = mongoose.Schema(
  {
    CODE: String,
    DESCRIPTION: String,
    ENCOUNTER: Number,
    PATIENT: String,
    START: String,
    STOP: String,
  },
  {
    collection: "allergies",
  }
);

module.exports = mongoose.model("allergies", allergies);
