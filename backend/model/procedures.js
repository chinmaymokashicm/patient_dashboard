const mongoose = require("mongoose");

const procedures = mongoose.Schema(
  {
    BASE_COST: Number,
    CODE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    PATIENT: String,
    REASONCODE: Number,
    REASONDESCRIPTION: String,
    START: String,
    STOP: String,
  },
  {
    collection: "procedures",
  }
);

module.exports = mongoose.model("procedures", procedures);
