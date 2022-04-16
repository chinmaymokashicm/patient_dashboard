const mongoose = require("mongoose");

const conditions = mongoose.Schema(
  {
    CODE: String,
    DESCRIPTION: String,
    ENCOUNTER: String,
    PATIENT: String,
    START: String,
    STOP: String,
  },
  {
    collection: "conditions",
  }
);

module.exports = mongoose.model("conditions", conditions);
