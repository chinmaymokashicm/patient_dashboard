const mongoose = require("mongoose");

const supplies = mongoose.Schema(
  {
    CODE: String,
    DATE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    PATIENT: String,
    QUANTITY: Number,
  },
  {
    collection: "supplies",
  }
);

module.exports = mongoose.model("supplies", supplies);
