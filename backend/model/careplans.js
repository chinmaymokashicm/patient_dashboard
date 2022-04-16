const mongoose = require("mongoose");

const careplans = mongoose.Schema(
  {
    CODE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    Id: String,
    PATIENT: String,
    REASONCODE: Number,
    REASONDESCRIPTION: Number,
    START: String,
    STOP: String
  },
  {
    collection: "careplans",
  }
);

module.exports = mongoose.model("careplans", careplans);
