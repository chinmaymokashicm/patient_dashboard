const mongoose = require("mongoose");

const encounters = mongoose.Schema(
    {
      Id: String,
      START: String,
      STOP: String,
      PATIENT: String,
      ORGANIZATION: String,
      PROVIDER: String,
      PAYER: String,
      ENCOUNTERCLASS: String,
      CODE: String,
      DESCRIPTION: String,
      BASE_ENCOUNTER_COST: Number,
      TOTAL_CLAIM_COST: Number,
      PAYER_COVERAGE: Number,
      REASONCODE: Number,
      REASONDESCRIPTION: String,
    },
    {
      collection: "encounters",
    }
  );
  

  module.exports = mongoose.model("encounters", encounters)