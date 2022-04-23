const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();

const allergies = require("../model/allergies");
const careplans = require("../model/careplans");
const conditions = require("../model/conditions");
const devices = require("../model/devices");
const encounters = require("../model/encounters");
const imaging_studies = require("../model/imaging_studies");
const immunizations = require("../model/immunizations");
const medications = require("../model/medications");
const observations = require("../model/observations");
const organizations = require("../model/organizations");
const patients = require("../model/patients");
const payer_transitions = require("../model/payer_transitions");
const payers = require("../model/payers");
const procedures = require("../model/procedures");
const providers = require("../model/providers");
const supplies = require("../model/supplies");

const collectionsObject = {
  allergies: allergies,
  careplans: careplans,
  conditions: conditions,
  devices: devices,
  encounters: encounters,
  imaging_studies: imaging_studies,
  immunizations: immunizations,
  medications: medications,
  observations: observations,
  organizations: organizations,
  patients: patients,
  payer_transitions: payer_transitions,
  payers: payers,
  procedures: procedures,
  providers: providers,
  supplies: supplies,
};

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!("query" in req.body)) {
      query = {};
    } else {
      query = req.body.query;
    }
    if (!("limit" in req.body)) {
      limitQuery = 10;
    } else {
      limitQuery = req.body.limit;
    }
    if (!("collection" in req.body)) {
      res.status(400).json({
        message: "Collection not requested!",
      });
    }
    collection = req.body.collection;
    if (!("fields" in req.body)) {
      fields = { _id: 0 };
    } else {
      fields = req.body.fields;
    }
    if (!("sort" in req.body)) {
      sortBy = {};
    } else {
      sortBy = req.body.sort;
    }
    if(!(collection in collectionsObject)){
      res.status(400).json({
        message: "Incorrect collection!",
      });
    }
    queryCollection = collectionsObject[collection]
    if(req.body.aggregate === undefined){
      const result = await queryCollection
        .find(query, fields)
        .sort(sortBy)
        .limit(limitQuery);
      res.status(200).json({
        result: result,
      });
    }
    else{
      const result = await queryCollection.aggregate(req.body.aggregate)
      res.status(200).json({
        result: result,
      });
    }
  })
);

module.exports = router;
