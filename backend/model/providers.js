const mongoose = require("mongoose");

const providers = mongoose.Schema(
    {
        ADDRESS: String,
        CITY: String,
        GENDER: String,
        Id: String,
        LAT: Number,
        LON: Number,
        NAME: String,
        ORGANIZATION: String,
        SPECIALITY: String,
        STATE: String,
        UTILIZATION: Number,
        ZIP: Number,
    },
    {
      collection: "providers",
    }
  );
  

  module.exports = mongoose.model("providers", providers)