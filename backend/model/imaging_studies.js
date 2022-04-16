const mongoose = require("mongoose");

const imaging_studies = mongoose.Schema(
  {
    BODYSITE_CODE: String,
    BODYSITE_DESCRIPTION: String,
    DATE: String,
    ENCOUNTER: String,
    Id: String,
    INSTANCE_UID: String,
    MODALITY_CODE: String,
    MODALITY_DESCRIPTION: String,
    PATIENT: String,
    PROCEDURE_CODE: String,
    SERIES_CODE: String,
    SOP_CODE: String,
    SOP_DESCRIPTION: String,
  },
  {
    collection: "imaging_studies",
  }
);

module.exports = mongoose.model("imaging_studies", imaging_studies);
