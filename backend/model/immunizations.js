const mongoose = require("mongoose");

const immunizations = mongoose.Schema(
  {
    BASE_COST: Number,
    CODE: String,
    DATE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    PATIENT: String,
  },
  {
    collection: "immunizations",
  }
);

module.exports = mongoose.model("immunizations", immunizations);
