const mongoose = require("mongoose");

const organizations = mongoose.Schema(
    {
        ADDRESS: String,
        CITY: String,
        Id: String,
        LAT: Number,
        LON: Number,
        NAME: String,
        PHONE: String,
        REVENUE: String,
        STATE: String,
        UTILIZATION: Number,
        ZIP: Number,
    },
    {
      collection: "organizations",
    }
  );
  

  module.exports = mongoose.model("organizations", organizations)