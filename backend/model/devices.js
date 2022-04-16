const mongoose = require("mongoose");

const devices = mongoose.Schema(
  {
    CODE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    PATIENT: String,
    START: String,
    STOP: String,
    UDI: String,
  },
  {
    collection: "devices",
  }
);

module.exports = mongoose.model("devices", devices);
