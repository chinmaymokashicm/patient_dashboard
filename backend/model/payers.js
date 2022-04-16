const mongoose = require("mongoose");

const payers = mongoose.Schema(
    {
      ADDRESS: String,
      AMOUNT_COVERED: Number,
      AMOUNT_UNCOVERED: Number,
      CITY: String,
      COVERED_ENCOUNTERS: Number,
      COVERED_IMMUNIZATIONS: Number,
      COVERED_MEDICATIONS: Number,
      COVERED_PROCEDURES: Number,
      Id: String,
      MEMBER_MONTHS: Number,
      NAME: String,
      PHONE: String,
      QOLS_AVG: Number,
      REVENUE: Number,
    },
    {
      collection: "payers",
    }
  );
  

  module.exports = mongoose.model("payers", payers)