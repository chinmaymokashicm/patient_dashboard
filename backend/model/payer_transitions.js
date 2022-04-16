const mongoose = require("mongoose");

const payer_transitions = mongoose.Schema(
  {
    END_YEAR: Number,
    OWNERSHIP: String,
    PATIENT: String,
    PAYER: String,
    START_YEAR: Number,
  },
  {
    collection: "payer_transitions",
  }
);

module.exports = mongoose.model("payer_transitions", payer_transitions);
