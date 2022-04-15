const mongoose = require("mongoose");

const patients = mongoose.Schema(
  {
    Id: String,
    BIRTHDATE: String,
    DEATHDATE: String,
    PREFIX: String,
    SUFFIX: String,
    MARITAL: String,
    RACE: String,
    ETHNICITY: String,
    GENDER: String,
    BIRTHPLACE: String,
    CITY: String,
    STATE: String,
    COUNTY: String,
    HEALTHCARE_EXPENSES: Number,
    HEALTHCARE_COVERAGE: Number,
  },
  {
    collection: "patients",
  }
);


module.exports = mongoose.model("patients", patients)
