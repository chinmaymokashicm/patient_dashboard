const mongoose = require("mongoose");

const observations = mongoose.Schema(
  {
    CODE: String,
    DATE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    PATIENT: String,
    TYPE: String,
    UNITS: String,
    VALUE: Number,
  },
  {
    collection: "observations",
  }
);

module.exports = mongoose.model("observations", observations);
