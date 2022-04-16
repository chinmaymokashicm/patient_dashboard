const mongoose = require("mongoose");

const medications = mongoose.Schema(
  {
    BASE_COST: Number,
    CODE: String,
    DESCRIPTION: String,
    DISPENSES: Number,
    ENCOUNTER: String,
    PATIENT: String,
    PAYER: String,
    PAYER_COVERAGE: Number,
    REASONCODE: Number,
    REASONDESCRIPTION: String,
    START: String,
    STOP: String,
    TOTALCOST: Number,
  },
  {
    collection: "medications",
  }
);

module.exports = mongoose.model("medications", medications);
